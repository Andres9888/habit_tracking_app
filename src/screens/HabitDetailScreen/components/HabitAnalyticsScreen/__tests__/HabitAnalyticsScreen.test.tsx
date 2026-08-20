import { fireEvent, render } from '@testing-library/react-native';
import type { Habit } from '../../../../../features/habits/types';
import { HabitAnalyticsScreen } from '../HabitAnalyticsScreen';

jest.mock('../../HabitDetailHistory', () => ({
  YearGlanceCard: () => null,
}));

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
  useHabitInsights: () => ({
    daysOfData: 40,
    doneDates: new Set(['2026-08-10', '2026-08-11']),
    oneFix: null,
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
    yearCompletions: 2,
    yearRatePct: 20,
  }),
}));

const habit = {
  _id: 'habit_1',
  createdAt: Date.parse('2026-06-01T09:00:00Z'),
  name: 'Wake-Up Movement',
} as unknown as Habit;

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
    expect(getByText(/of scheduled days/)).toBeTruthy();
  });
});
