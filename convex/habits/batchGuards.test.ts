/**
 * Tests for batch mutation guards: size cap and all-or-nothing ownership
 * pre-flight (SEC: prevents partial commits and unbounded batch abuse).
 */
import { MAX_BATCH_SIZE, loadOwnedHabitsForBatch } from './batchGuards';
import type { Id } from '../_generated/dataModel';
import type { MutationCtx } from '../_generated/server';

const OWNER = 'user_owner';
const ATTACKER_HABIT = 'habit_other' as Id<'habits'>;

function makeCtx(
  docs: Record<string, { _id: string; userId: string } | null>
): MutationCtx {
  return {
    db: {
      get: (id: Id<'habits'>) => Promise.resolve(docs[id] ?? null),
    },
  } as unknown as MutationCtx;
}

describe('loadOwnedHabitsForBatch', () => {
  it('rejects batches over MAX_BATCH_SIZE before touching the db', async () => {
    const ids = Array.from(
      { length: MAX_BATCH_SIZE + 1 },
      (_, i) => `habit_${i}` as Id<'habits'>
    );
    await expect(
      loadOwnedHabitsForBatch(makeCtx({}), OWNER, ids, 'archive')
    ).rejects.toThrow(/Too many habits/);
  });

  it('throws on any unowned id before returning docs (all-or-nothing)', async () => {
    const ctx = makeCtx({
      habit_a: { _id: 'habit_a', userId: OWNER },
      [ATTACKER_HABIT]: { _id: ATTACKER_HABIT, userId: 'user_other' },
    });
    await expect(
      loadOwnedHabitsForBatch(
        ctx,
        OWNER,
        ['habit_a' as Id<'habits'>, ATTACKER_HABIT],
        'delete'
      )
    ).rejects.toThrow(/Not authorized to delete/);
  });

  it('dedupes ids and skips missing habits', async () => {
    const ctx = makeCtx({
      habit_a: { _id: 'habit_a', userId: OWNER },
      habit_gone: null,
    });
    const habits = await loadOwnedHabitsForBatch(
      ctx,
      OWNER,
      [
        'habit_a' as Id<'habits'>,
        'habit_a' as Id<'habits'>,
        'habit_gone' as Id<'habits'>,
      ],
      'archive'
    );
    expect(habits.map((h) => h._id)).toEqual(['habit_a']);
  });
});
