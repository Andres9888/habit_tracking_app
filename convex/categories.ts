import { query } from './_generated/server';

/**
 * Fetch all available habit categories
 * Returns a list of category filters including 'All' and all unique categories from templates
 */
export const list = query({
  args: {},
  handler: async (ctx) => {
    // Fetch all templates to get unique categories
    const templates = await ctx.db.query('templates').collect();

    // Extract unique categories from templates
    const uniqueCategories = Array.from(
      new Set(templates.map((template) => template.category))
    ).sort();

    // Define category metadata (icon and label for each category)
    const categoryMetadata: Record<string, { icon: string; label: string }> = {
      andrew_huberman: { icon: '🔬', label: 'Huberman' },
      creativity: { icon: '🎨', label: 'Creativity' },
      financial: { icon: '💰', label: 'Financial' },
      health_fitness: { icon: '💪', label: 'Health' },
      learning: { icon: '📚', label: 'Learning' },
      mindfulness: { icon: '🧘', label: 'Mindfulness' },
      morning_routine: { icon: '🌅', label: 'Morning' },
      productivity: { icon: '🎯', label: 'Productivity' },
      sleep: { icon: '😴', label: 'Sleep' },
      social: { icon: '👥', label: 'Social' },
    };

    // Build category filters
    const categories = uniqueCategories.map((categoryId) => {
      const metadata = categoryMetadata[categoryId] || {
        icon: '📌',
        label: categoryId.charAt(0).toUpperCase() + categoryId.slice(1).replace(/_/g, ' '),
      };

      return {
        icon: metadata.icon,
        id: categoryId,
        label: metadata.label,
      };
    });

    // Always include 'All' as the first category
    return [
      { icon: '✨', id: 'all', label: 'All' },
      ...categories,
    ];
  },
});

