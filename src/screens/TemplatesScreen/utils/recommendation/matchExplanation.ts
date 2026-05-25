import type { RecommendationReason } from './types';

export function generateWhyThisMatches(reasons: RecommendationReason[]): string {
  const top = reasons
    .filter((r) => r.contribution > 0)
    .sort((a, b) => b.contribution - a.contribution)
    .slice(0, 3);

  if (top.length === 0) return 'A great habit to build.';
  if (top.length === 1) return `${top[0].label}.`;
  if (top.length === 2) return `${top[0].label} and ${top[1].label.toLowerCase()}.`;
  return `${top[0].label}, ${top[1].label.toLowerCase()}, and ${top[2].label.toLowerCase()}.`;
}
