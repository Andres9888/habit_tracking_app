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
      gray: { 50: '#fafaf9' },
      status: { success: '#22c55e' },
      text: {
        primary: '#1a1a1a',
        secondary: '#666',
        tertiary: '#999',
        inverse: '#fff',
      },
      primary: { 100: '#e0f2fe', 500: '#3b82f6', 700: '#1d4ed8' },
    },
  }),
}));

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
      <DetailHero habit={mockHabit} totalCompletions={89} />
    );
    expect(getByText('Morning Run')).toBeTruthy();
  });

  it('renders habit icon with accessibility label', () => {
    const { getByLabelText } = render(
      <DetailHero habit={mockHabit} totalCompletions={89} />
    );
    expect(getByLabelText('Habit icon: 🏃')).toBeTruthy();
  });

  it('renders inline streak, best, and total stats', () => {
    const { getByText } = render(
      <DetailHero habit={mockHabit} totalCompletions={89} />
    );
    expect(getByText('5')).toBeTruthy();
    expect(getByText('21')).toBeTruthy();
    expect(getByText('89')).toBeTruthy();
    expect(getByText('streak')).toBeTruthy();
    expect(getByText('best')).toBeTruthy();
    expect(getByText('total')).toBeTruthy();
  });

  it('shows fallback name when habit has no name', () => {
    const noNameHabit = { ...mockHabit, name: undefined, icon: undefined };
    const { getByText } = render(
      <DetailHero habit={noNameHabit as never} totalCompletions={0} />
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
      <DetailHero habit={digitHabit as never} totalCompletions={0} />
    );
    expect(getByText('5-Minute Meditation')).toBeTruthy();
  });

  it('renders schedule chips for frequency and preferred time', () => {
    const scheduledHabit = {
      ...(mockHabit as object),
      frequency: 'daily',
      preferredTime: 'morning',
    };
    const { getByText, getByLabelText } = render(
      <DetailHero habit={scheduledHabit as never} totalCompletions={89} />
    );
    expect(getByText('Daily')).toBeTruthy();
    expect(getByText('Mornings')).toBeTruthy();
    expect(getByLabelText('Schedule: Daily, Mornings')).toBeTruthy();
  });

  it('renders no schedule chips when habit has no schedule', () => {
    const { queryByText } = render(
      <DetailHero habit={mockHabit} totalCompletions={89} />
    );
    expect(queryByText('Daily')).toBeNull();
  });

  it('has accessible header role on habit name', () => {
    const { getByRole } = render(
      <DetailHero habit={mockHabit} totalCompletions={89} />
    );
    expect(getByRole('header')).toBeTruthy();
  });
});
