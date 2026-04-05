'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Copy, Check, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export function JsonViewer({ data, title = 'Raw Response', className }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className={cn('rounded-xl border border-border bg-card overflow-hidden', className)}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Code className="w-4 h-4" />
          {title}
        </div>
        <Button variant="ghost" size="sm" onClick={handleCopy}>
          {copied ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </Button>
      </div>
      <pre className="p-4 text-xs font-mono text-foreground overflow-auto max-h-96 bg-muted/10">
        {JSON.stringify(data, null, 2)}
      </pre>
    </motion.div>
  );
}
