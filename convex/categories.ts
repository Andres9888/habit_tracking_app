import { query } from './_generated/server';

/**
 * Fetch all available habit categories
 * Returns a list of category filters including 'All' and all unique categories from templates
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
  handler: async (ctx) => {
    // Fetch all templates to get unique categories
    const templates = await ctx.db.query('templates').collect();

    // Early return if no templates exist
    if (templates.length === 0) {
      return [{ icon: '✨', id: 'all' as const, label: 'All' }];
    }

    // Extract unique categories from templates
    const uniqueCategories = [
      ...new Set(templates.map((template) => template.category)),
    ].sort();

    // Define category metadata (icon and label for each category)
    const categoryMetadata: Record<string, { icon: string; label: string }> = {
      andrew_huberman: { icon: '🔬', label: 'Huberman' },
      breathing: { icon: '🌬️', label: 'Breathing' },
      creativity: { icon: '🎨', label: 'Creativity' },
      financial: { icon: '💰', label: 'Financial' },
      health_fitness: { icon: '💪', label: 'Health' },
      learning: { icon: '📚', label: 'Learning' },
      longevity: { icon: '🧬', label: 'Longevity' },
      mental_health: { icon: '🧠', label: 'Mental Health' },
      mindfulness: { icon: '🧘', label: 'Mindfulness' },
      morning_routine: { icon: '🌅', label: 'Morning' },
      productivity: { icon: '🎯', label: 'Productivity' },
      recovery: { icon: '🔄', label: 'Recovery' },
      sleep: { icon: '😴', label: 'Sleep' },
      social: { icon: '👥', label: 'Social' },
    };

    // Build category filters with alphabetical property ordering
    const categories = uniqueCategories.map((categoryId) => {
      const metadata = categoryMetadata[categoryId] || {
        icon: '📌',
        label:
          categoryId.charAt(0).toUpperCase() +
          categoryId.slice(1).replaceAll('_', ' '),
      };

      return {
        icon: metadata.icon,
        id: categoryId,
        label: metadata.label,
      };
    });

    // Always include 'All' as the first category (alphabetical properties)
    return [{ icon: '✨', id: 'all' as const, label: 'All' }, ...categories];
  },
});
