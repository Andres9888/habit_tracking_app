/**
 * Data fetching hooks for templates
 */

import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

export function useTemplatesData() {
  const allTemplates = useQuery(api.templates.list, {});
  const categories = useQuery(api.categories.list, {});
  const isLoading = allTemplates === undefined || categories === undefined;

  const importTemplate = useMutation(api.templates.importTemplate);
  const seedTemplates = useMutation(api.templates.seedTemplates);

  return {
    allTemplates,
    categories,
    importTemplate,
    isLoading,
    seedTemplates,
  };
}

// Re-export filtered hooks for convenience
export {
  useCategoryCounts,
  useFilteredTemplates,
  useScienceCountsByCategory,
  useTemplatesByCategory,
} from './useFilteredTemplates';
