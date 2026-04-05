'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, User, Building2, Loader2, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { SourceBadge, EntityTypeBadge } from '@/components/shared/Badges';
import { EmptyState, ErrorState } from '@/components/shared/EmptyState';
import { TableRowSkeleton } from '@/components/shared/Skeletons';
import { useManualEntities, useCreateManualEntity, useDeleteManualEntity } from '@/hooks/useManualEntities';
import { toast } from 'sonner';

export default function ManualEntitiesPage() {
  const { data: entities, isLoading, error, refetch } = useManualEntities();
  const createMutation = useCreateManualEntity();
  const deleteMutation = useDeleteManualEntity();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newEntity, setNewEntity] = useState({
    name: '',
    aliases: [],
    identifiers: [],
    dob: '',
    countries: [],
    addresses: [],
    note: '',
    entity_type: 'INDIVIDUAL',
  });
  const [aliasInput, setAliasInput] = useState('');
  const [identifierInput, setIdentifierInput] = useState('');
  const [countryInput, setCountryInput] = useState('');

  const handleCreate = () => {
    if (!newEntity.name.trim()) {
      toast.error('Name is required');
      return;
    }

    createMutation.mutate(newEntity, {
      onSuccess: () => {
        toast.success('Manual entity created successfully');
        setShowCreateDialog(false);
        setNewEntity({
          name: '',
          aliases: [],
          identifiers: [],
          dob: '',
          countries: [],
          addresses: [],
          note: '',
          entity_type: 'INDIVIDUAL',
        });
      },
      onError: () => {
        toast.error('Failed to create entity');
      },
    });
  };

  const handleDelete = (id) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast.success('Entity deleted');
      },
      onError: () => {
        toast.error('Failed to delete entity');
      },
    });
  };

  const addAlias = () => {
    if (aliasInput.trim()) {
      setNewEntity(e => ({ ...e, aliases: [...e.aliases, aliasInput.trim()] }));
      setAliasInput('');
    }
  };

  const addIdentifier = () => {
    if (identifierInput.trim()) {
      setNewEntity(e => ({ ...e, identifiers: [...e.identifiers, identifierInput.trim()] }));
      setIdentifierInput('');
    }
  };

  const addCountry = () => {
    if (countryInput.trim()) {
      setNewEntity(e => ({ ...e, countries: [...e.countries, countryInput.trim().toUpperCase()] }));
      setCountryInput('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manual Entities</h1>
          <p className="text-muted-foreground mt-1">
            Manage private entities for your workspace. These are searchable alongside public sanctions lists.
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Entity
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Manual Entity</DialogTitle>
              <DialogDescription>
                Add a private entity to your workspace. This entity will be searchable alongside public sanctions lists.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Name */}
              <div className="space-y-2">
                <Label>Name *</Label>
                <Input
                  value={newEntity.name}
                  onChange={(e) => setNewEntity(ne => ({ ...ne, name: e.target.value }))}
                  placeholder="Full legal name"
                />
              </div>

              {/* Entity Type */}
              <div className="space-y-2">
                <Label>Entity Type</Label>
                <div className="flex gap-2">
                  {['INDIVIDUAL', 'ENTITY', 'VESSEL', 'AIRCRAFT'].map(type => (
                    <Badge
                      key={type}
                      variant={newEntity.entity_type === type ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => setNewEntity(ne => ({ ...ne, entity_type: type }))}
                    >
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* DOB */}
              <div className="space-y-2">
                <Label>Date of Birth</Label>
                <Input
                  type="date"
                  value={newEntity.dob}
                  onChange={(e) => setNewEntity(ne => ({ ...ne, dob: e.target.value }))}
                />
              </div>

              {/* Aliases */}
              <div className="space-y-2">
                <Label>Aliases</Label>
                <div className="flex gap-2">
                  <Input
                    value={aliasInput}
                    onChange={(e) => setAliasInput(e.target.value)}
                    placeholder="Alternative name"
                    onKeyDown={(e) => e.key === 'Enter' && addAlias()}
                  />
                  <Button variant="outline" onClick={addAlias}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {newEntity.aliases.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {newEntity.aliases.map((alias, idx) => (
                      <Badge key={idx} variant="secondary" className="gap-1">
                        {alias}
                        <X
                          className="w-3 h-3 cursor-pointer"
                          onClick={() => setNewEntity(ne => ({ ...ne, aliases: ne.aliases.filter((_, i) => i !== idx) }))}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Identifiers */}
              <div className="space-y-2">
                <Label>Identifiers</Label>
                <div className="flex gap-2">
                  <Input
                    value={identifierInput}
                    onChange={(e) => setIdentifierInput(e.target.value)}
                    placeholder="Passport, ID number, etc."
                    onKeyDown={(e) => e.key === 'Enter' && addIdentifier()}
                  />
                  <Button variant="outline" onClick={addIdentifier}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {newEntity.identifiers.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {newEntity.identifiers.map((id, idx) => (
                      <Badge key={idx} variant="secondary" className="gap-1">
                        {id}
                        <X
                          className="w-3 h-3 cursor-pointer"
                          onClick={() => setNewEntity(ne => ({ ...ne, identifiers: ne.identifiers.filter((_, i) => i !== idx) }))}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Countries */}
              <div className="space-y-2">
                <Label>Countries (ISO codes)</Label>
                <div className="flex gap-2">
                  <Input
                    value={countryInput}
                    onChange={(e) => setCountryInput(e.target.value)}
                    placeholder="US, GB, RU"
                    maxLength={2}
                    onKeyDown={(e) => e.key === 'Enter' && addCountry()}
                  />
                  <Button variant="outline" onClick={addCountry}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {newEntity.countries.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {newEntity.countries.map((c, idx) => (
                      <Badge key={idx} variant="secondary" className="gap-1">
                        {c}
                        <X
                          className="w-3 h-3 cursor-pointer"
                          onClick={() => setNewEntity(ne => ({ ...ne, countries: ne.countries.filter((_, i) => i !== idx) }))}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Note */}
              <div className="space-y-2">
                <Label>Note / Reason</Label>
                <Textarea
                  value={newEntity.note}
                  onChange={(e) => setNewEntity(ne => ({ ...ne, note: e.target.value }))}
                  placeholder="Why is this entity being added?"
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={createMutation.isPending}>
                {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Create Entity
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Entities Table */}
      <Card className="border-border/50 bg-card/50">
        <CardContent className="p-0">
          {isLoading ? (
            <div>
              <TableRowSkeleton columns={5} />
              <TableRowSkeleton columns={5} />
              <TableRowSkeleton columns={5} />
            </div>
          ) : error ? (
            <ErrorState
              title="Failed to load entities"
              description="Could not fetch manual entities. Please try again."
              onRetry={refetch}
            />
          ) : !entities || entities.length === 0 ? (
            <EmptyState
              icon={User}
              title="No manual entities"
              description="You haven't created any manual entities yet. Add your first entity to get started."
              action={
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Entity
                </Button>
              }
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Countries</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entities.map((entity) => (
                  <TableRow key={entity.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{entity.name}</span>
                        <SourceBadge source="MANUAL" />
                      </div>
                      {entity.aliases && entity.aliases.length > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          AKA: {entity.aliases.slice(0, 2).join(', ')}{entity.aliases.length > 2 ? '...' : ''}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <EntityTypeBadge type={entity.entity_type || 'INDIVIDUAL'} />
                    </TableCell>
                    <TableCell>
                      {entity.countries && entity.countries.length > 0
                        ? entity.countries.join(', ')
                        : '-'}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {entity.created_at
                        ? new Date(entity.created_at).toLocaleDateString()
                        : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(entity.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
