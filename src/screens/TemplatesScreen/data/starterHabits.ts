/**
 * Curated starter habits for first-time library users.
 */

import type { Doc } from '../../../../convex/_generated/dataModel';

export const STARTER_HABIT_LABELS = [
  { emoji: '💧', name: 'Drink Water' },
  { emoji: '🧘', name: '2-Min Meditate' },
  { emoji: '📝', name: 'Gratitude' },
  { emoji: '🚶', name: '10-Min Walk' },
  { emoji: '📖', name: 'Read 1 Page' },
] as const;

const normalize = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

function matchesStarterLabel(templateName: string, label: string) {
  const t = normalize(templateName);
  const l = normalize(label);
  return t.includes(l) || l.includes(t);
}

export function filterStarterTemplates(
  allTemplates: Doc<'templates'>[] | undefined
): Doc<'templates'>[] {
  if (!allTemplates?.length) return [];

  const matched: Doc<'templates'>[] = [];
  for (const label of STARTER_HABIT_LABELS) {
    const found = allTemplates.find((t) => matchesStarterLabel(t.name, label.name));
    if (found && !matched.some((m) => m._id === found._id)) {
      matched.push(found);
    }
  }
  return matched;
}
