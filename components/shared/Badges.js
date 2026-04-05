'use client';

import { cn } from '@/lib/utils';

const bandColors = {
  HIGH: 'bg-red-500/10 text-red-500 border-red-500/30',
  MEDIUM: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
  LOW: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
  MANUAL: 'bg-violet-500/10 text-violet-500 border-violet-500/30',
};

const statusColors = {
  CLEAR: 'bg-green-500/10 text-green-500 border-green-500/30',
  REVIEW: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
  HIT: 'bg-red-500/10 text-red-500 border-red-500/30',
};

const sourceColors = {
  OFAC: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  EU: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
  UN: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
  UK: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  MANUAL: 'bg-violet-500/10 text-violet-400 border-violet-500/30',
};

export function MatchBandBadge({ band, className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold border',
        bandColors[band] || bandColors.LOW,
        className
      )}
    >
      {band}
    </span>
  );
}

export function DecisionStatusBadge({ status, className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold border',
        statusColors[status] || 'bg-muted text-muted-foreground border-border',
        className
      )}
    >
      {status}
    </span>
  );
}

export function SourceBadge({ source, className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border',
        sourceColors[source] || 'bg-muted text-muted-foreground border-border',
        className
      )}
    >
      {source}
    </span>
  );
}

export function EntityTypeBadge({ type, className }) {
  const typeIcons = {
    INDIVIDUAL: '👤',
    ENTITY: '🏢',
    VESSEL: '🚢',
    AIRCRAFT: '✈️',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-muted/50 text-muted-foreground',
        className
      )}
    >
      <span>{typeIcons[type] || '📋'}</span>
      {type}
    </span>
  );
}
