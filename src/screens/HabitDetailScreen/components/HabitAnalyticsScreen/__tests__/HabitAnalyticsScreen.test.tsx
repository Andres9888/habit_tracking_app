import { fireEvent, render } from '@testing-library/react-native';
import type { Habit } from '../../../../../features/habits/types';
import type { HabitInsights } from '../../../insights';
import { HabitAnalyticsScreen } from '../HabitAnalyticsScreen';

const WORKING = {
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
} as HabitInsights['working'];

const baseInsights: HabitInsights = {
  daysOfData: 40,
  doneDates: new Set(['2026-08-10', '2026-08-11']),
  oneFix: null,
  working: WORKING,
  yearCompletions: 2,
  yearRatePct: 20,
};

let mockInsights: HabitInsights = baseInsights;

jest.mock('../../../../../utils/getLocalDateString', () => ({
  getLocalDateString: (date?: Date) => {
    if (!date) return '2026-08-15';
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
  },
}));

jest.mock('../../../insights', () => ({
  ...jest.requireActual('../../../insights'),
  useHabitInsights: () => mockInsights,
}));

const habit = {
  _id: 'habit_1',
  createdAt: Date.parse('2026-06-01T09:00:00Z'),
  name: 'Wake-Up Movement',
} as unknown as Habit;

/** Consecutive days from `start`, as YYYY-MM-DD in August 2026. */
function august(start: number, length: number): string[] {
  return Array.from(
    { length },
    (_, offset) => `2026-08-${String(start + offset).padStart(2, '0')}`
  );
}

beforeEach(() => {
  mockInsights = baseInsights;
});

describe('HabitAnalyticsScreen', () => {
  it('shows the weekly chart and opens an insight', () => {
    const onOpenInsight = jest.fn();
    const { getByLabelText, getByText } = render(
      <HabitAnalyticsScreen
        habit={habit}
        onOpenHistory={jest.fn()}
        onOpenInsight={onOpenInsight}
      />
    );
    expect(getByText('Days logged each week')).toBeTruthy();
    expect(getByText('What the log shows')).toBeTruthy();
    fireEvent.press(getByLabelText('Wins land early morning'));
    expect(onOpenInsight).toHaveBeenCalledWith('working');
  });

  it('shows monthly share of scheduled days, not raw counts', () => {
    const { getByText } = render(
      <HabitAnalyticsScreen
        habit={habit}
        onOpenHistory={jest.fn()}
        onOpenInsight={jest.fn()}
      />
    );
    fireEvent.press(getByText('Monthly'));
    expect(getByText('Share of days logged each month')).toBeTruthy();
    expect(getByText(/months · % of scheduled days/)).toBeTruthy();
  });

  it('opens on the verdict and carries the streak rail', () => {
    // Yesterday and today logged, so the rail's Current is a live run.
    mockInsights = { ...baseInsights, doneDates: new Set(august(14, 2)) };
    const { getByLabelText, getByText } = render(
      <HabitAnalyticsScreen
        habit={{ ...habit, bestStreak: 5 } as Habit}
        onOpenHistory={jest.fn()}
        onOpenInsight={jest.fn()}
      />
    );
    expect(getByText('Where you stand')).toBeTruthy();
    expect(getByLabelText('Current streak: 2')).toBeTruthy();
    expect(getByLabelText('Longest: 5')).toBeTruthy();
  });

  it('takes Current from the log, not the stored streak field', () => {
    // `habit.currentStreak` is not recomputed on a miss: with nothing logged,
    // the rail must say 0 rather than repeat the run that already ended.
    mockInsights = { ...baseInsights, doneDates: new Set<string>() };
    const { getByLabelText } = render(
      <HabitAnalyticsScreen
        habit={{ ...habit, bestStreak: 9, currentStreak: 9 } as Habit}
        onOpenHistory={jest.fn()}
        onOpenInsight={jest.fn()}
      />
    );
    expect(getByLabelText('Current streak: 0')).toBeTruthy();
    expect(getByLabelText('Longest: 9')).toBeTruthy();
  });

  it('sends the streak-trend row to History, where the runs live', () => {
    const onOpenHistory = jest.fn();
    // Four runs that lengthen: 1, 2, 4 and 5 days, each broken by a miss.
    const doneDates = new Set([
      ...august(1, 1),
      ...august(3, 2),
      ...august(6, 4),
      ...august(11, 5),
    ]);
    mockInsights = { ...baseInsights, doneDates, working: null };

    const { getByLabelText } = render(
      <HabitAnalyticsScreen
        habit={habit}
        onOpenHistory={onOpenHistory}
        onOpenInsight={jest.fn()}
      />
    );
    fireEvent.press(getByLabelText('Streaks are getting longer'));
    expect(onOpenHistory).toHaveBeenCalled();
  });
});
