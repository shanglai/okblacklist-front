'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Card, CardContent } from '@/components/ui/card';

const SOURCES = ['OFAC', 'EU', 'UN', 'UK', 'MANUAL'];
const ENTITY_TYPES = ['INDIVIDUAL', 'ENTITY', 'VESSEL', 'AIRCRAFT'];
const MATCH_BANDS = ['LOW', 'MEDIUM', 'HIGH'];

export function SearchFilters({ onSearch, isLoading }) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filters, setFilters] = useState({
    name: '',
    dob: '',
    identifiers: [],
    sources: [],
    entity_types: [],
    countries: [],
    regimes: [],
    grouped: true,
    include_manual: true,
    min_match_band: 'LOW',
    page: 1,
    page_size: 20,
  });
  const [identifierInput, setIdentifierInput] = useState('');
  const [countryInput, setCountryInput] = useState('');

  const handleSearch = () => {
    const params = { ...filters };
    // Only send populated optional fields
    if (!params.dob) delete params.dob;
    if (!params.identifiers.length) delete params.identifiers;
    if (!params.sources.length) delete params.sources;
    if (!params.entity_types.length) delete params.entity_types;
    if (!params.countries.length) delete params.countries;
    if (!params.regimes.length) delete params.regimes;
    onSearch(params);
  };

  const addIdentifier = () => {
    if (identifierInput.trim()) {
      setFilters(f => ({ ...f, identifiers: [...f.identifiers, identifierInput.trim()] }));
      setIdentifierInput('');
    }
  };

  const removeIdentifier = (idx) => {
    setFilters(f => ({ ...f, identifiers: f.identifiers.filter((_, i) => i !== idx) }));
  };

  const addCountry = () => {
    if (countryInput.trim()) {
      setFilters(f => ({ ...f, countries: [...f.countries, countryInput.trim().toUpperCase()] }));
      setCountryInput('');
    }
  };

  const removeCountry = (idx) => {
    setFilters(f => ({ ...f, countries: f.countries.filter((_, i) => i !== idx) }));
  };

  const toggleSource = (source) => {
    setFilters(f => ({
      ...f,
      sources: f.sources.includes(source)
        ? f.sources.filter(s => s !== source)
        : [...f.sources, source]
    }));
  };

  const toggleEntityType = (type) => {
    setFilters(f => ({
      ...f,
      entity_types: f.entity_types.includes(type)
        ? f.entity_types.filter(t => t !== type)
        : [...f.entity_types, type]
    }));
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardContent className="p-4">
        {/* Quick Search Bar */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search names, aliases, identifiers..."
              value={filters.name}
              onChange={(e) => setFilters(f => ({ ...f, name: e.target.value }))}
              className="pl-10 h-12 text-lg bg-background/50"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button
            onClick={handleSearch}
            disabled={isLoading || !filters.name.trim()}
            className="h-12 px-6 bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Search className="w-5 h-5 mr-2" />
                Search
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="h-12"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </Button>
        </div>

        {/* Advanced Filters */}
        <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
          <CollapsibleContent>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 pt-6 border-t border-border space-y-6"
            >
              {/* Row 1: DOB and Match Threshold */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Date of Birth</Label>
                  <Input
                    type="date"
                    value={filters.dob}
                    onChange={(e) => setFilters(f => ({ ...f, dob: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Minimum Match Band</Label>
                  <Select
                    value={filters.min_match_band}
                    onValueChange={(v) => setFilters(f => ({ ...f, min_match_band: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MATCH_BANDS.map(band => (
                        <SelectItem key={band} value={band}>{band}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Page Size</Label>
                  <Select
                    value={String(filters.page_size)}
                    onValueChange={(v) => setFilters(f => ({ ...f, page_size: Number(v) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[10, 20, 50, 100].map(size => (
                        <SelectItem key={size} value={String(size)}>{size} results</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Row 2: Identifiers */}
              <div className="space-y-2">
                <Label>Identifiers</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Passport, ID number, etc."
                    value={identifierInput}
                    onChange={(e) => setIdentifierInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addIdentifier()}
                  />
                  <Button variant="outline" onClick={addIdentifier}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {filters.identifiers.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {filters.identifiers.map((id, idx) => (
                      <Badge key={idx} variant="secondary" className="gap-1">
                        {id}
                        <X className="w-3 h-3 cursor-pointer" onClick={() => removeIdentifier(idx)} />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Row 3: Sources */}
              <div className="space-y-2">
                <Label>Sources</Label>
                <div className="flex flex-wrap gap-2">
                  {SOURCES.map(source => (
                    <Badge
                      key={source}
                      variant={filters.sources.includes(source) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => toggleSource(source)}
                    >
                      {source}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Row 4: Entity Types */}
              <div className="space-y-2">
                <Label>Entity Types</Label>
                <div className="flex flex-wrap gap-2">
                  {ENTITY_TYPES.map(type => (
                    <Badge
                      key={type}
                      variant={filters.entity_types.includes(type) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => toggleEntityType(type)}
                    >
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Row 5: Countries */}
              <div className="space-y-2">
                <Label>Countries (ISO codes)</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="US, GB, RU, etc."
                    value={countryInput}
                    onChange={(e) => setCountryInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addCountry()}
                    maxLength={2}
                  />
                  <Button variant="outline" onClick={addCountry}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {filters.countries.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {filters.countries.map((c, idx) => (
                      <Badge key={idx} variant="secondary" className="gap-1">
                        {c}
                        <X className="w-3 h-3 cursor-pointer" onClick={() => removeCountry(idx)} />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Row 6: Toggles */}
              <div className="flex flex-wrap gap-8">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="grouped"
                    checked={filters.grouped}
                    onCheckedChange={(c) => setFilters(f => ({ ...f, grouped: c }))}
                  />
                  <Label htmlFor="grouped">Group similar results</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="include_manual"
                    checked={filters.include_manual}
                    onCheckedChange={(c) => setFilters(f => ({ ...f, include_manual: c }))}
                  />
                  <Label htmlFor="include_manual">Include manual entities</Label>
                </div>
              </div>
            </motion.div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
