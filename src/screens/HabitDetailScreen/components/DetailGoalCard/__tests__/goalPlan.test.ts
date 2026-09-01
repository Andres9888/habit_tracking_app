import { goalPlanSentence } from '../goalPlan';

const today = new Date(2026, 7, 25); // Tuesday 25 Aug 2026

describe('goalPlanSentence', () => {
  it('states the record and the goal as dates', () => {
    expect(
      goalPlanSentence({
        bestStreak: 12,
        currentStreak: 9,
        goal: 30,
        loggedToday: true,
        today,
      })
    ).toBe('Pass your record on Saturday, then reach 30 days on Sep 15.');
  });

  it('shifts every date back a day while today is still open', () => {
    expect(
      goalPlanSentence({
        bestStreak: 12,
        currentStreak: 9,
        goal: 30,
        loggedToday: false,
        today,
      })
    ).toBe('Pass your record on Friday, then reach 30 days on Sep 14.');
  });

  it('drops the record clause once the record is already behind you', () => {
    expect(
      goalPlanSentence({
        bestStreak: 12,
        currentStreak: 14,
        goal: 30,
        loggedToday: true,
        today,
      })
    ).toBe('Reach 30 days on Sep 10.');
  });

  it('reads as a date rather than a weekday beyond this week', () => {
    expect(
      goalPlanSentence({
        bestStreak: 30,
        currentStreak: 9,
        goal: 60,
        loggedToday: true,
        today,
      })
    ).toContain('Pass your record on Sep 16');
  });

  it('celebrates instead of planning once the goal is met', () => {
    expect(
      goalPlanSentence({
        bestStreak: 30,
        currentStreak: 30,
        goal: 30,
        loggedToday: true,
        today,
      })
    ).toBe('Goal reached — 30 days, and still going.');
  });
});
