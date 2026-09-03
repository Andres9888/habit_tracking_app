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

const DEFAULT_ROWS = [{ completed: true, date: '2026-08-12' }];
let trackingRows: { completed: boolean; date: string }[] = DEFAULT_ROWS;
const mockUseHabitTrackingRange = jest.fn(() => trackingRows);

beforeEach(() => {
  trackingRows = DEFAULT_ROWS;
});

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
      startDate: '2026-01-01',
    });
  });

  it('fetches from January 1 when the habit was created this year', () => {
    renderScreen();
    expect(mockUseHabitTrackingRange).toHaveBeenCalledWith({
      endDate: '2026-08-15',
      habitId: 'habit_1',
      startDate: '2026-01-01',
    });
  });

  it('fetches from creation when the habit predates this year', () => {
    renderScreen({
      habit: { ...habit, createdAt: Date.parse('2025-11-03T09:00:00Z') },
    });
    expect(mockUseHabitTrackingRange).toHaveBeenCalledWith({
      endDate: '2026-08-15',
      habitId: 'habit_1',
      startDate: '2025-11-03',
    });
  });

  it('paints a completion logged before the creation date', () => {
    trackingRows = [{ completed: true, date: '2026-05-28' }];
    const { getByLabelText } = renderScreen({ focusDate: '2026-05-28' });
    expect(getByLabelText('May 28, completed')).toBeTruthy();
  });

  it('withholds the best-month star until two months have settled', () => {
    // Habit created June 1, viewing July (settled) — June is the only other
    // settled month, so July can be starred only if June also counts.
    trackingRows = [{ completed: true, date: '2026-07-02' }];
    const { queryByText } = renderScreen({
      focusDate: '2026-07-10',
      habit: { ...habit, createdAt: Date.parse('2026-07-01T09:00:00Z') },
    });
    expect(queryByText(/★/)).toBeNull();
  });

  it('labels the rail rate "Since start" for a habit created this year', () => {
    const { getByLabelText } = renderScreen();
    expect(getByLabelText(/^Since start: /)).toBeTruthy();
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

  it('takes the rail’s Current from the log, not the stored streak field', () => {
    // `habit.currentStreak` is not recomputed on a miss: with nothing logged,
    // the rail must say 0 rather than repeat the run that already ended.
    trackingRows = [];
    const { getByLabelText } = renderScreen({
      habit: { ...habit, currentStreak: 9 } as Habit,
    });

    expect(getByLabelText('Current: 0')).toBeTruthy();
    expect(getByLabelText('Longest: 8')).toBeTruthy();
  });

  it('says which squares carry a note', () => {
    const { getByLabelText } = renderScreen({
      notes: { '2026-08-12': 'Slept badly, went anyway' },
    });

    expect(getByLabelText('August 12, completed, has note')).toBeTruthy();
  });
});
