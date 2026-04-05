'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Clock,
  Database,
  FileText,
  ChevronRight,
  ExternalLink,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { SourceBadge } from '@/components/shared/Badges';
import { EmptyState, ErrorState } from '@/components/shared/EmptyState';
import { TableRowSkeleton } from '@/components/shared/Skeletons';
import { JsonViewer } from '@/components/shared/JsonViewer';
import { useAuditHistory } from '@/hooks/useAudit';

// Mock data for demo purposes since audit endpoint may not be fully implemented
const MOCK_AUDIT_DATA = [
  {
    id: 'audit-001',
    audit_request_id: 'req-abc123',
    timestamp: '2024-01-15T10:30:00Z',
    query_name: 'John Smith',
    sources: ['OFAC', 'EU', 'UN'],
    grouped: true,
    result_count: 5,
    execution_time_ms: 234,
    document_versions: {
      OFAC: 'SDN-2024-01-10',
      EU: 'EU-2024-01-12',
      UN: 'UN-2024-01-08'
    }
  },
  {
    id: 'audit-002',
    audit_request_id: 'req-def456',
    timestamp: '2024-01-15T09:15:00Z',
    query_name: 'Acme Corporation',
    sources: ['OFAC', 'UK'],
    grouped: false,
    result_count: 12,
    execution_time_ms: 456,
    document_versions: {
      OFAC: 'SDN-2024-01-10',
      UK: 'UK-2024-01-11'
    }
  },
];

export default function AuditPage() {
  const { data: auditData, isLoading, error, refetch } = useAuditHistory();
  const [selectedAudit, setSelectedAudit] = useState(null);
  const [searchFilter, setSearchFilter] = useState('');

  // Use mock data if no real data available
  const displayData = auditData?.length > 0 ? auditData : MOCK_AUDIT_DATA;
  const filteredData = displayData.filter(item =>
    item.query_name?.toLowerCase().includes(searchFilter.toLowerCase()) ||
    item.audit_request_id?.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Audit History</h1>
        <p className="text-muted-foreground mt-1">
          Review previous searches, including query parameters, sources searched, and document versions.
        </p>
      </div>

      {/* Filters */}
      <Card className="border-border/50 bg-card/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or request ID..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Audit Table */}
      <Card className="border-border/50 bg-card/50">
        <CardContent className="p-0">
          {isLoading ? (
            <div>
              <TableRowSkeleton columns={6} />
              <TableRowSkeleton columns={6} />
              <TableRowSkeleton columns={6} />
            </div>
          ) : error ? (
            <ErrorState
              title="Failed to load audit history"
              description="Could not fetch audit data. Please try again."
              onRetry={refetch}
            />
          ) : filteredData.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No audit records"
              description="No search history found. Audit records will appear here after performing searches."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Query</TableHead>
                  <TableHead>Sources</TableHead>
                  <TableHead>Results</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((audit) => (
                  <TableRow
                    key={audit.id}
                    className="cursor-pointer hover:bg-muted/30"
                    onClick={() => setSelectedAudit(audit)}
                  >
                    <TableCell>
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {audit.audit_request_id?.slice(0, 12)}...
                      </code>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-foreground">{audit.query_name}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(audit.timestamp).toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {audit.sources?.map((source) => (
                          <SourceBadge key={source} source={source} />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{audit.result_count}</span>
                      <span className="text-muted-foreground ml-1">
                        {audit.grouped ? '(grouped)' : '(ungrouped)'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {audit.execution_time_ms}ms
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Audit Detail Dialog */}
      <Dialog open={!!selectedAudit} onOpenChange={() => setSelectedAudit(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Audit Details</DialogTitle>
            <DialogDescription>
              Request ID: {selectedAudit?.audit_request_id}
            </DialogDescription>
          </DialogHeader>

          {selectedAudit && (
            <div className="space-y-6 py-4">
              {/* Request Parameters */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">Request Parameters</h3>
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground">Query Name</p>
                    <p className="font-medium text-foreground">{selectedAudit.query_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Timestamp</p>
                    <p className="font-medium text-foreground">
                      {new Date(selectedAudit.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Grouped</p>
                    <p className="font-medium text-foreground">
                      {selectedAudit.grouped ? 'Yes' : 'No'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Result Count</p>
                    <p className="font-medium text-foreground">{selectedAudit.result_count}</p>
                  </div>
                </div>
              </div>

              {/* Sources Searched */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">Sources Searched</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedAudit.sources?.map((source) => (
                    <SourceBadge key={source} source={source} />
                  ))}
                </div>
              </div>

              {/* Document Versions */}
              {selectedAudit.document_versions && (
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3">Document Versions</h3>
                  <div className="space-y-2">
                    {Object.entries(selectedAudit.document_versions).map(([source, version]) => (
                      <div key={source} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                        <SourceBadge source={source} />
                        <code className="text-xs text-muted-foreground">{version}</code>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Raw Data */}
              <JsonViewer data={selectedAudit} title="Raw Audit Data" />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
