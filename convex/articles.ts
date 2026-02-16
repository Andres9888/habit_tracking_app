/**
 * Articles Convex Functions
 *
 * CRUD operations for educational articles.
 * Articles provide habit-building knowledge and tips.
 */

import { v } from 'convex/values';
import { internalMutation, query } from './_generated/server';

export const list = query({
  args: { category: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const articlesQuery = ctx.db.query('articles');

    if (args.category !== undefined) {
      return await articlesQuery
        .withIndex('by_category', (q) => q.eq('category', args.category!))
        .order('desc')
        .collect();
    }

    return await articlesQuery.order('desc').collect();
  },
  returns: v.array(
    v.object({
      _creationTime: v.number(),
      _id: v.id('articles'),
      category: v.string(),
      content: v.string(),
      createdAt: v.number(),
      title: v.string(),
    })
  ),
});

// Add some initial articles (internal only — run via dashboard)
export const seed = internalMutation({
  args: {},
  handler: async (ctx) => {
    const articles = await ctx.db.query('articles').collect();
    if (articles.length > 0) return null;

    const initialArticles = [
      {
        category: 'foundation',
        content:
          'Start small, be consistent, and celebrate progress. The key to building lasting habits is to make them easy to start and hard to miss.',
        createdAt: Date.now(),
        title: 'Building Lasting Habits',
      },
      {
        category: 'routines',
        content:
          'A strong morning routine sets the tone for your entire day. Consider including meditation, exercise, or reading in your morning ritual.',
        createdAt: Date.now(),
        title: 'The Power of Morning Routines',
      },
      {
        category: 'techniques',
        content:
          'Connect new habits to existing ones. After [CURRENT HABIT], I will [NEW HABIT]. This makes it easier to remember and implement new behaviors.',
        createdAt: Date.now(),
        title: 'Habit Stacking',
      },
    ];

    for (const article of initialArticles) {
      await ctx.db.insert('articles', article);
    }
    return null;
  },
  returns: v.null(),
});
