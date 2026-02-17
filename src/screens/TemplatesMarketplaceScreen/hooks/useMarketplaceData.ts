/**
 * Hook for fetching marketplace templates data
 */

import { useEffect, useState } from 'react';
import { useQuery } from 'convex/react';
import type { Doc } from '@/convex/_generated/dataModel';
import { api } from '@/convex/_generated/api';

interface MarketplaceData {
  featuredTemplates: Doc<'templates'>[];
  seasonalCollections: Record<string, Doc<'templates'>[]>;
  topRatedTemplates: Doc<'templates'>[];
  fitnessTemplates: Doc<'templates'>[];
  mindfulnessTemplates: Doc<'templates'>[];
  productivityTemplates: Doc<'templates'>[];
  healthTemplates: Doc<'templates'>[];
  searchResults: Doc<'templates'>[];
  isLoading: boolean;
}

export function useMarketplaceData(searchQuery: string): MarketplaceData {
  const [searchResults, setSearchResults] = useState<Doc<'templates'>[]>([]);

  // Fetch marketplace data
  const featuredTemplates = useQuery(api.getFeaturedTemplates, { limit: 6 }) || [];
  const seasonalCollections = useQuery(api.getAllSeasonalCollections) || {};
  const topRatedTemplates = useQuery(api.getTopRatedTemplates, { limit: 6 }) || [];
  const fitnessTemplates = useQuery(api.list, { category: 'health_fitness' as const }) || [];
  const mindfulnessTemplates = useQuery(api.list, { category: 'mindfulness' as const }) || [];
  const productivityTemplates = useQuery(api.list, { category: 'productivity' as const }) || [];
  
  // Use list for health (we have health_fitness as the category)
  const healthTemplates = useQuery(api.list, { category: 'health_fitness' as const }) || [];

  // Search templates when query changes
  const searchTemplates = useQuery(api.searchTemplates, {
    query: searchQuery || '',
    limit: 20,
  });

  useEffect(() => {
    if (searchTemplates) {
      setSearchResults(searchTemplates);
    } else {
      setSearchResults([]);
    }
  }, [searchTemplates]);

  const isLoading =
    featuredTemplates === undefined ||
    seasonalCollections === undefined ||
    topRatedTemplates === undefined;

  return {
    featuredTemplates,
    seasonalCollections,
    topRatedTemplates,
    fitnessTemplates,
    mindfulnessTemplates,
    productivityTemplates,
    healthTemplates,
    searchResults,
    isLoading,
  };
}
