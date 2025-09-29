import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: { category: v.optional(v.string()) },
  returns: v.array(
    v.object({
      _creationTime: v.number(),
      _id: v.id("articles"),
      category: v.string(),
      content: v.string(),
      createdAt: v.number(),
      title: v.string(),
    })
  ),
  handler: async (ctx, args) => {
    const articlesQuery = ctx.db.query("articles");

    if (args.category !== undefined) {
      return await articlesQuery
        .withIndex("by_category", q => q.eq("category", args.category!))
        .order("desc")
        .collect();
    }

    return await articlesQuery.order("desc").collect();
  }
});

// Add some initial articles
export const seed = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const articles = await ctx.db.query("articles").collect();
    if (articles.length > 0) return null;

    const initialArticles = [
      {
        title: "Building Lasting Habits",
        content: "Start small, be consistent, and celebrate progress. The key to building lasting habits is to make them easy to start and hard to miss.",
        category: "foundation",
        createdAt: Date.now(),
      },
      {
        title: "The Power of Morning Routines",
        content: "A strong morning routine sets the tone for your entire day. Consider including meditation, exercise, or reading in your morning ritual.",
        category: "routines",
        createdAt: Date.now(),
      },
      {
        title: "Habit Stacking",
        content: "Connect new habits to existing ones. After [CURRENT HABIT], I will [NEW HABIT]. This makes it easier to remember and implement new behaviors.",
        category: "techniques",
        createdAt: Date.now(),
      },
    ];

    for (const article of initialArticles) {
      await ctx.db.insert("articles", article);
    }
    return null;
  }
});
