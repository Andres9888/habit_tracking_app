import type { Doc } from '../../../../convex/_generated/dataModel';
import { ADDED_CATEGORY_ID } from '../data/categoryMeta';
import { buildCatalogGroups } from '../hooks/buildCatalogGroups';

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

const findGroup = (
  groups: ReturnType<typeof buildCatalogGroups>,
  category: string
) => groups.find((g) => g.category === category);

describe('buildCatalogGroups', () => {
  const templates = [
    tmpl('m1', 'morning_routine', { popularityScore: 5 }),
    tmpl('m2', 'morning_routine', { popularityScore: 9 }),
    tmpl('s1', 'sleep'),
  ];

  it('mirrors added habits into a trailing "Added" group and keeps them in their category', () => {
    const groups = buildCatalogGroups(templates, '', new Set(['m1']));

    expect(groups[groups.length - 1]?.category).toBe(ADDED_CATEGORY_ID);
    expect(findGroup(groups, ADDED_CATEGORY_ID)?.templates.map((t) => t._id)).toEqual(
      ['m1']
    );
    expect(findGroup(groups, 'morning_routine')?.templates.map((t) => t._id)).toEqual(
      ['m2', 'm1']
    );
  });

  it('sinks added habits below addable ones, ignoring popularity', () => {
    // m1 is the less popular of the two, so ordering by popularity alone would
    // already put it last — make it the most popular to prove the added rank
    // wins.
    const popularAdded = [
      tmpl('m1', 'morning_routine', { popularityScore: 99 }),
      tmpl('m2', 'morning_routine', { popularityScore: 1 }),
      tmpl('m3', 'morning_routine', { popularityScore: 50 }),
    ];
    const groups = buildCatalogGroups(popularAdded, '', new Set(['m1']));

    expect(findGroup(groups, 'morning_routine')?.templates.map((t) => t._id)).toEqual(
      ['m3', 'm2', 'm1']
    );
  });

  it('omits the Added group when nothing is added', () => {
    const groups = buildCatalogGroups(templates, '', new Set());
    expect(findGroup(groups, ADDED_CATEGORY_ID)).toBeUndefined();
  });

  it('keeps a category group whose every habit is added', () => {
    // Regression guard: pulling added habits out of their category deleted the
    // chip once the last one was added. A user with 290 of 293 templates added
    // saw the rail collapse to "All | Huberman | Added" and read it as a wipe.
    const groups = buildCatalogGroups(templates, '', new Set(['s1']));
    expect(findGroup(groups, 'sleep')?.templates.map((t) => t._id)).toEqual(['s1']);
  });

  it('keeps every category chip even when the whole catalog is added', () => {
    const groups = buildCatalogGroups(templates, '', new Set(['m1', 'm2', 's1']));

    expect(groups.map((g) => g.category)).toEqual([
      'morning_routine',
      'sleep',
      ADDED_CATEGORY_ID,
    ]);
  });

  it('sorts within each group by popularity desc', () => {
    const groups = buildCatalogGroups(templates, '', new Set());
    expect(findGroup(groups, 'morning_routine')?.templates.map((t) => t._id)).toEqual(
      ['m2', 'm1']
    );
  });

  it('orders groups by category priority regardless of input order', () => {
    const shuffled = [
      tmpl('h1', 'andrew_huberman'),
      tmpl('h2', 'sleep'),
      tmpl('h3', 'health_fitness'),
      tmpl('h4', 'mental_health'),
      tmpl('h5', 'morning_routine'),
    ];
    const groups = buildCatalogGroups(shuffled, '', new Set());

    expect(groups.map((g) => g.category)).toEqual([
      'health_fitness',
      'morning_routine',
      'sleep',
      'mental_health',
      'andrew_huberman',
    ]);
  });

  it('sorts previously unranked categories ahead of unknown ones, not alongside them', () => {
    const tail = [
      tmpl('u1', 'not_a_real_category'),
      tmpl('t1', 'subtraction'),
      tmpl('t2', 'environmental_design'),
    ];
    const groups = buildCatalogGroups(tail, '', new Set());

    expect(groups.map((g) => g.category)).toEqual([
      'environmental_design',
      'subtraction',
      'uncategorized',
    ]);
  });

  it('mirrors added habits inside search results too', () => {
    const named = [
      tmpl('a1', 'sleep', { name: 'Meditate deeply' }),
      tmpl('a2', 'morning_routine', { name: 'Meditate at dawn' }),
      tmpl('a3', 'sleep', { name: 'Run' }),
    ];
    const groups = buildCatalogGroups(named, 'meditate', new Set(['a2']));

    expect(findGroup(groups, ADDED_CATEGORY_ID)?.templates.map((t) => t._id)).toEqual(
      ['a2']
    );
    expect(findGroup(groups, 'sleep')?.templates.map((t) => t._id)).toEqual(['a1']);
    expect(findGroup(groups, 'morning_routine')?.templates.map((t) => t._id)).toEqual(
      ['a2']
    );
    expect(groups.some((g) => g.templates.some((t) => t._id === 'a3'))).toBe(false);
  });

  it('matches on the category label, not just name and description', () => {
    // "Morning run" says nothing about health; its category does.
    const named = [
      tmpl('c1', 'health_fitness', { name: 'Morning run', description: 'Go' }),
      tmpl('c2', 'sleep', { name: 'Wind down', description: 'Dim lights' }),
    ];
    const groups = buildCatalogGroups(named, 'health', new Set());

    expect(findGroup(groups, 'health_fitness')?.templates.map((t) => t._id)).toEqual(
      ['c1']
    );
    expect(findGroup(groups, 'sleep')).toBeUndefined();
  });

  it('matches on the start-small line', () => {
    const named = [
      tmpl('s1', 'sleep', {
        name: 'Wind down',
        description: 'Dim lights',
        startSmallVersion: 'Put your phone in another room',
      }),
      tmpl('s2', 'sleep', { name: 'Sleep early', description: 'Rest' }),
    ];
    const groups = buildCatalogGroups(named, 'phone', new Set());

    expect(findGroup(groups, 'sleep')?.templates.map((t) => t._id)).toEqual(['s1']);
  });

  it('does not match habits whose category label merely shares a prefix', () => {
    const named = [tmpl('n1', 'sleep', { name: 'Wind down' })];
    expect(buildCatalogGroups(named, 'health', new Set())).toEqual([]);
  });
});
