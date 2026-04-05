'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { SearchFilters } from '@/components/search/SearchFilters';
import { SearchResultsContainer } from '@/components/search/SearchResultsContainer';
import { EntityDetailDrawer } from '@/components/search/EntityDetailDrawer';
import { useSearch } from '@/hooks/useSearch';

export default function SearchPage() {
  const { search, results, isLoading, error, reset } = useSearch();
  const [selectedEntity, setSelectedEntity] = useState(null);

  const handleSearch = (params) => {
    search(params);
  };

  const handleViewDetail = (entity) => {
    setSelectedEntity(entity);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Sanctions Search</h1>
        <p className="text-muted-foreground mt-1">
          Search across multiple sanctions lists including OFAC, EU, UN, and UK sources.
        </p>
      </div>

      {/* Search Filters */}
      <SearchFilters onSearch={handleSearch} isLoading={isLoading} />

      {/* Results */}
      <SearchResultsContainer
        results={results}
        isLoading={isLoading}
        error={error}
        onViewDetail={handleViewDetail}
      />

      {/* Entity Detail Drawer */}
      <AnimatePresence>
        {selectedEntity && (
          <EntityDetailDrawer
            entity={selectedEntity}
            onClose={() => setSelectedEntity(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
