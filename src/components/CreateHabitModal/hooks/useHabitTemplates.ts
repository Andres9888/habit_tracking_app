
import { useMemo } from 'react';

import { useQuery } from 'convex/react';

import type { Category, HabitTemplate } from '../types';
import { api } from '../../../../convex/_generated/api';

export const useHabitTemplates = (category: Category) => {
  const templates = useQuery(api.templates.list, {});
  const isLoading = templates === undefined;

  const filtered = useMemo(() => {
    if (!templates) return [];
    if (category === 'all') return templates;
    return templates.filter((template) => template.category === category);
  }, [category, templates]);

  return { filtered, isLoading };
};
