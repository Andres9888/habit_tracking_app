import { renderHook } from '@testing-library/react-native';
import type { Doc } from '../../../../convex/_generated/dataModel';
import { useCatalogViewData } from '../hooks/useCatalogViewData';

function tmpl(
  id: string,
  category: string,
  overrides: Partial<Doc<'templates'>> = {}
): Doc<'templates'> {
  return {
    _id: id,
    name: `Habit ${id}`,
    description: 'desc',
    category,
    popularityScore: 10,
    ...overrides,
  } as Doc<'templates'>;
}

const templates = [
  tmpl('m1', 'morning_routine', { name: 'Morning walk' }),
  tmpl('m2', 'morning_routine', { name: 'Morning journal' }),
  tmpl('s1', 'sleep', { name: 'Sleep by ten' }),
];

const render = (searchQuery: string, selectedCategoryId = 'all', added = new Set<string>()) =>
  renderHook(() =>
    useCatalogViewData({
      allTemplates: templates,
      frozenImportedIds: added,
      searchQuery,
      selectedCategoryId,
    })
  ).result.current;

describe('useCatalogViewData', () => {
  it('keeps every chip in the rail during a search that matches nothing', () => {
    const idle = render('');
    const searching = render('kettlebell');

    // Regression guard for 6945a2528: chips were derived from the filtered
    // groups, so a zero-result search deleted the entire rail.
    expect(searching.chipCategories.map((c) => c.categoryId)).toEqual(
      idle.chipCategories.map((c) => c.categoryId)
    );
    expect(searching.totalMatches).toBe(0);
  });

  it('keeps the selected chip present when the search excludes its category', () => {
    const { chipCategories, filteredTemplates, totalMatches } = render(
      'sleep',
      'morning_routine'
    );

    expect(chipCategories.map((c) => c.categoryId)).toContain('morning_routine');
    expect(filteredTemplates).toHaveLength(0);
    // The match exists elsewhere — this is what the empty state points at.
    expect(totalMatches).toBe(1);
  });

  it('omits counts while idle and populates them during a search', () => {
    expect(render('').chipCategories.every((c) => c.count === undefined)).toBe(true);

    const counts = render('morning').chipCategories;
    expect(counts.find((c) => c.categoryId === 'morning_routine')?.count).toBe(2);
    expect(counts.find((c) => c.categoryId === 'sleep')?.count).toBe(0);
  });

  it('excludes already-added habits from match counts', () => {
    // Otherwise a chip promises matches that turn out to be habits the user
    // already tracks — a second flavour of dead end.
    const { totalMatches, chipCategories } = render(
      'morning',
      'all',
      new Set(['m1'])
    );

    expect(chipCategories.find((c) => c.categoryId === 'morning_routine')?.count).toBe(1);
    expect(totalMatches).toBe(1);
  });

  it('exposes the selected category label for empty-state copy', () => {
    expect(render('', 'sleep').selectedCategoryLabel).toBeDefined();
  });
});
