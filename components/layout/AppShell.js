'use client';

import { motion } from 'framer-motion';
import { SidebarNav } from './SidebarNav';
import { TopBar } from './TopBar';

export function AppShell({ children }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <SidebarNav />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar />
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1 overflow-auto p-6"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
