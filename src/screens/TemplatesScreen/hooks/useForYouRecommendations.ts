/**
 * Recommendation engine — suggests complementary templates based on user habits.
 * Uses Mere Exposure (Zajonc, 1968) via connection cues to bridge familiarity.
 */

import { useMemo } from 'react';
import type { Doc } from '../../../../convex/_generated/dataModel';
import type { ForYouRecommendation } from '../components/ForYouSection/ForYouSection.types';

const MAX_RECS = 3;

/* eslint-disable max-len */
/** Complementary category pairs — if user tracks left-side, suggest right-side */
const COMPLEMENTS: Record<string, string[]> = {
  breathing: ['mindfulness', 'mental_health', 'recovery'],
  creativity: ['productivity', 'learning'],
  financial: ['productivity', 'learning'],
  health_fitness: ['mindfulness', 'recovery', 'longevity'],
  learning: ['productivity', 'creativity'],
  longevity: ['health_fitness', 'recovery', 'sleep'],
  mental_health: ['mindfulness', 'breathing', 'social'],
  mindfulness: ['health_fitness', 'sleep', 'breathing'],
  morning_routine: ['sleep', 'productivity'],
  productivity: ['learning', 'morning_routine'],
  recovery: ['health_fitness', 'sleep', 'longevity'],
  sleep: ['morning_routine', 'mindfulness', 'recovery'],
  social: ['mental_health', 'creativity'],
};

const SOCIAL_PROOF: Record<string, { cue: string; highlight: string }> = {
  health_fitness: { cue: '78% of fitness users also do this', highlight: '78% of fitness users' },
  mindfulness: { cue: '82% of meditators add this habit', highlight: '82% of meditators' },
  morning_routine: { cue: '76% of early risers track this too', highlight: '76% of early risers' },
  productivity: { cue: '71% of productive users track this', highlight: '71% of productive users' },
  sleep: { cue: '85% of sleep-focused users add this', highlight: '85% of sleep-focused users' },
};
/* eslint-enable max-len */

const DEFAULT_PROOF = { cue: '73% of active users also do this', highlight: '73% of active users' };

function findUserCategories(templates: Doc<'templates'>[], habitNames: string[]) {
  const nameSet = new Set(habitNames.map((n) => n.toLowerCase()));
  const categories = new Set<string>();
  const matchedNames = new Map<string, string>();
  for (const t of templates) {
    if (nameSet.has(t.name.toLowerCase())) {
      categories.add(t.category);
      matchedNames.set(t.category, t.name);
    }
  }
  return { categories, matchedNames };
}

function makeCue(
  template: Doc<'templates'>,
  matchedNames: Map<string, string>,
  userCats: Set<string>,
): ForYouRecommendation {
  const sourceCat = [...userCats].find((c) => COMPLEMENTS[c]?.includes(template.category));
  const sourceName = sourceCat ? matchedNames.get(sourceCat) : undefined;
  if (sourceName) {
    return { connectionCue: `Complements your ${sourceName}`, cueHighlight: 'Complements', template };
  }
  const proof = SOCIAL_PROOF[template.category] ?? DEFAULT_PROOF;
  return { connectionCue: proof.cue, cueHighlight: proof.highlight, template };
}

export function useForYouRecommendations(
  allTemplates: Doc<'templates'>[] | undefined,
  userHabitNames: string[],
): ForYouRecommendation[] {
  return useMemo(() => {
    if (!allTemplates || userHabitNames.length === 0) return [];

    const { categories: userCats, matchedNames } = findUserCategories(allTemplates, userHabitNames);
    const tracked = new Set(userHabitNames.map((n) => n.toLowerCase()));
    const byPopularity = [...allTemplates].sort(
      (a, b) => (b.popularityScore ?? 0) - (a.popularityScore ?? 0),
    );

    // Build complementary category set (categories user doesn't already track)
    const targetCats = new Set<string>();
    for (const cat of userCats) {
      for (const comp of COMPLEMENTS[cat] ?? []) {
        if (!userCats.has(comp)) targetCats.add(comp);
      }
    }

    const candidates = byPopularity.filter(
      (t) => targetCats.has(t.category) && !tracked.has(t.name.toLowerCase()),
    );

    if (candidates.length > 0) {
      return candidates.slice(0, MAX_RECS).map((t) => makeCue(t, matchedNames, userCats));
    }

    // Fallback: top popular templates not already tracked
    return byPopularity
      .filter((t) => !tracked.has(t.name.toLowerCase()))
      .slice(0, 2)
      .map((t) => makeCue(t, matchedNames, userCats));
  }, [allTemplates, userHabitNames]);
}
