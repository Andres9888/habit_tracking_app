import type { Id } from '../../../convex/_generated/dataModel';
import { resolveToggleTarget } from '../resolveToggleTarget';

const habitId = 'habit_1' as Id<'habits'>;

describe('resolveToggleTarget', () => {
  it('uses explicit completed when provided', () => {
    const getCurrentStatus = jest.fn().mockReturnValue(false);
    expect(
      resolveToggleTarget(
        { completed: false, date: '2026-08-18', habitId },
        getCurrentStatus
      )
    ).toBe(false);
    expect(getCurrentStatus).not.toHaveBeenCalled();
  });

  it('flips current status when completed is omitted', () => {
    expect(
      resolveToggleTarget({ date: '2026-08-18', habitId }, () => true)
    ).toBe(false);
  });
});
