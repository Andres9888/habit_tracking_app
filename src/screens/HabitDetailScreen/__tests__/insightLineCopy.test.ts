import { insightLineCopy } from '../insightLineCopy';
import type { HabitInsights } from '../insights';

const empty: HabitInsights = {
  daysOfData: 3,
  doneDates: new Set(),
  oneFix: null,
  working: null,
  yearCompletions: 0,
  yearRatePct: 0,
};

describe('insightLineCopy', () => {
  it('returns null when there is no pattern yet', () => {
    expect(insightLineCopy(empty)).toBeNull();
  });

  it('prefers the working window over the weekday slip', () => {
    const line = insightLineCopy({
      ...empty,
      oneFix: {
        bars: [],
        recentMissed: 3,
        recentOf: 8,
        weakest: {
          done: 4,
          plural: 'Fridays',
          rate: 0.5,
          scheduled: 8,
          short: 'F',
          weekday: 5,
        },
      },
      working: {
        daypart: {
          endHour: 8,
          key: 'early',
          label: 'Early morning',
          phrase: 'early morning',
          startHour: 5,
        },
        otherPct: 20,
        reminderInWindow: true,
        sample: 20,
        sharePct: 80,
      },
    });
    expect(line).toEqual({
      id: 'working',
      text: 'Most of your check-ins happen early morning.',
    });
  });
});
