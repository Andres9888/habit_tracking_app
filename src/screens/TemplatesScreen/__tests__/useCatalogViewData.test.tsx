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

  it('counts already-added habits in their category, but only once overall', () => {
    // Added habits stay on their shelf, so the chip count has to include them
    // or it disagrees with the rows behind it. The mirrored "Added" group is
    // the same two habits again, so the total must not double-count them.
    const { totalMatches, chipCategories } = render(
      'morning',
      'all',
      new Set(['m1'])
    );

    expect(chipCategories.find((c) => c.categoryId === 'morning_routine')?.count).toBe(2);
    expect(chipCategories.find((c) => c.categoryId === 'added')?.count).toBe(1);
    expect(totalMatches).toBe(2);
  });

  it('keeps a chip for a category whose every habit is already added', () => {
    // The reported bug: with 290 of 293 templates added the rail collapsed to
    // "All | Huberman | Added" and looked like the catalog had been wiped.
    const { chipCategories } = render(
      '',
      'all',
      new Set(['m1', 'm2', 's1'])
    );

    expect(chipCategories.map((c) => c.categoryId)).toEqual([
      'morning_routine',
      'sleep',
      'added',
    ]);
  });

  it('shows added habits in their own category shelf, not only under Added', () => {
    const { filteredTemplates } = render('', 'sleep', new Set(['s1']));
    expect(filteredTemplates.map((t) => t._id)).toEqual(['s1']);
  });

  it('exposes the selected category label for empty-state copy', () => {
    expect(render('', 'sleep').selectedCategoryLabel).toBeDefined();
  });
});
