import React from 'react';
import { render } from '@testing-library/react-native';
import { DetailHero } from '../DetailHero';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ bottom: 34, left: 0, right: 0, top: 47 }),
}));

jest.mock('../../../../theme/ThemeContext', () => ({
  useThemeColors: () => ({
    colors: {
      text: { primary: '#1a1a1a', secondary: '#666' },
      primary: {
        100: '#e0f2fe',
        500: '#3b82f6',
        700: '#1d4ed8',
      },
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
  createdAt: new Date().toISOString(),
} as never;

describe('DetailHero', () => {
  it('renders habit name', () => {
    const { getByText } = render(<DetailHero habit={mockHabit} />);
    expect(getByText('Morning Run')).toBeTruthy();
  });

  it('renders habit icon with accessibility label', () => {
    const { getByLabelText } = render(<DetailHero habit={mockHabit} />);
    expect(getByLabelText('Habit icon: 🏃')).toBeTruthy();
  });

  it('renders streak badge when currentStreak > 0', () => {
    const { getByText } = render(<DetailHero habit={mockHabit} />);
    expect(getByText('5 day streak')).toBeTruthy();
  });

  it('hides streak badge when currentStreak is 0', () => {
    const noStreakHabit = { ...mockHabit, currentStreak: 0 };
    const { queryByText } = render(
      <DetailHero habit={noStreakHabit as never} />
    );
    expect(queryByText(/day streak/)).toBeNull();
  });

  it('shows fallback name when habit has no name', () => {
    const noNameHabit = { ...mockHabit, name: undefined, icon: undefined };
    const { getByText } = render(
      <DetailHero habit={noNameHabit as never} />
    );
    expect(getByText('Habit')).toBeTruthy();
  });

  it('preserves digit-prefixed name when habit has icon', () => {
    const digitHabit = { ...mockHabit, name: '5-Minute Meditation', icon: '🧘' };
    const { getByText } = render(<DetailHero habit={digitHabit as never} />);
    expect(getByText('5-Minute Meditation')).toBeTruthy();
  });

  it('has accessible header role on habit name', () => {
    const { getByRole } = render(<DetailHero habit={mockHabit} />);
    expect(getByRole('header')).toBeTruthy();
  });
});
