import { render } from '@testing-library/react-native';
import { DetailHero } from '../DetailHero';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ bottom: 34, left: 0, right: 0, top: 47 }),
}));

jest.mock('../../../../theme/ThemeContext', () => ({
  useThemeColors: () => ({
    colors: {
      background: '#fff',
      border: '#e7e5e4',
      card: '#f7f5f2',
      cardBorder: '#e7e5e4',
      gray: { 50: '#fafaf9' },
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
      primary: { 100: '#e0f2fe', 500: '#3b82f6', 600: '#059669', 700: '#1d4ed8' },
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
} as never;

describe('DetailHero', () => {
  it('renders habit name', () => {
    const { getByText } = render(
      <DetailHero habit={mockHabit} totalCompletions={89} onDayPress={noop} />
    );
    expect(getByText('Morning Run')).toBeTruthy();
  });

  it('renders habit icon with accessibility label', () => {
    const { getByLabelText } = render(
      <DetailHero habit={mockHabit} totalCompletions={89} onDayPress={noop} />
    );
    expect(getByLabelText('Habit icon: 🏃')).toBeTruthy();
  });

  it('folds total completions into the encouragement line', () => {
    const { getByText } = render(
      <DetailHero habit={mockHabit} totalCompletions={89} onDayPress={noop} />
    );
    expect(getByText('89 times')).toBeTruthy();
    expect(getByText(/You.ve shown up/)).toBeTruthy();
  });

  it('renders the fused complete bar', () => {
    const { getByText } = render(
      <DetailHero habit={mockHabit} totalCompletions={89} onDayPress={noop} />
    );
    expect(getByText('Mark as done')).toBeTruthy();
  });

  it('shows fallback name when habit has no name', () => {
    const noNameHabit = { ...mockHabit, name: undefined, icon: undefined };
    const { getByText } = render(
      <DetailHero habit={noNameHabit as never} totalCompletions={0} onDayPress={noop} />
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
      <DetailHero habit={digitHabit as never} totalCompletions={0} onDayPress={noop} />
    );
    expect(getByText('5-Minute Meditation')).toBeTruthy();
  });

  it('has accessible header role on habit name', () => {
    const { getByRole } = render(
      <DetailHero habit={mockHabit} totalCompletions={89} onDayPress={noop} />
    );
    expect(getByRole('header')).toBeTruthy();
  });

  it('renders the current streak as the hero with a personal-best pill', () => {
    const { getByText, queryByText } = render(
      <DetailHero habit={mockHabit} totalCompletions={89} onDayPress={noop} />
    );
    expect(getByText('5')).toBeTruthy();
    expect(getByText('day streak')).toBeTruthy();
    expect(getByText('Personal best · 21 days')).toBeTruthy();
    expect(queryByText(/to beat/i)).toBeNull();
  });

  it('shows the rebuilding sublabel only for a freshly reset streak', () => {
    const brokenHabit = { ...mockHabit, currentStreak: 1, bestStreak: 139 };
    const { getByText } = render(
      <DetailHero habit={brokenHabit as never} totalCompletions={170} onDayPress={noop} />
    );
    expect(getByText('1')).toBeTruthy();
    expect(getByText('day streak · rebuilding')).toBeTruthy();
    expect(getByText('Personal best · 139 days')).toBeTruthy();
    expect(getByText(/The chain always starts again/)).toBeTruthy();
  });

  it('keeps a healthy streak free of rebuilding copy', () => {
    const { queryByText } = render(
      <DetailHero habit={mockHabit} totalCompletions={89} onDayPress={noop} />
    );
    expect(queryByText(/rebuilding/)).toBeNull();
    expect(queryByText(/starts again/)).toBeNull();
  });

  it('hides pill and encouragement for a brand-new habit', () => {
    const freshHabit = { ...mockHabit, currentStreak: 0, bestStreak: 0 };
    const { getByText, queryByText } = render(
      <DetailHero habit={freshHabit as never} totalCompletions={0} onDayPress={noop} />
    );
    expect(getByText('0')).toBeTruthy();
    expect(getByText('day streak')).toBeTruthy();
    expect(queryByText(/Personal best/)).toBeNull();
    expect(queryByText(/shown up/)).toBeNull();
  });
});
