import { getGoalContextCopy } from '../GoalContextLine';

describe('getGoalContextCopy', () => {
  it('names day 1 instead of "0 days in" when no run is open', () => {
    expect(getGoalContextCopy(0, 30)).toEqual({
      detail: 'Day 1 starts today — 30 days to go.',
      emphasis: '30-day target.',
      warn: false,
    });
    expect(getGoalContextCopy(0, 66).detail).toBe(
      'Day 1 starts today — 66 days to go.'
    );
    expect(getGoalContextCopy(0, 66).emphasis).toBe(
      'Science-backed habit window.'
    );
  });

  it('counts the days left once a run is open', () => {
    expect(getGoalContextCopy(9, 30).detail).toBe(
      "You're 9 days in — 21 days remaining."
    );
  });

  it('warns when the selected goal is already behind you', () => {
    const copy = getGoalContextCopy(40, 30);
    expect(copy.warn).toBe(true);
    expect(copy.emphasis).toBe("You've already passed this.");
  });
});
