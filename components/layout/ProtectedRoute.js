'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Shield, Loader2 } from 'lucide-react';

const publicPaths = ['/login', '/signup', '/forgot-password'];

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user && !publicPaths.includes(pathname)) {
        router.push('/login');
      } else if (user && publicPaths.includes(pathname)) {
        router.push('/search');
      }
    }
  }, [user, loading, pathname, router]);

  // Show loading state while auth initializes
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading...</span>
          </div>
        </motion.div>
      </div>
    );
  }

  // Show nothing while redirecting
  if (!user && !publicPaths.includes(pathname)) {
    return null;
  }

  if (user && publicPaths.includes(pathname)) {
    return null;
  }

  return children;
}
