/**
 * Data fetching hooks for templates
 */

import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

export function useTemplatesData() {
  const allTemplates = useQuery(api.templates.list, {});
  const categories = useQuery(api.categories.list, {});
  const usageCounts = useQuery(api.templates.getUsageCounts, {});
  const isLoading = allTemplates === undefined || categories === undefined;

  const importTemplate = useMutation(api.templates.importTemplate);
  const seedTemplates = useMutation(api.templates.seedTemplates);
  const seedAdditionalTemplates = useMutation(
    api.templates.seedAdditionalTemplates
  );
  const seedNewScienceTemplates = useMutation(
    api.templates.seedNewScienceTemplates
  );
  const seedPremiumTemplates = useMutation(
    api.templates.seedPremiumTemplates
  );

  // Separate premium and free templates
  const premiumTemplates = allTemplates?.filter((t) => t.isPremium) ?? [];
  const freeTemplates = allTemplates?.filter((t) => !t.isPremium) ?? [];

  return {
    allTemplates,
    categories,
    freeTemplates,
    importTemplate,
    isLoading,
    premiumTemplates,
    seedAdditionalTemplates,
    seedNewScienceTemplates,
    seedPremiumTemplates,
    seedTemplates,
    usageCounts: usageCounts ?? {},
  };
}

// Re-export filtered hooks for convenience
export {
  useCategoryCounts,
  useFilteredTemplates,
  useScienceCountsByCategory,
  useTemplatesByCategory,
} from './useFilteredTemplates';
