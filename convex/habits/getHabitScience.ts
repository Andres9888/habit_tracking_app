/**
 * Science fields for a habit imported from a template.
 * Used for provisional insights before personal patterns unlock.
 */
import { v } from 'convex/values';
import { query } from '../_generated/server';

const habitScienceValidator = v.object({
  evidence: v.optional(v.string()),
  howToStart: v.optional(v.array(v.string())),
  lead: v.optional(v.string()),
  sources: v.optional(
    v.array(
      v.object({
        authors: v.string(),
        journal: v.string(),
        link: v.optional(v.string()),
        title: v.string(),
        year: v.string(),
      })
    )
  ),
  tips: v.optional(v.array(v.string())),
});

export const getHabitScience = query({
  args: { habitId: v.id('habits') },
  returns: v.union(habitScienceValidator, v.null()),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const habit = await ctx.db.get(args.habitId);
    if (!habit || habit.userId !== identity.subject) return null;

    const usage = await ctx.db
      .query('templateUsage')
      .withIndex('by_habit', (q) => q.eq('habitId', args.habitId))
      .first();
    if (!usage) return null;

    const template = await ctx.db.get(usage.templateId);
    if (!template) return null;

    const hasContent =
      Boolean(template.tips?.length) ||
      Boolean(template.howToStart?.length) ||
      Boolean(template.evidence?.trim()) ||
      Boolean(template.lead?.trim()) ||
      Boolean(template.sources?.length);
    if (!hasContent) return null;

    return {
      evidence: template.evidence,
      howToStart: template.howToStart,
      lead: template.lead,
      sources: template.sources,
      tips: template.tips,
    };
  },
});
