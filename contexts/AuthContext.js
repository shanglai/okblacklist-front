'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthChange, logOut, getIdToken } from '@/lib/firebase';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    // Check for demo mode in localStorage
    const savedDemoMode = typeof window !== 'undefined' && localStorage.getItem('demoMode');
    if (savedDemoMode === 'true') {
      setUser({
        uid: 'demo-user-001',
        email: 'demo@durandal.io',
        displayName: 'Demo User',
        photoURL: null,
      });
      setDemoMode(true);
      setToken('demo-token');
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        });
        const idToken = await firebaseUser.getIdToken();
        setToken(idToken);
      } else {
        setUser(null);
        setToken(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginAsDemo = () => {
    setUser({
      uid: 'demo-user-001',
      email: 'demo@durandal.io',
      displayName: 'Demo User',
      photoURL: null,
    });
    setDemoMode(true);
    setToken('demo-token');
    if (typeof window !== 'undefined') {
      localStorage.setItem('demoMode', 'true');
    }
  };

  const logout = async () => {
    try {
      if (demoMode) {
        setUser(null);
        setToken(null);
        setDemoMode(false);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('demoMode');
        }
      } else {
        await logOut();
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const refreshToken = async () => {
    if (demoMode) return 'demo-token';
    const newToken = await getIdToken();
    setToken(newToken);
    return newToken;
  };

  const value = {
    user,
    token,
    loading,
    logout,
    refreshToken,
    loginAsDemo,
    demoMode,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
