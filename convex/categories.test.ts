import { CATEGORY_FILTERS } from './categories';
import { TEMPLATE_CATEGORIES } from './templateCategories';

describe('CATEGORY_FILTERS', () => {
  it('keeps all first and includes every template category', () => {
    expect(CATEGORY_FILTERS[0]?.id).toBe('all');
    expect(CATEGORY_FILTERS.map((category) => category.id)).toEqual([
      'all',
      ...TEMPLATE_CATEGORIES.map((category) => category.id),
    ]);
  });
});
