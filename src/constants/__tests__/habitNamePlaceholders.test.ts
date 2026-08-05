import {
  DEFAULT_HABIT_NAME_PLACEHOLDER,
  getAvailableHabitNamePlaceholders,
  HABIT_NAME_PLACEHOLDERS,
  pickNextHabitNamePlaceholderOnOpen,
} from '../habitNamePlaceholders';
import { EMPTY_HABIT_NAME_PLACEHOLDER_CURSOR } from '@/utils/habitNamePlaceholderCursor';

const templates = [
  { _id: 'a', name: 'Meditate', popularityScore: 90 },
  { _id: 'b', name: 'Drink Water', popularityScore: 100 },
  { _id: 'c', name: 'Read 1 Page', popularityScore: 80 },
  { _id: 'd', name: 'Walk', popularityScore: 70 },
];

describe('habitNamePlaceholders', () => {
  it('exposes a stable default matching the first curated option', () => {
    expect(DEFAULT_HABIT_NAME_PLACEHOLDER).toBe('Read for 20 minutes');
  });

  it('ranks library candidates by popularity and excludes imported or owned habits', () => {
    const available = getAvailableHabitNamePlaceholders(templates, {
      existingHabitNames: ['Walk'],
      importedTemplateIds: new Set(['b']),
    });

    expect(available).toEqual(['Meditate', 'Read 1 Page']);
  });

  it('starts with the top popular library habit', () => {
    const result = pickNextHabitNamePlaceholderOnOpen({
      cursor: EMPTY_HABIT_NAME_PLACEHOLDER_CURSOR,
      existingHabitNames: [],
      importedTemplateIds: new Set(),
      templates,
    });

    expect(result.name).toBe('Drink Water');
    expect(result.nextCursor.libraryTemplateId).toBe('b');
  });

  it('advances to the next top habit on each open', () => {
    const first = pickNextHabitNamePlaceholderOnOpen({
      cursor: EMPTY_HABIT_NAME_PLACEHOLDER_CURSOR,
      existingHabitNames: [],
      importedTemplateIds: new Set(),
      templates,
    });
    const second = pickNextHabitNamePlaceholderOnOpen({
      cursor: first.nextCursor,
      existingHabitNames: [],
      importedTemplateIds: new Set(),
      templates,
    });

    expect(second.name).toBe('Meditate');
    expect(second.nextCursor.libraryTemplateId).toBe('a');
  });

  it('wraps to the first available habit after the last top pick', () => {
    const result = pickNextHabitNamePlaceholderOnOpen({
      cursor: { libraryTemplateId: 'd', staticName: null },
      existingHabitNames: [],
      importedTemplateIds: new Set(),
      templates,
    });

    expect(result.name).toBe('Drink Water');
  });

  it('falls back to rotating static placeholders when every library habit is taken', () => {
    const first = pickNextHabitNamePlaceholderOnOpen({
      cursor: EMPTY_HABIT_NAME_PLACEHOLDER_CURSOR,
      existingHabitNames: templates.map((template) => template.name),
      importedTemplateIds: new Set(templates.map((template) => template._id)),
      templates,
    });
    const second = pickNextHabitNamePlaceholderOnOpen({
      cursor: first.nextCursor,
      existingHabitNames: templates.map((template) => template.name),
      importedTemplateIds: new Set(templates.map((template) => template._id)),
      templates,
    });

    expect(HABIT_NAME_PLACEHOLDERS).toContain(first.name);
    expect(second.name).not.toBe(first.name);
  });
});
