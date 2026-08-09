import { milestoneCaption, nextMilestoneProgress } from '../milestoneTarget';

describe('nextMilestoneProgress', () => {
  it('aims at day 7 before the first milestone', () => {
    const progress = nextMilestoneProgress(3);
    expect(progress).toEqual({
      fillPct: expect.closeTo((3 / 7) * 100),
      isFirst: true,
      remaining: 4,
      target: 7,
    });
  });

  it('advances to day 30 once streak reaches 7', () => {
    expect(nextMilestoneProgress(7)).toEqual({
      fillPct: 0,
      isFirst: false,
      remaining: 23,
      target: 30,
    });
  });

  it('fills between day 7 and day 30', () => {
    const progress = nextMilestoneProgress(18);
    expect(progress?.target).toBe(30);
    expect(progress?.remaining).toBe(12);
    expect(progress?.fillPct).toBeCloseTo((11 / 23) * 100);
    expect(progress?.isFirst).toBe(false);
  });

  it('aims at day 100 after day 30', () => {
    expect(nextMilestoneProgress(30)?.target).toBe(100);
  });

  it('aims at day 365 after day 100', () => {
    expect(nextMilestoneProgress(100)?.target).toBe(365);
  });

  it('returns null once every milestone is passed', () => {
    expect(nextMilestoneProgress(365)).toBeNull();
    expect(nextMilestoneProgress(400)).toBeNull();
  });
});

describe('milestoneCaption', () => {
  it('uses first-milestone wording before day 7', () => {
    expect(milestoneCaption(nextMilestoneProgress(3)!)).toBe(
      '4 days to your first milestone — day 7'
    );
  });

  it('drops first after the first milestone', () => {
    expect(milestoneCaption(nextMilestoneProgress(18)!)).toBe(
      '12 days to your next milestone — day 30'
    );
  });

  it('singularises the final day', () => {
    expect(milestoneCaption(nextMilestoneProgress(6)!)).toBe(
      '1 day to your first milestone — day 7'
    );
  });
});
