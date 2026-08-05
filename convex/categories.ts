import { query } from './_generated/server';
import { TEMPLATE_CATEGORIES } from './templateCategories';

export const CATEGORY_FILTERS = [
  { icon: '✨', id: 'all' as const, label: 'All' },
  ...TEMPLATE_CATEGORIES,
];

/**
 * Fetch all available habit categories
 * Returns a stable list of category filters with 'All' first.
 *
 * SEC-PUBLIC: This query is intentionally public to allow browsing
 * template categories before login. Derived from public template data.
 *
 * @returns Array of category objects with id, label, and icon
 * @example
 * ```ts
 * const categories = useQuery(api.categories.list, {});
 * // Returns: [{ id: 'all', label: 'All', icon: '✨' }, ...]
 * ```
 */
export const list = query({
  args: {},
  handler: async () => CATEGORY_FILTERS,
});
