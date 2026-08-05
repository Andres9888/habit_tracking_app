/**
 * One-shot cleanup: strip legacy `dailyMinutesGoal` and `weeklyMinutesGoal`
 * fields from habit docs. These fields are unused by current code and were
 * causing returns-validator errors on `habits:list`.
 *
 * Run from the Convex dashboard:
 *   habits:cleanupLegacyGoalFields { dryRun: true }   // preview
 *   habits:cleanupLegacyGoalFields { dryRun: false }  // apply
 */
import { v } from 'convex/values';
import { internalMutation } from '../_generated/server';

export const cleanupLegacyGoalFields = internalMutation({
  args: { dryRun: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    const dryRun = args.dryRun ?? true;
    const habits = await ctx.db.query('habits').collect();

    let touched = 0;
    const sampleIds: string[] = [];

    for (const habit of habits) {
      const doc = habit as typeof habit & {
        dailyMinutesGoal?: number;
        weeklyMinutesGoal?: number;
      };
      const hasDaily = doc.dailyMinutesGoal !== undefined;
      const hasWeekly = doc.weeklyMinutesGoal !== undefined;
      if (!hasDaily && !hasWeekly) continue;

      touched += 1;
      if (sampleIds.length < 10) sampleIds.push(habit._id);

      if (!dryRun) {
        await ctx.db.patch(habit._id, {
          dailyMinutesGoal: undefined,
          weeklyMinutesGoal: undefined,
        });
      }
    }

    return {
      dryRun,
      scanned: habits.length,
      touched,
      sampleIds,
    };
  },
});
