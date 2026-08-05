/**
 * Rotating habit-name placeholders for the add-habit flow.
 * Bare examples only — the "Name your new habit" title carries the instruction.
 */

/**
 * Placeholder strings shown in the name field when empty.
 * Covers simple, regular, and complex habit shapes from strength tiers.
 */
export const HABIT_NAME_PLACEHOLDERS = [
  'Read for 20 minutes',
  'Meditate for 10 minutes',
  'Drink water',
  'Walk for 15 minutes',
  'Journal for 5 minutes',
  'Workout for 30 minutes',
  'Floss before bed',
  'Stretch in the morning',
] as const;

export const DEFAULT_HABIT_NAME_PLACEHOLDER = HABIT_NAME_PLACEHOLDERS[0];

export function normalizeHabitNameForMatch(value: string): string {
  return value
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, ' ')
    .trim();
}

export interface HabitNamePlaceholderTemplate {
  _id: string;
  name: string;
  popularityScore?: number;
}

function buildExcludedNameSet(names: readonly string[]): Set<string> {
  return new Set(
    names
      .map((name) => normalizeHabitNameForMatch(name))
      .filter((name) => name.length > 0)
  );
}

export function getAvailablePlaceholderTemplates(
  templates: HabitNamePlaceholderTemplate[],
  options: {
    existingHabitNames: string[];
    importedTemplateIds: Set<string>;
  }
): HabitNamePlaceholderTemplate[] {
  const existing = buildExcludedNameSet(options.existingHabitNames);

  return templates
    .filter((template) => {
      const name = (template.name ?? '').trim();
      if (!name) return false;
      if (options.importedTemplateIds.has(template._id)) return false;
      if (existing.has(normalizeHabitNameForMatch(name))) return false;
      return true;
    })
    .sort((a, b) => (b.popularityScore ?? 0) - (a.popularityScore ?? 0));
}

export function getAvailableHabitNamePlaceholders(
  templates: HabitNamePlaceholderTemplate[],
  options: {
    existingHabitNames: string[];
    importedTemplateIds: Set<string>;
  }
): string[] {
  return getAvailablePlaceholderTemplates(templates, options).map((template) =>
    template.name.trim()
  );
}

export { pickNextHabitNamePlaceholderOnOpen } from './habitNamePlaceholderPick';
