import type { Id } from '../_generated/dataModel';
import type { MutationCtx } from '../_generated/server';

export async function clearLegacyTrackingNote(
  ctx: MutationCtx,
  habitId: Id<'habits'>,
  date: string
): Promise<void> {
  const existing = await ctx.db
    .query('tracking')
    .withIndex('by_habit_and_date', (q) =>
      q.eq('habitId', habitId).eq('date', date)
    )
    .unique();
  if (!existing?.note) return;

  await ctx.db.replace(existing._id, {
    completed: existing.completed,
    date: existing.date,
    habitId: existing.habitId,
    ...(existing.kind === undefined ? {} : { kind: existing.kind }),
    ...(existing.minutes === undefined ? {} : { minutes: existing.minutes }),
    ...(existing.userId === undefined ? {} : { userId: existing.userId }),
  });
}
