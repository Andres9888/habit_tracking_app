import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AdvancedOptionsRows } from '../AdvancedOptionsRows';

jest.mock('@/utils/haptics', () => ({ triggerHaptic: jest.fn() }));

jest.mock('@/hooks/useProgressEmojis', () => ({
  useUserDefaultProgressEmojis: () => ({
    starting: '🥉',
    building: '🥈',
    developing: '🥇',
    strong: '🏆',
    automatic: '💎',
  }),
  useUserCustomProgressEmojis: () => undefined,
}));

jest.mock('@/theme/ThemeContext', () => ({
  useThemeColors: () => ({
    colors: {
      card: '#EDEAE5',
      cardBorder: '#DDD8D2',
      surface: '#EDEAE5',
      primary: {
        100: '#D1FAE5',
        300: '#6EE7B7',
        600: '#059669',
        700: '#047857',
      },
      gray: { 200: '#DDD8D2' },
      status: { streakLight: '#FEF3C7', streakText: '#92400E' },
      text: { primary: '#2D2A26', secondary: '#6B6560', tertiary: '#6E6660' },
    },
  }),
}));

const baseProps = {
  strengthAlgorithm: 'balanced' as const,
  progressEmojis: undefined,
  streakGoal: 0,
  onOpen: jest.fn(),
};

describe('AdvancedOptionsRows', () => {
  it('renders all three plain-language options with their current values', () => {
    const { getByText } = render(<AdvancedOptionsRows {...baseProps} />);
    expect(getByText('How fast it builds')).toBeTruthy();
    expect(getByText('Average · ~66-day build')).toBeTruthy();
    expect(getByText('Progress icons')).toBeTruthy();
    expect(getByText('Ranks · 5 stages')).toBeTruthy();
    expect(getByText('Streak target')).toBeTruthy();
    expect(getByText('No goal set')).toBeTruthy();
  });

  it('shows the Recommended badge on the default (balanced) strength curve', () => {
    const { getByText } = render(<AdvancedOptionsRows {...baseProps} />);
    expect(getByText('Recommended')).toBeTruthy();
  });

  it('hides the Recommended badge when a non-default algorithm is chosen', () => {
    const { queryByText } = render(
      <AdvancedOptionsRows {...baseProps} strengthAlgorithm='strict' />
    );
    expect(queryByText('Recommended')).toBeNull();
  });

  it('renders the streak value when a goal is set', () => {
    const { getByText } = render(
      <AdvancedOptionsRows {...baseProps} streakGoal={30} />
    );
    expect(getByText('30-day goal')).toBeTruthy();
  });

  it('opens the matching sheet when a row is pressed', () => {
    const onOpen = jest.fn();
    const { getByLabelText } = render(
      <AdvancedOptionsRows {...baseProps} onOpen={onOpen} />
    );
    fireEvent.press(getByLabelText('How fast it builds, tap to edit'));
    expect(onOpen).toHaveBeenCalledWith('algorithm');
    fireEvent.press(getByLabelText('Progress icons, tap to edit'));
    expect(onOpen).toHaveBeenCalledWith('growth');
    fireEvent.press(getByLabelText('Streak target, tap to edit'));
    expect(onOpen).toHaveBeenCalledWith('streak');
  });
});
