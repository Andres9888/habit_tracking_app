import { analyticsInsightRows } from '../analyticsInsightRows';
import type { HabitInsights } from '../../../insights';

const empty: HabitInsights = {
  daysOfData: 3,
  doneDates: new Set(),
  oneFix: null,
  working: null,
  yearCompletions: 0,
  yearRatePct: 0,
};

describe('analyticsInsightRows', () => {
  it('returns nothing before a pattern exists', () => {
    expect(analyticsInsightRows(empty)).toEqual([]);
  });

  it('lists working and weekday-slip rows', () => {
    const rows = analyticsInsightRows({
      ...empty,
      oneFix: {
        bars: [],
        recentMissed: 3,
        recentOf: 4,
        weakest: {
          done: 1,
          plural: 'Fridays',
          rate: 0.2,
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
    expect(rows[0]).toMatchObject({
      id: 'working',
      title: 'Wins land early morning',
    });
    expect(rows[1]?.id).toBe('oneFix');
  });
});
