/**
 * Central API client module
 * 
 * IMPORTANT ARCHITECTURE NOTES:
 * - The frontend talks ONLY to the BFF/backend API
 * - PostgreSQL and BigQuery are backend-only - frontend never connects directly
 * - Firebase ID token is attached as Bearer token to all requests
 * - The backend resolves workspace/user context from the token
 */

import axios from 'axios';
import { config } from './config';
import { getIdToken } from './firebase';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: config.api.baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach Firebase ID token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await getIdToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle auth failures
    if (error.response?.status === 401) {
      // Token expired or invalid - could trigger re-auth flow here
      console.error('Authentication error - session may have expired');
    }
    return Promise.reject(error);
  }
);

// API helper functions

/**
 * Search sanctions entities
 * POST /api/v2/search
 */
export const searchEntities = async (params) => {
  const response = await apiClient.post(config.api.endpoints.search, params);
  return response.data;
};

/**
 * Get entity details
 * GET /api/v2/entities/{id}
 */
export const getEntityDetail = async (id) => {
  const response = await apiClient.get(`${config.api.endpoints.entityDetail}/${id}`);
  return response.data;
};

/**
 * Create manual entity
 * POST /api/v2/entities/manual
 */
export const createManualEntity = async (entity) => {
  const response = await apiClient.post(config.api.endpoints.manualEntity, entity);
  return response.data;
};

/**
 * Get manual entities for workspace
 * GET /api/v2/entities/manual
 */
export const getManualEntities = async () => {
  const response = await apiClient.get(config.api.endpoints.manualEntity);
  return response.data;
};

/**
 * Delete manual entity
 * DELETE /api/v2/entities/manual/{id}
 */
export const deleteManualEntity = async (id) => {
  const response = await apiClient.delete(`${config.api.endpoints.manualEntity}/${id}`);
  return response.data;
};

/**
 * Submit analyst decision
 * POST /api/v2/decisions
 */
export const submitDecision = async (decision) => {
  const response = await apiClient.post(config.api.endpoints.decisions, decision);
  return response.data;
};

/**
 * Get decisions history
 * GET /api/v2/decisions
 */
export const getDecisions = async (params) => {
  const response = await apiClient.get(config.api.endpoints.decisions, { params });
  return response.data;
};

/**
 * Get usage/quota information
 * GET /api/usage/me
 */
export const getUsage = async () => {
  const response = await apiClient.get(config.api.endpoints.usage);
  return response.data;
};

/**
 * Get API keys
 * GET /api/keys
 */
export const getApiKeys = async () => {
  const response = await apiClient.get(config.api.endpoints.apiKeys);
  return response.data;
};

/**
 * Create new API key
 * POST /api/keys
 */
export const createApiKey = async (name) => {
  const response = await apiClient.post(config.api.endpoints.apiKeys, { name });
  return response.data;
};

/**
 * Revoke API key
 * DELETE /api/keys/{id}
 */
export const revokeApiKey = async (id) => {
  const response = await apiClient.delete(`${config.api.endpoints.apiKeys}/${id}`);
  return response.data;
};

/**
 * Get audit history
 * GET /api/v2/audit
 */
export const getAuditHistory = async (params) => {
  const response = await apiClient.get('/api/v2/audit', { params });
  return response.data;
};

export default apiClient;
