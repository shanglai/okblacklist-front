'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, ExternalLink, Clock, Hash, MapPin, User } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { MatchBandBadge, SourceBadge, EntityTypeBadge } from '@/components/shared/Badges';
import { DecisionActionBar } from './DecisionActionBar';

export function GroupedResultCard({ group, onViewDetail }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-border bg-card overflow-hidden"
    >
      {/* Group Header */}
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-foreground">
              {group.group_summary_name || 'Unknown Entity'}
            </h3>
            <MatchBandBadge band={group.group_confidence || 'MEDIUM'} />
            <span className="text-sm text-muted-foreground">Rank #{group.rank || 1}</span>
          </div>
          <div className="flex items-center flex-wrap gap-2">
            {(group.found_in || []).map((source, idx) => (
              <SourceBadge key={idx} source={source} />
            ))}
            {group.entity_type && <EntityTypeBadge type={group.entity_type} />}
          </div>
        </div>
        <Button variant="ghost" size="icon">
          {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </Button>
      </div>

      {/* Source Records Accordion */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-border"
          >
            <Accordion type="multiple" className="w-full">
              {(group.source_records || []).map((record, idx) => (
                <AccordionItem key={idx} value={`record-${idx}`} className="border-b border-border last:border-b-0">
                  <AccordionTrigger className="px-4 py-3 hover:bg-muted/20">
                    <div className="flex items-center gap-3 text-left">
                      <SourceBadge source={record.source} />
                      <span className="text-sm font-medium text-foreground">{record.name}</span>
                      <MatchBandBadge band={record.match_band || 'MEDIUM'} />
                      <span className="text-xs text-muted-foreground">
                        Score: {Math.round((record.match_score || 0) * 100)}%
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <SourceRecordDetail record={record} onViewDetail={onViewDetail} />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function SourceRecordDetail({ record, onViewDetail }) {
  return (
    <div className="px-4 pb-4 space-y-4">
      {/* Match Reasons */}
      {record.match_reasons && record.match_reasons.length > 0 && (
        <div className="p-3 rounded-lg bg-muted/30">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Why it matched</h4>
          <ul className="space-y-1">
            {record.match_reasons.map((reason, idx) => (
              <li key={idx} className="text-sm text-foreground flex items-start gap-2">
                <span className="text-blue-500">•</span>
                {reason}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Matched Terms */}
      {record.matched_terms && record.matched_terms.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Matched Terms</h4>
          <div className="flex flex-wrap gap-1">
            {record.matched_terms.map((term, idx) => (
              <span key={idx} className="px-2 py-0.5 text-xs bg-blue-500/10 text-blue-400 rounded">
                {term}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        {record.source_entity_id && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Hash className="w-4 h-4" />
            <span>ID: {record.source_entity_id}</span>
          </div>
        )}
        {record.source_published_at && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Published: {new Date(record.source_published_at).toLocaleDateString()}</span>
          </div>
        )}
        {record.countries && record.countries.length > 0 && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{record.countries.join(', ')}</span>
          </div>
        )}
        {record.aliases && record.aliases.length > 0 && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="w-4 h-4" />
            <span>Aliases: {record.aliases.slice(0, 3).join(', ')}{record.aliases.length > 3 ? '...' : ''}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <DecisionActionBar
          entityId={record.id || record.source_entity_id}
          source={record.source}
          currentDecision={record.decision_status}
        />
        <Button variant="outline" size="sm" onClick={() => onViewDetail?.(record)}>
          <ExternalLink className="w-4 h-4 mr-1" />
          View Full Details
        </Button>
      </div>
    </div>
  );
}

export function UngroupedResultCard({ record, onViewDetail }) {
  return (
    <Card className="border-border/50 bg-card/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-foreground">{record.name}</h3>
            <MatchBandBadge band={record.match_band || 'MEDIUM'} />
          </div>
          <SourceBadge source={record.source} />
        </div>
        <div className="flex items-center gap-2 mt-1">
          {record.entity_type && <EntityTypeBadge type={record.entity_type} />}
          <span className="text-xs text-muted-foreground">
            Score: {Math.round((record.match_score || 0) * 100)}%
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <SourceRecordDetail record={record} onViewDetail={onViewDetail} />
      </CardContent>
    </Card>
  );
}
