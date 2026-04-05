'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Hash,
  Clock,
  MapPin,
  User,
  FileText,
  Building2,
  Fingerprint,
  Globe,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MatchBandBadge, SourceBadge, EntityTypeBadge, DecisionStatusBadge } from '@/components/shared/Badges';
import { DecisionActionBar } from './DecisionActionBar';
import { JsonViewer } from '@/components/shared/JsonViewer';

export function EntityDetailDrawer({ entity, onClose }) {
  if (!entity) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="absolute right-0 top-0 h-full w-full max-w-2xl bg-card border-l border-border shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div>
            <h2 className="text-lg font-semibold text-foreground">{entity.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <SourceBadge source={entity.source} />
              {entity.entity_type && <EntityTypeBadge type={entity.entity_type} />}
              {entity.decision_status && <DecisionStatusBadge status={entity.decision_status} />}
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <ScrollArea className="h-[calc(100vh-80px)]">
          <Tabs defaultValue="overview" className="p-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="identifiers">Identifiers</TabsTrigger>
              <TabsTrigger value="raw">Raw Data</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-4">
              {/* Match Info */}
              {entity.match_score !== undefined && (
                <div className="p-4 rounded-lg bg-muted/30">
                  <h3 className="text-sm font-semibold text-foreground mb-3">Match Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Match Score</p>
                      <p className="text-lg font-semibold text-foreground">
                        {Math.round((entity.match_score || 0) * 100)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Match Band</p>
                      <MatchBandBadge band={entity.match_band || 'MEDIUM'} className="mt-1" />
                    </div>
                  </div>
                </div>
              )}

              {/* Match Reasons */}
              {entity.match_reasons && entity.match_reasons.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3">Why It Matched</h3>
                  <ul className="space-y-2">
                    {entity.match_reasons.map((reason, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Basic Info */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">Basic Information</h3>
                <div className="space-y-3">
                  {entity.source_entity_id && (
                    <InfoRow icon={Hash} label="Source Entity ID" value={entity.source_entity_id} />
                  )}
                  {entity.dob && (
                    <InfoRow icon={Clock} label="Date of Birth" value={entity.dob} />
                  )}
                  {entity.countries && entity.countries.length > 0 && (
                    <InfoRow icon={Globe} label="Countries" value={entity.countries.join(', ')} />
                  )}
                </div>
              </div>

              {/* Aliases */}
              {entity.aliases && entity.aliases.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3">Aliases</h3>
                  <div className="flex flex-wrap gap-2">
                    {entity.aliases.map((alias, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 text-xs bg-muted rounded-md text-muted-foreground"
                      >
                        {alias}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Addresses */}
              {entity.addresses && entity.addresses.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3">Addresses</h3>
                  <div className="space-y-2">
                    {entity.addresses.map((address, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>{typeof address === 'string' ? address : JSON.stringify(address)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Version Metadata */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">Version Metadata</h3>
                <div className="space-y-3 text-sm">
                  {entity.loaded_at && (
                    <InfoRow icon={Clock} label="Loaded At" value={new Date(entity.loaded_at).toLocaleString()} />
                  )}
                  {entity.source_published_at && (
                    <InfoRow icon={FileText} label="Source Published" value={new Date(entity.source_published_at).toLocaleString()} />
                  )}
                  {entity.document_edition && (
                    <InfoRow icon={FileText} label="Document Edition" value={entity.document_edition} />
                  )}
                </div>
              </div>

              {/* Decision Actions */}
              <Separator />
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">Analyst Decision</h3>
                <DecisionActionBar
                  entityId={entity.id || entity.source_entity_id}
                  source={entity.source}
                  currentDecision={entity.decision_status}
                />
              </div>
            </TabsContent>

            <TabsContent value="identifiers" className="space-y-4 mt-4">
              {entity.identifiers && entity.identifiers.length > 0 ? (
                <div className="space-y-3">
                  {entity.identifiers.map((id, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-muted/30">
                      <div className="flex items-center gap-2">
                        <Fingerprint className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-foreground">
                          {typeof id === 'string' ? id : id.value || id.number || JSON.stringify(id)}
                        </span>
                      </div>
                      {typeof id === 'object' && id.type && (
                        <p className="text-xs text-muted-foreground mt-1 ml-6">{id.type}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">No identifiers available</p>
              )}
            </TabsContent>

            <TabsContent value="raw" className="mt-4">
              <JsonViewer data={entity} title="Entity Data" />
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </motion.div>
    </motion.div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm text-foreground">{value}</p>
      </div>
    </div>
  );
}
