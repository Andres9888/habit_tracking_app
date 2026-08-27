import type { ComponentProps } from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import type { Habit } from '../../../../../features/habits/types';
import { HabitHistoryScreen } from '../HabitHistoryScreen';

jest.mock('../../../../../utils/getLocalDateString', () => ({
  getLocalDateString: (date?: Date) => {
    if (!date) return '2026-08-15';
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
  },
}));

const mockUseHabitTrackingRange = jest.fn(() => [
  {
    completed: true,
    date: '2026-08-12',
  },
]);

jest.mock('../../../insights', () => ({
  ...jest.requireActual('../../../insights'),
  useHabitTrackingRange: (...args: unknown[]) =>
    mockUseHabitTrackingRange(...args),
}));

const habit = {
  _id: 'habit_1',
  bestStreak: 8,
  createdAt: Date.parse('2026-06-01T09:00:00Z'),
  name: 'Wake-Up Movement',
} as unknown as Habit;

/** August 2026 for the stock habit; overrides swap in the case under test. */
function renderScreen(
  props: Partial<ComponentProps<typeof HabitHistoryScreen>> = {}
) {
  return render(
    <HabitHistoryScreen
      focusDate='2026-08-12'
      habit={habit}
      onOpenDay={jest.fn()}
      {...props}
    />
  );
}

describe('HabitHistoryScreen', () => {
  it('shows logged entries and opens a day from the list', () => {
    const onOpenDay = jest.fn();
    const { getAllByText, getByLabelText, getByText } = renderScreen({
      onOpenDay,
    });
    expect(getByText('Daily record')).toBeTruthy();
    // Once in the legend, once on the 12 August row.
    expect(getAllByText('Completed')).toHaveLength(2);
    fireEvent.press(getByLabelText('Wed 12'));
    expect(onOpenDay).toHaveBeenCalledWith('2026-08-12');
    expect(mockUseHabitTrackingRange).toHaveBeenCalledWith({
      endDate: '2026-08-15',
      habitId: 'habit_1',
      startDate: '2026-06-01',
    });
  });

  it('bounds the range to the current year when the habit has no createdAt', () => {
    renderScreen({
      focusDate: undefined,
      habit: { ...habit, createdAt: undefined },
    });

    expect(mockUseHabitTrackingRange).toHaveBeenCalledWith({
      endDate: '2026-08-15',
      habitId: 'habit_1',
      startDate: '2026-01-01',
    });
  });

  it('labels off-schedule dates as not scheduled', () => {
    const { getAllByText } = renderScreen({
      focusDate: '2026-08-15',
      habit: { ...habit, daysOfWeek: [1, 2, 3, 4, 5] },
    });

    expect(getAllByText('Not scheduled').length).toBeGreaterThan(0);
  });

  it('opens a past square from the calendar', () => {
    const onOpenDay = jest.fn();
    const { getByLabelText } = renderScreen({ onOpenDay });

    fireEvent.press(getByLabelText('August 12, completed'));
    expect(onOpenDay).toHaveBeenCalledWith('2026-08-12');
  });

  it('leaves upcoming squares inert', () => {
    const { queryByLabelText } = renderScreen();

    // 20 August is after the mocked today (15 August): drawn, not a button.
    expect(queryByLabelText('August 20, upcoming')).toBeNull();
    expect(queryByLabelText('August 14, missed')).toBeTruthy();
  });

  it('says which squares carry a note', () => {
    const { getByLabelText } = renderScreen({
      notes: { '2026-08-12': 'Slept badly, went anyway' },
    });

    expect(getByLabelText('August 12, completed, has note')).toBeTruthy();
  });
});
