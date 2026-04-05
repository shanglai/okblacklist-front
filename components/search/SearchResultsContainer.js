'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Code, Clock, Database, Hash, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { GroupedResultCard, UngroupedResultCard } from './SearchResults';
import { SearchEmptyState, ErrorState } from '@/components/shared/EmptyState';
import { SearchResultSkeleton } from '@/components/shared/Skeletons';
import { JsonViewer } from '@/components/shared/JsonViewer';

export function SearchResultsContainer({ results, isLoading, error, onViewDetail }) {
  const [showRawJson, setShowRawJson] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <SearchResultSkeleton />
        <SearchResultSkeleton />
        <SearchResultSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Search failed"
        description={error.message || 'An error occurred while searching. Please try again.'}
      />
    );
  }

  if (!results) {
    return null;
  }

  const hasResults = results.results && results.results.length > 0;
  const isGrouped = results.grouped;

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-foreground">
            {results.total_count || 0} Results
          </h2>
          {results.audit_request_id && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Hash className="w-3 h-3" />
              {results.audit_request_id}
            </span>
          )}
          {results.execution_time_ms && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {results.execution_time_ms}ms
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="showJson"
              checked={showRawJson}
              onCheckedChange={setShowRawJson}
            />
            <Label htmlFor="showJson" className="text-sm text-muted-foreground flex items-center gap-1">
              <Code className="w-4 h-4" />
              View raw JSON
            </Label>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      {(results.db_query_time_ms || results.matching_time_ms || results.grouping_time_ms) && (
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {results.db_query_time_ms && (
            <span className="flex items-center gap-1">
              <Database className="w-3 h-3" />
              DB: {results.db_query_time_ms}ms
            </span>
          )}
          {results.matching_time_ms && (
            <span>Matching: {results.matching_time_ms}ms</span>
          )}
          {results.grouping_time_ms && (
            <span>Grouping: {results.grouping_time_ms}ms</span>
          )}
        </div>
      )}

      {/* Warnings */}
      {results.warnings && results.warnings.length > 0 && (
        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5" />
            <div>
              {results.warnings.map((warning, idx) => (
                <p key={idx} className="text-sm text-amber-500">{warning}</p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Raw JSON View */}
      <AnimatePresence>
        {showRawJson && <JsonViewer data={results} title="Raw API Response" />}
      </AnimatePresence>

      {/* Results List */}
      {hasResults ? (
        <div className="space-y-4">
          {isGrouped
            ? results.results.map((group, idx) => (
                <GroupedResultCard key={idx} group={group} onViewDetail={onViewDetail} />
              ))
            : results.results.map((record, idx) => (
                <UngroupedResultCard key={idx} record={record} onViewDetail={onViewDetail} />
              ))
          }
        </div>
      ) : (
        <SearchEmptyState />
      )}

      {/* Pagination */}
      {results.total_pages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="sm"
            disabled={results.page <= 1}
            onClick={() => setCurrentPage(p => p - 1)}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {results.page} of {results.total_pages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={results.page >= results.total_pages}
            onClick={() => setCurrentPage(p => p + 1)}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
