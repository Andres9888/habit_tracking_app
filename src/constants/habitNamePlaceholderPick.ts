import type { HabitNamePlaceholderCursor } from '@/utils/habitNamePlaceholderCursor';
import { EMPTY_HABIT_NAME_PLACEHOLDER_CURSOR } from '@/utils/habitNamePlaceholderCursor';
import {
  DEFAULT_HABIT_NAME_PLACEHOLDER,
  getAvailablePlaceholderTemplates,
  HABIT_NAME_PLACEHOLDERS,
  normalizeHabitNameForMatch,
  type HabitNamePlaceholderTemplate,
} from './habitNamePlaceholders';

function buildExcludedNameSet(names: readonly string[]): Set<string> {
  return new Set(
    names
      .map((name) => normalizeHabitNameForMatch(name))
      .filter((name) => name.length > 0)
  );
}

function pickNextStaticPlaceholder(
  lastStaticName: string | null,
  excludeNames: readonly string[]
): string {
  const excluded = buildExcludedNameSet(excludeNames);
  const pool = HABIT_NAME_PLACEHOLDERS.filter(
    (placeholder) => !excluded.has(normalizeHabitNameForMatch(placeholder))
  );
  if (pool.length === 0) return DEFAULT_HABIT_NAME_PLACEHOLDER;

  const lastIndex = lastStaticName
    ? pool.findIndex(
        (placeholder) =>
          normalizeHabitNameForMatch(placeholder) ===
          normalizeHabitNameForMatch(lastStaticName)
      )
    : -1;
  const nextIndex = lastIndex >= 0 ? (lastIndex + 1) % pool.length : 0;
  return pool[nextIndex] ?? DEFAULT_HABIT_NAME_PLACEHOLDER;
}

function pickLibraryPlaceholderOnOpen(
  templates: HabitNamePlaceholderTemplate[],
  cursor: HabitNamePlaceholderCursor,
  existingHabitNames: string[],
  importedTemplateIds: Set<string>
): { name: string; nextCursor: HabitNamePlaceholderCursor } | null {
  const available = getAvailablePlaceholderTemplates(templates, {
    existingHabitNames,
    importedTemplateIds,
  });
  if (available.length === 0) return null;

  const lastIndex = cursor.libraryTemplateId
    ? available.findIndex(
        (template) => template._id === cursor.libraryTemplateId
      )
    : -1;
  const displayIndex = lastIndex >= 0 ? (lastIndex + 1) % available.length : 0;
  const picked = available[displayIndex] ?? available[0];

  return {
    name: picked.name.trim(),
    nextCursor: {
      libraryTemplateId: picked._id,
      staticName: cursor.staticName,
    },
  };
}

/** Pick the next top-ranked placeholder and cursor to persist for the following open. */
export function pickNextHabitNamePlaceholderOnOpen(options: {
  templates?: HabitNamePlaceholderTemplate[];
  existingHabitNames?: string[];
  importedTemplateIds?: Set<string>;
  cursor?: HabitNamePlaceholderCursor;
}): { name: string; nextCursor: HabitNamePlaceholderCursor } {
  const {
    templates,
    existingHabitNames = [],
    importedTemplateIds = new Set(),
    cursor = EMPTY_HABIT_NAME_PLACEHOLDER_CURSOR,
  } = options;

  const fromLibrary =
    templates?.length &&
    pickLibraryPlaceholderOnOpen(
      templates,
      cursor,
      existingHabitNames,
      importedTemplateIds
    );
  if (fromLibrary) return fromLibrary;

  const name = pickNextStaticPlaceholder(cursor.staticName, existingHabitNames);
  return {
    name,
    nextCursor: {
      libraryTemplateId: cursor.libraryTemplateId,
      staticName: name,
    },
  };
}
