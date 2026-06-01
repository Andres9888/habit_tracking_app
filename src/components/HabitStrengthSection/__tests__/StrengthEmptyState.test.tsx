import React from 'react';
import { Pressable, Text } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';

import { StrengthEmptyState } from '../StrengthEmptyState';

jest.mock('@/theme/ThemeContext', () => ({
  useThemeColors: () => ({
    colors: {
      background: '#fafafa',
      border: '#e5e5e5',
      card: '#ffffff',
      text: { primary: '#1a1a1a', secondary: '#666666' },
    },
  }),
}));

// Isolate from Button internals (reanimated, focus ring, app theme) — assert the
// wiring (label + onPress), not the primitive's rendering.
jest.mock('../../Button', () => ({
  Button: ({ children, accessibilityLabel, onPress }: any) => (
    <Pressable accessibilityLabel={accessibilityLabel} onPress={onPress}>
      <Text>{children}</Text>
    </Pressable>
  ),
}));

describe('StrengthEmptyState', () => {
  it('shows the path to the first real milestone (Habit Starter, 3 days)', () => {
    const { getByText } = render(<StrengthEmptyState startingEmoji='🌱' />);
    expect(getByText('3 days to Habit Starter')).toBeTruthy();
    expect(getByText('Day 0 of 3 · Starting')).toBeTruthy();
  });

  it('renders the Mark today complete action', () => {
    const { getByLabelText } = render(<StrengthEmptyState startingEmoji='🌱' />);
    expect(getByLabelText('Mark today complete')).toBeTruthy();
  });

  it('calls onMarkTodayComplete when the button is pressed', () => {
    const onMarkTodayComplete = jest.fn();
    const { getByLabelText } = render(
      <StrengthEmptyState startingEmoji='🌱' onMarkTodayComplete={onMarkTodayComplete} />
    );
    fireEvent.press(getByLabelText('Mark today complete'));
    expect(onMarkTodayComplete).toHaveBeenCalledTimes(1);
  });
});
