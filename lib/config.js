/**
 * Central configuration module for the Sanctions Screening Platform
 * All runtime configuration values are loaded from environment variables
 * 
 * IMPORTANT: Production values must be supplied by the operator via environment variables.
 * Never hardcode secrets or API URLs in source code.
 */

export const config = {
  // Backend/BFF API Configuration
  // The frontend communicates ONLY with the backend API, never directly with databases
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://sanctions-backend-1056991374494.us-central1.run.app',
    endpoints: {
      search: process.env.NEXT_PUBLIC_SEARCH_ENDPOINT || '/api/v2/search',
      entityDetail: process.env.NEXT_PUBLIC_ENTITY_DETAIL_ENDPOINT || '/api/v2/entities',
      manualEntity: process.env.NEXT_PUBLIC_MANUAL_ENTITY_ENDPOINT || '/api/v2/entities/manual',
      decisions: process.env.NEXT_PUBLIC_DECISIONS_ENDPOINT || '/api/v2/decisions',
      usage: process.env.NEXT_PUBLIC_USAGE_ENDPOINT || '/api/usage/me',
      apiKeys: process.env.NEXT_PUBLIC_API_KEYS_ENDPOINT || '/api/keys',
    },
  },

  // Firebase Web Config for client-side authentication
  // Firebase handles auth in the browser, and the JWT is attached to backend requests
  firebase: {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
  },

  // Application settings
  app: {
    name: 'Durandal',
    description: 'Sanctions Screening Platform',
  },
};

// Validate required configuration
export function validateConfig() {
  const required = [
    ['API Base URL', config.api.baseUrl],
    ['Firebase API Key', config.firebase.apiKey],
    ['Firebase Auth Domain', config.firebase.authDomain],
    ['Firebase Project ID', config.firebase.projectId],
  ];

  const missing = required.filter(([name, value]) => !value);
  
  if (missing.length > 0) {
    console.warn('Missing required configuration:', missing.map(([name]) => name).join(', '));
  }

  return missing.length === 0;
}

export default config;
