import { useMemo } from 'react';

import { api } from '../../../convex/_generated/api';
import { useCachedQuery } from '../../lib/queryCache';
import { resolveBackendCategories } from './data/categoryMap';

export interface DemoTemplate {
  _id: string;
  category: string;
  description: string;
  icon: string;
  iconColor: string;
  name: string;
  scientificReference?: string;
}

const DEMO_POOL_SIZE = 8;

export function useDemoTemplates(onboardingCategoryIds: string[]) {
  const raw = useCachedQuery(api.templates.list, {}, {
    entryName: 'templates.list',
  });

  return useMemo(() => {
    if (!raw) return null;
    const preferred = resolveBackendCategories(onboardingCategoryIds);
    const scored = raw.map((t) => ({
      score: preferred.has(t.category) ? 1 : 0,
      template: t,
    }));
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, DEMO_POOL_SIZE).map((s) => ({
      _id: s.template._id,
      category: s.template.category,
      description: s.template.description,
      icon: s.template.icon,
      iconColor: s.template.iconColor,
      name: s.template.name,
      scientificReference: s.template.scientificReference,
    })) as DemoTemplate[];
  }, [onboardingCategoryIds, raw]);
}
