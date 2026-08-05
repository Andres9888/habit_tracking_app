import { applyOptimisticToday } from '../optimisticToday';

const server = {
  completedToday: false,
  currentStreak: 5,
  bestStreak: 12,
  totalCompletions: 80,
};

describe('applyOptimisticToday', () => {
  it('passes server values through when no toggle is pending', () => {
    expect(applyOptimisticToday(server, undefined)).toEqual({
      isCompletedToday: false,
      currentStreak: 5,
      bestStreak: 12,
      totalCompletions: 80,
    });
  });

  it('passes through when the pending toggle agrees with the server', () => {
    expect(
      applyOptimisticToday({ ...server, completedToday: true }, true)
    ).toEqual({
      isCompletedToday: true,
      currentStreak: 5,
      bestStreak: 12,
      totalCompletions: 80,
    });
  });

  it('extends streak and total when marking today done', () => {
    expect(applyOptimisticToday(server, true)).toEqual({
      isCompletedToday: true,
      currentStreak: 6,
      bestStreak: 12,
      totalCompletions: 81,
    });
  });

  it('raises best streak optimistically when the new streak is a record', () => {
    const atRecord = { ...server, currentStreak: 12, bestStreak: 12 };
    expect(applyOptimisticToday(atRecord, true)).toEqual({
      isCompletedToday: true,
      currentStreak: 13,
      bestStreak: 13,
      totalCompletions: 81,
    });
  });

  it('trims streak and total when unmarking today', () => {
    const doneToday = { ...server, completedToday: true };
    expect(applyOptimisticToday(doneToday, false)).toEqual({
      isCompletedToday: false,
      currentStreak: 4,
      bestStreak: 12,
      totalCompletions: 79,
    });
  });

  it('never drops below zero', () => {
    const fresh = {
      completedToday: true,
      currentStreak: 0,
      bestStreak: 0,
      totalCompletions: 0,
    };
    expect(applyOptimisticToday(fresh, false)).toEqual({
      isCompletedToday: false,
      currentStreak: 0,
      bestStreak: 0,
      totalCompletions: 0,
    });
  });
});
