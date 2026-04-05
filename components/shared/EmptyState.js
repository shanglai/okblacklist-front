'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { FileQuestion, Search, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function EmptyState({
  icon: Icon = FileQuestion,
  title = 'No data',
  description = 'There is nothing to display here yet.',
  action,
  className,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex flex-col items-center justify-center py-16 px-8 text-center',
        className
      )}
    >
      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-muted/50 mb-4">
        <Icon className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">{description}</p>
      {action}
    </motion.div>
  );
}

export function SearchEmptyState() {
  return (
    <EmptyState
      icon={Search}
      title="No matches found"
      description="Try adjusting your search criteria or lowering the match threshold to see more results."
    />
  );
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'An unexpected error occurred. Please try again.',
  onRetry,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-8 text-center"
    >
      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-destructive/10 mb-4">
        <AlertCircle className="w-8 h-8 text-destructive" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">{description}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      )}
    </motion.div>
  );
}
