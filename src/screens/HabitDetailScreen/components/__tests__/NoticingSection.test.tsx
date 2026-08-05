/**
 * The insight cards are the point of the redesign, so they get their own
 * coverage: present with a real pattern, absent (with no filler copy) without.
 */
import { fireEvent, render } from '@testing-library/react-native';
import type { HabitInsights, WeekdayStat } from '../../insights';
import { NoticingSection } from '../NoticingSection';

function stat(weekday: number, short: string, rate: number): WeekdayStat {
  return {
    done: Math.round(rate * 10),
    plural: `${short}days`,
    rate,
    scheduled: 10,
    short: short[0] ?? '',
    weekday,
  };
}

const BARS = [
  stat(1, 'Mon', 0.9),
  stat(2, 'Tues', 0.9),
  stat(3, 'Wednes', 0.8),
  stat(4, 'Thurs', 0.9),
  stat(5, 'Fri', 0.1),
  stat(6, 'Satur', 0.7),
  stat(0, 'Sun', 0.7),
];

const FULL: HabitInsights = {
  daysOfData: 60,
  oneFix: { bars: BARS, recentMissed: 3, recentOf: 4, weakest: BARS[4]! },
  working: {
    daypart: {
      endHour: 9,
      key: 'early',
      label: 'Early morning',
      phrase: 'before 9 AM',
      startHour: 0,
    },
    otherPct: 8,
    reminderInWindow: true,
    reminderTime: '6:45 AM',
    sample: 41,
    sharePct: 92,
  },
  yearCompletions: 148,
};

function renderSection(insights: HabitInsights, onAdjust = jest.fn()) {
  return render(
    <NoticingSection
      habitId='habit_1'
      insights={insights}
      onAdjustReminder={onAdjust}
    />
  );
}

describe('NoticingSection', () => {
  it('renders both cards when a pattern was detected', async () => {
    const { findByText, getByText } = renderSection(FULL);
    expect(getByText("What we're noticing")).toBeTruthy();
    expect(getByText('Your wins land before 9 AM.')).toBeTruthy();
    expect(getByText('92%')).toBeTruthy();
    expect(
      getByText('Reminder at 6:45 AM — just inside your best window.')
    ).toBeTruthy();
    // OneFixCard reads its stored response before painting.
    expect(await findByText('Fridays are where it slips.')).toBeTruthy();
  });

  it('routes Adjust to the habit editor', async () => {
    const onAdjust = jest.fn();
    const { findByLabelText } = renderSection(FULL, onAdjust);
    fireEvent.press(await findByLabelText('Adjust ›'));
    expect(onAdjust).toHaveBeenCalledTimes(1);
  });

  it('disappears entirely once there is history but no pattern', () => {
    const { queryByText } = renderSection({
      daysOfData: 60,
      oneFix: null,
      working: null,
      yearCompletions: 40,
    });
    expect(queryByText("What we're noticing")).toBeNull();
  });

  it('explains the wait instead of inventing copy in the first two weeks', () => {
    const { getByText, queryByText } = renderSection({
      daysOfData: 5,
      oneFix: null,
      working: null,
      yearCompletions: 4,
    });
    expect(getByText(/Patterns start to appear around day 14/)).toBeTruthy();
    expect(queryByText(/What's working/)).toBeNull();
  });
});
