import { fireEvent, render } from '@testing-library/react-native';
import type { Habit } from '../../../../../features/habits/types';
import { DayDetailScreen } from '../DayDetailScreen';

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
    todayCompletedAt: undefined,
    working: null,
    yearCompletions: 1,
    yearRatePct: 10,
  }),
}));

const habit = {
  _id: 'habit_1',
  createdAt: Date.parse('2026-06-01T09:00:00Z'),
  name: 'Wake-Up Movement',
} as unknown as Habit;

describe('DayDetailScreen', () => {
  it('shows the day and toggles completion', () => {
    const onToggleDay = jest.fn();
    const { getByLabelText, getByText } = render(
      <DayDetailScreen
        focusDate='2026-08-12'
        habit={habit}
        onOpenDay={jest.fn()}
        onOpenNote={jest.fn()}
        onToggleDay={onToggleDay}
      />
    );
    expect(getByText('Wednesday, August 12')).toBeTruthy();
    expect(getByText('Completed')).toBeTruthy();
    expect(getByText('No note for this day.')).toBeTruthy();
    expect(getByLabelText('Add a note')).toBeTruthy();
    fireEvent.press(getByLabelText('Undo completion'));
    expect(onToggleDay).toHaveBeenCalledWith('2026-08-12', true);
  });
});
