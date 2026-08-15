import { fireEvent, render } from '@testing-library/react-native';
import type { Habit } from '../../../../../features/habits/types';
import { HabitHistoryScreen } from '../HabitHistoryScreen';

jest.mock('../../CalendarTabContent', () => ({
  CalendarTabContent: () => null,
}));

jest.mock('../../HabitNoteCard', () => ({
  HabitNoteCard: () => null,
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
    daysOfData: 20,
    doneDates: new Set(['2026-08-12']),
    oneFix: null,
    working: null,
    yearCompletions: 12,
    yearRatePct: 40,
  }),
}));

const habit = {
  _id: 'habit_1',
  bestStreak: 8,
  createdAt: Date.parse('2026-06-01T09:00:00Z'),
  name: 'Wake-Up Movement',
} as unknown as Habit;

describe('HabitHistoryScreen', () => {
  it('shows stats, entries, and opens a day from the list', () => {
    const onOpenDay = jest.fn();
    const { getByLabelText, getByText } = render(
      <HabitHistoryScreen
        focusDate='2026-08-12'
        habit={habit}
        onOpenDay={onOpenDay}
      />
    );
    expect(getByText('Days done')).toBeTruthy();
    expect(getByText('Logged entries')).toBeTruthy();
    fireEvent.press(getByLabelText('Wed 12'));
    expect(onOpenDay).toHaveBeenCalledWith('2026-08-12');
  });
});
