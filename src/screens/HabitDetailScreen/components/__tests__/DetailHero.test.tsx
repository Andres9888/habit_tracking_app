import { fireEvent, render } from '@testing-library/react-native';
import { DetailHero } from '../DetailHero';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ bottom: 34, left: 0, right: 0, top: 47 }),
}));

jest.mock('../../../../theme/ThemeContext', () => ({
  useThemeColors: () => ({
    isDark: false,
    colors: {
      background: '#fff',
      border: '#e7e5e4',
      card: '#f7f5f2',
      cardBorder: '#e7e5e4',
      gray: { 50: '#fafaf9', 300: '#C4BFB7' },
      surface: '#EDEAE5',
      card: '#FFFFFF',
      status: {
        success: '#22c55e',
        successLight: '#dcfce7',
        successText: '#166534',
        streak: '#d97706',
        streakLight: '#fef3c7',
        streakText: '#92400e',
      },
      text: {
        primary: '#1a1a1a',
        secondary: '#666',
        tertiary: '#999',
        inverse: '#fff',
      },
      primary: {
        100: '#e0f2fe',
        300: '#6EE7B7',
        500: '#3b82f6',
        600: '#059669',
        700: '#1d4ed8',
      },
    },
  }),
}));

const noop = () => {};

const mockHabit = {
  _id: 'habit-1' as never,
  _creationTime: Date.now(),
  name: 'Morning Run',
  icon: '🏃',
  color: '#fef3c7',
  iconColor: '#f59e0b',
  currentStreak: 5,
  bestStreak: 21,
  createdAt: new Date().toISOString(),
  frequency: 'daily',
  cueAfterBehavior: 'coffee',
  reminderTime: '07:15',
} as never;

describe('DetailHero', () => {
  it('renders habit name', () => {
    const { getByText } = render(
      <DetailHero habit={mockHabit} totalCompletions={89} onCompletePress={noop} />
    );
    expect(getByText('Morning Run')).toBeTruthy();
  });

  it('renders habit icon with accessibility label', () => {
    const { getByLabelText } = render(
      <DetailHero habit={mockHabit} totalCompletions={89} onCompletePress={noop} />
    );
    expect(getByLabelText('Habit icon: 🏃')).toBeTruthy();
  });

  it('folds total completions into the encouragement line', () => {
    const { getByText } = render(
      <DetailHero habit={mockHabit} totalCompletions={89} onCompletePress={noop} />
    );
    expect(getByText('89 times')).toBeTruthy();
    expect(getByText(/You.ve shown up/)).toBeTruthy();
  });

  it('renders the fused complete bar', () => {
    const { getByText } = render(
      <DetailHero habit={mockHabit} totalCompletions={89} onCompletePress={noop} />
    );
    expect(getByText('Mark as done')).toBeTruthy();
  });

  it('shows fallback name when habit has no name', () => {
    const noNameHabit = { ...mockHabit, name: undefined, icon: undefined };
    const { getByText } = render(
      <DetailHero habit={noNameHabit as never} totalCompletions={0} onCompletePress={noop} />
    );
    expect(getByText('Habit')).toBeTruthy();
  });

  it('preserves digit-prefixed name when habit has icon', () => {
    const digitHabit = {
      ...mockHabit,
      name: '5-Minute Meditation',
      icon: '🧘',
    };
    const { getByText } = render(
      <DetailHero habit={digitHabit as never} totalCompletions={0} onCompletePress={noop} />
    );
    expect(getByText('5-Minute Meditation')).toBeTruthy();
  });

  it('has accessible header role on habit name', () => {
    const { getByRole } = render(
      <DetailHero habit={mockHabit} totalCompletions={89} onCompletePress={noop} />
    );
    expect(getByRole('header')).toBeTruthy();
  });

  it('renders OD-style schedule subtitle and reminder cue', () => {
    const { getByText } = render(
      <DetailHero habit={mockHabit} totalCompletions={89} onCompletePress={noop} />
    );
    expect(getByText('Every day · after coffee')).toBeTruthy();
    expect(getByText('Reminder 7:15 AM')).toBeTruthy();
  });

  it('does not render Pending/Done status chip (status lives on CTA)', () => {
    const incomplete = render(
      <DetailHero habit={mockHabit} totalCompletions={89} onCompletePress={noop} />
    );
    expect(incomplete.queryByLabelText('Status: Pending')).toBeNull();
    expect(incomplete.queryByLabelText('Status: Done')).toBeNull();
    expect(incomplete.getByText('Mark as done')).toBeTruthy();

    const complete = render(
      <DetailHero
        habit={mockHabit}
        isCompletedToday
        totalCompletions={89}
        onCompletePress={noop}
      />
    );
    expect(complete.queryByLabelText('Status: Pending')).toBeNull();
    expect(complete.queryByLabelText('Status: Done')).toBeNull();
    expect(complete.getByText('Done today')).toBeTruthy();
  });

  it('renders path-to-best ring caption and momentum cells', () => {
    const { getByText, getByLabelText, getAllByText } = render(
      <DetailHero habit={mockHabit} totalCompletions={89} onCompletePress={noop} />
    );
    expect(getAllByText('5').length).toBeGreaterThanOrEqual(1);
    expect(getByText('day streak')).toBeTruthy();
    expect(getByText(/Path to best/)).toBeTruthy();
    expect(getByLabelText(/Streak 5 days, personal best 21/)).toBeTruthy();
    expect(getByText('Best')).toBeTruthy();
    expect(getByText('21')).toBeTruthy();
    expect(getByText('Total')).toBeTruthy();
    expect(getByText('89')).toBeTruthy();
    expect(getByText('30-day')).toBeTruthy();
  });

  it('shows the rebuilding sublabel only for a freshly reset streak', () => {
    const brokenHabit = { ...mockHabit, currentStreak: 1, bestStreak: 139 };
    const { getByText, getAllByText } = render(
      <DetailHero habit={brokenHabit as never} totalCompletions={170} onCompletePress={noop} />
    );
    expect(getAllByText('1').length).toBeGreaterThanOrEqual(1);
    expect(getByText(/rebuilding/)).toBeTruthy();
    expect(getByText(/path to best opens after day 2/)).toBeTruthy();
    expect(getByText(/The chain always starts again/)).toBeTruthy();
  });

  it('keeps a healthy streak free of rebuilding copy', () => {
    const { queryByText } = render(
      <DetailHero habit={mockHabit} totalCompletions={89} onCompletePress={noop} />
    );
    expect(queryByText(/rebuilding/)).toBeNull();
    expect(queryByText(/starts again/)).toBeNull();
  });

  it('shows empty-week prompt when no completions this week', () => {
    const freshHabit = { ...mockHabit, currentStreak: 0, bestStreak: 0 };
    const { getByText, getAllByText, queryByText } = render(
      <DetailHero
        completedDates={new Set()}
        habit={freshHabit as never}
        totalCompletions={0}
        onCompletePress={noop}
      />
    );
    expect(getAllByText('0').length).toBeGreaterThanOrEqual(1);
    expect(getByText(/Today is day one/)).toBeTruthy();
    expect(queryByText(/Personal best/)).toBeNull();
  });

  it('renders week strip when there are completions', () => {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    const todayStr = `${y}-${m}-${d}`;
    const { getByLabelText } = render(
      <DetailHero
        completedDates={new Set([todayStr])}
        habit={mockHabit}
        isCompletedToday
        totalCompletions={1}
        onCompletePress={noop}
      />
    );
    expect(getByLabelText('This week')).toBeTruthy();
  });

  it('calls onCompletePress when the CTA is pressed, regardless of state', () => {
    const onCompletePress = jest.fn();
    const { getByLabelText, rerender } = render(
      <DetailHero
        habit={mockHabit}
        totalCompletions={89}
        onCompletePress={onCompletePress}
      />
    );
    fireEvent.press(getByLabelText('Mark as done for today'));
    expect(onCompletePress).toHaveBeenCalledTimes(1);

    // The one-way/undo decision lives in the caller (useCompleteHandlers),
    // not here — DetailHero always forwards the press.
    rerender(
      <DetailHero
        habit={mockHabit}
        isCompletedToday
        totalCompletions={89}
        onCompletePress={onCompletePress}
      />
    );
    fireEvent.press(getByLabelText('Done today, double tap for the undo option'));
    expect(onCompletePress).toHaveBeenCalledTimes(2);
  });
});
