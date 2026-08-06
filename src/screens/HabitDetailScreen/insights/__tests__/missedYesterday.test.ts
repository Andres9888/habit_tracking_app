import { isMissedYesterday, recoveryHeadline } from '../missedYesterday';

const TODAY = '2026-07-25'; // a Saturday — yesterday is Friday the 24th
const YESTERDAY = '2026-07-24';

describe('isMissedYesterday', () => {
  it('is true when a scheduled yesterday has no completion', () => {
    expect(
      isMissedYesterday({
        completedDates: new Set(),
        isCompletedToday: false,
        today: TODAY,
      })
    ).toBe(true);
  });

  it('is false when yesterday was logged', () => {
    expect(
      isMissedYesterday({
        completedDates: new Set([YESTERDAY]),
        isCompletedToday: false,
        today: TODAY,
      })
    ).toBe(false);
  });

  it('is false once today is logged — the miss is behind them', () => {
    expect(
      isMissedYesterday({
        completedDates: new Set(),
        isCompletedToday: true,
        today: TODAY,
      })
    ).toBe(false);
  });

  // The whole point of the redesign is to stop scolding. A Mondays-only habit
  // has not missed anything by skipping Friday.
  it('ignores a day the habit was never scheduled on', () => {
    expect(
      isMissedYesterday({
        completedDates: new Set(),
        daysOfWeek: [1], // Mondays only; the 24th is a Friday
        isCompletedToday: false,
        today: TODAY,
      })
    ).toBe(false);
  });

  it('still fires when yesterday WAS a scheduled day', () => {
    expect(
      isMissedYesterday({
        completedDates: new Set(),
        daysOfWeek: [5], // Fridays only; the 24th is a Friday
        isCompletedToday: false,
        today: TODAY,
      })
    ).toBe(true);
  });
});

describe('recoveryHeadline', () => {
  it('leans on the personal best, which survives the reset', () => {
    expect(recoveryHeadline(12, 148)).toBe("One miss doesn't erase 12 days.");
  });

  it('falls back to days done when there is no best yet', () => {
    expect(recoveryHeadline(0, 5)).toBe("One miss doesn't erase 5 days.");
  });

  it('singularises', () => {
    expect(recoveryHeadline(1, 1)).toBe("One miss doesn't erase 1 day.");
  });

  it('says something sane on a brand-new habit', () => {
    expect(recoveryHeadline(0, 0)).toBe("One miss doesn't undo anything.");
  });
});
