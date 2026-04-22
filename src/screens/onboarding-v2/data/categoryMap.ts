/**
 * Maps onboarding category ids to backend template categories.
 */
export const CATEGORY_MAP: Record<string, readonly string[]> = {
  craft: ['creativity', 'learning'],
  focus: ['productivity'],
  health: ['health_fitness', 'longevity'],
  mind: ['mindfulness', 'mental_health'],
  morning: ['morning_routine'],
  movement: ['health_fitness'],
  recovery: ['recovery', 'mental_health'],
  sleep: ['sleep'],
};

export function resolveBackendCategories(onboardingIds: string[]): Set<string> {
  const set = new Set<string>();
  for (const id of onboardingIds) {
    for (const backend of CATEGORY_MAP[id] ?? []) {
      set.add(backend);
    }
  }
  return set;
}
