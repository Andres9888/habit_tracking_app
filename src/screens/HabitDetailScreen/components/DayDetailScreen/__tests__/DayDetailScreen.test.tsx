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

// The screen queries the focused day directly, so the mock answers per range
// rather than from a fixed rolling window.
const mockCompletedDates = new Set(['2026-08-12']);

jest.mock('../../../insights', () => ({
  ...jest.requireActual('../../../insights'),
  useHabitTrackingRange: ({ startDate }: { startDate: string }) =>
    mockCompletedDates.has(startDate)
      ? [
          {
            _creationTime: Date.parse('2026-08-12T07:30:00Z'),
            completed: true,
            date: startDate,
          },
        ]
      : [],
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

  it('tells the user when a day was outside the habit schedule', () => {
    const { getByText } = render(
      <DayDetailScreen
        focusDate='2026-08-15'
        habit={{ ...habit, daysOfWeek: [1, 2, 3, 4, 5] }}
        onOpenDay={jest.fn()}
        onOpenNote={jest.fn()}
        onToggleDay={jest.fn()}
      />
    );

    expect(getByText('Not scheduled')).toBeTruthy();
    expect(
      getByText('This day is outside this habit’s schedule.')
    ).toBeTruthy();
  });

  it('reads completion from the day itself, not the rolling insight window', () => {
    // A day older than the 400-day insight window: the screen must still see
    // the stored completion instead of offering to "complete" it again.
    const oldDay = '2024-01-10';
    mockCompletedDates.add(oldDay);
    const onToggleDay = jest.fn();
    const { getByLabelText, getByText } = render(
      <DayDetailScreen
        focusDate={oldDay}
        habit={{ ...habit, createdAt: Date.parse('2023-01-01T09:00:00Z') }}
        onOpenDay={jest.fn()}
        onOpenNote={jest.fn()}
        onToggleDay={onToggleDay}
      />
    );

    expect(getByText('Completed')).toBeTruthy();
    fireEvent.press(getByLabelText('Undo completion'));
    expect(onToggleDay).toHaveBeenCalledWith(oldDay, true);
    mockCompletedDates.delete(oldDay);
  });
});
