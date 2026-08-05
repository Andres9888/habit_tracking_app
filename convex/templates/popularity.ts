/**
 * Template popularity recompute
 *
 * Counts active users per template (imported the template AND still have a
 * non-archived habit for it), writes the count to templates.popularityScore.
 * Self-healing — full recount each run, so no inline inc/dec drift.
 */
import { internalMutation } from '../_generated/server';
import type { Id } from '../_generated/dataModel';

export const recompute = internalMutation({
  args: {},
  handler: async (ctx) => {
    const usage = await ctx.db.query('templateUsage').collect();

    // Resolve each unique habit once: alive + non-archived?
    const uniqueHabitIds = [
      ...new Set(
        usage
          .map((u) => u.habitId)
          .filter((id): id is Id<'habits'> => id !== undefined)
      ),
    ];
    const habitActive = new Map<string, boolean>();
    for (const habitId of uniqueHabitIds) {
      const habit = await ctx.db.get(habitId);
      habitActive.set(habitId, habit !== null && habit.archived !== true);
    }

    // templateId -> Set of userIds with an active habit for that template
    const activeUsersByTemplate = new Map<string, Set<string>>();
    for (const row of usage) {
      if (row.habitId === undefined || row.userId === undefined) continue;
      if (habitActive.get(row.habitId) !== true) continue;
      const key = row.templateId;
      const set = activeUsersByTemplate.get(key) ?? new Set<string>();
      set.add(row.userId);
      activeUsersByTemplate.set(key, set);
    }

    // Patch every template (including ones that fall to 0)
    const templates = await ctx.db
      .query('templates')
      .withIndex('by_createdAt')
      .collect();
    let patched = 0;
    for (const template of templates) {
      const count = activeUsersByTemplate.get(template._id)?.size ?? 0;
      const current = template.popularityScore ?? -1;
      if (current === count) continue;
      await ctx.db.patch(template._id, { popularityScore: count });
      patched++;
    }

    return {
      templatesScanned: templates.length,
      templatesPatched: patched,
      usageRowsScanned: usage.length,
    };
  },
});
