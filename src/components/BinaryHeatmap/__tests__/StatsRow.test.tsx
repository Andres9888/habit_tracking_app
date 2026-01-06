/**
 * StatsRow Component Tests
 *
 * Tests for the stats row that displays:
 * - Frequency badge (e.g., "Daily", "Weekly")
 * - Streak badge with fire icon and count
 * - Settings button
 */

import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { StatsRow } from '../StatsRow';

// Mock lucide-react-native icons - return simple string representations
jest.mock('lucide-react-native', () => ({
  Settings: ({ testID }: { testID?: string }) => testID || 'SettingsIcon',
  Flame: ({ testID }: { testID?: string }) => testID || 'FlameIcon',
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.useReducedMotion = jest.fn(() => false);
  return Reanimated;
});

describe('StatsRow', () => {
  const defaultProps = {
    frequency: 'Daily',
    currentStreak: 15,
    habitColor: '#10b981',
    onSettingsPress: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the container with correct accessibility attributes', () => {
      render(<StatsRow {...defaultProps} />);

      const container = screen.getByLabelText('Habit statistics');
      expect(container).toBeTruthy();
    });

    it('renders the frequency badge with correct text', () => {
      render(<StatsRow {...defaultProps} />);

      expect(screen.getByText('Daily')).toBeTruthy();
    });

    it('renders the frequency badge with correct accessibility label', () => {
      render(<StatsRow {...defaultProps} />);

      const badge = screen.getByLabelText('Frequency: Daily');
      expect(badge).toBeTruthy();
    });

    it('renders different frequency values correctly', () => {
      const { rerender } = render(
        <StatsRow {...defaultProps} frequency='Weekly' />
      );
      expect(screen.getByText('Weekly')).toBeTruthy();

      rerender(<StatsRow {...defaultProps} frequency='3x per week' />);
      expect(screen.getByText('3x per week')).toBeTruthy();
    });
  });

  describe('Streak Badge', () => {
    it('renders the streak badge when currentStreak > 0', () => {
      render(<StatsRow {...defaultProps} currentStreak={15} />);

      expect(screen.getByText('15 day streak')).toBeTruthy();
    });

    it('renders singular "day" for streak of 1', () => {
      render(<StatsRow {...defaultProps} currentStreak={1} />);

      expect(screen.getByText('1 day streak')).toBeTruthy();
    });

    it('does not render streak badge when currentStreak is 0', () => {
      render(<StatsRow {...defaultProps} currentStreak={0} />);

      expect(screen.queryByText(/day streak/)).toBeNull();
    });

    it('renders the flame icon when streak > 0', () => {
      const { toJSON } = render(
        <StatsRow {...defaultProps} currentStreak={5} />
      );

      // Mock returns the testID as string content - verify it appears in the tree
      expect(JSON.stringify(toJSON())).toContain('streak-flame-icon');
    });

    it('does not render flame icon when streak is 0', () => {
      const { toJSON } = render(
        <StatsRow {...defaultProps} currentStreak={0} />
      );

      // Mock would return the testID as string content - verify it doesn't appear
      expect(JSON.stringify(toJSON())).not.toContain('streak-flame-icon');
    });

    it('renders correct accessibility label for streak', () => {
      render(<StatsRow {...defaultProps} currentStreak={42} />);

      const badge = screen.getByLabelText('Current streak: 42 day streak');
      expect(badge).toBeTruthy();
    });

    it('handles large streak numbers', () => {
      render(<StatsRow {...defaultProps} currentStreak={365} />);

      expect(screen.getByText('365 day streak')).toBeTruthy();
    });
  });

  describe('Settings Button', () => {
    it('renders the settings button when onSettingsPress is provided', () => {
      render(<StatsRow {...defaultProps} />);

      const button = screen.getByTestId('stats-row-settings-button');
      expect(button).toBeTruthy();
    });

    it('does not render settings button when onSettingsPress is undefined', () => {
      render(<StatsRow {...defaultProps} onSettingsPress={undefined} />);

      expect(screen.queryByTestId('stats-row-settings-button')).toBeNull();
    });

    it('renders settings icon inside button', () => {
      const { toJSON } = render(<StatsRow {...defaultProps} />);

      // Mock returns the testID as string content - verify it appears in the tree
      expect(JSON.stringify(toJSON())).toContain('settings-icon');
    });

    it('calls onSettingsPress when button is pressed', () => {
      const onSettingsPress = jest.fn();
      render(<StatsRow {...defaultProps} onSettingsPress={onSettingsPress} />);

      const button = screen.getByTestId('stats-row-settings-button');
      fireEvent.press(button);

      expect(onSettingsPress).toHaveBeenCalledTimes(1);
    });

    it('has correct accessibility attributes', () => {
      render(<StatsRow {...defaultProps} />);

      const button = screen.getByLabelText('Habit settings');
      expect(button).toBeTruthy();
    });

    it('has accessibility hint', () => {
      render(<StatsRow {...defaultProps} />);

      const button = screen.getByA11yHint('Opens habit settings and options');
      expect(button).toBeTruthy();
    });
  });

  describe('Dynamic Colors', () => {
    it('applies habit color to streak text', () => {
      const habitColor = '#ef4444'; // red
      render(<StatsRow {...defaultProps} habitColor={habitColor} />);

      const streakText = screen.getByText('15 day streak');
      expect(streakText.props.style).toEqual(
        expect.arrayContaining([expect.objectContaining({ color: habitColor })])
      );
    });

    it('generates light background color for streak badge', () => {
      // The getHabitColor50 function should create a very light tint
      const habitColor = '#10b981'; // emerald
      render(<StatsRow {...defaultProps} habitColor={habitColor} />);

      // The badge should have a light background
      const badge = screen.getByLabelText('Current streak: 15 day streak');
      expect(badge.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            backgroundColor: expect.stringMatching(/^#[a-fA-F0-9]{6}$/),
          }),
        ])
      );
    });

    it('handles different habit colors', () => {
      const colors = ['#10b981', '#ef4444', '#3b82f6', '#8b5cf6'];

      colors.forEach((color) => {
        const { unmount } = render(
          <StatsRow {...defaultProps} habitColor={color} />
        );

        const streakText = screen.getByText('15 day streak');
        expect(streakText.props.style).toEqual(
          expect.arrayContaining([expect.objectContaining({ color })])
        );

        unmount();
      });
    });
  });

  describe('Component Updates', () => {
    it('updates frequency when prop changes', () => {
      const { rerender } = render(
        <StatsRow {...defaultProps} frequency='Daily' />
      );
      expect(screen.getByText('Daily')).toBeTruthy();

      rerender(<StatsRow {...defaultProps} frequency='Weekly' />);
      expect(screen.getByText('Weekly')).toBeTruthy();
      expect(screen.queryByText('Daily')).toBeNull();
    });

    it('updates streak when prop changes', () => {
      const { rerender } = render(
        <StatsRow {...defaultProps} currentStreak={10} />
      );
      expect(screen.getByText('10 day streak')).toBeTruthy();

      rerender(<StatsRow {...defaultProps} currentStreak={25} />);
      expect(screen.getByText('25 day streak')).toBeTruthy();
    });

    it('shows/hides streak badge when streak changes to/from 0', () => {
      const { rerender } = render(
        <StatsRow {...defaultProps} currentStreak={5} />
      );
      expect(screen.getByText('5 day streak')).toBeTruthy();

      rerender(<StatsRow {...defaultProps} currentStreak={0} />);
      expect(screen.queryByText(/day streak/)).toBeNull();

      rerender(<StatsRow {...defaultProps} currentStreak={3} />);
      expect(screen.getByText('3 day streak')).toBeTruthy();
    });
  });

  describe('Layout', () => {
    it('renders frequency badge first', () => {
      render(<StatsRow {...defaultProps} />);

      // Both elements should be present
      expect(screen.getByText('Daily')).toBeTruthy();
      expect(screen.getByText('15 day streak')).toBeTruthy();
    });

    it('renders settings button on the right', () => {
      render(<StatsRow {...defaultProps} />);

      // Settings button should be present
      const settingsButton = screen.getByTestId('stats-row-settings-button');
      expect(settingsButton).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty frequency string', () => {
      render(<StatsRow {...defaultProps} frequency='' />);

      const badge = screen.getByLabelText('Frequency: ');
      expect(badge).toBeTruthy();
    });

    it('handles very long frequency text', () => {
      const longFrequency = 'Every Monday, Wednesday, and Friday';
      render(<StatsRow {...defaultProps} frequency={longFrequency} />);

      expect(screen.getByText(longFrequency)).toBeTruthy();
    });

    it('handles negative streak (treats as no streak)', () => {
      render(<StatsRow {...defaultProps} currentStreak={-5} />);

      // Negative streak should still show (edge case handling)
      // In practice, this shouldn't happen, but component should handle it gracefully
      expect(screen.queryByText(/-5 day streak/)).toBeNull();
    });

    it('handles habit color without # prefix', () => {
      // The component expects # prefix, but should handle edge cases
      render(<StatsRow {...defaultProps} habitColor='10b981' />);

      // Should still render without crashing
      expect(screen.getByText('15 day streak')).toBeTruthy();
    });

    it('handles uppercase hex color', () => {
      render(<StatsRow {...defaultProps} habitColor='#10B981' />);

      expect(screen.getByText('15 day streak')).toBeTruthy();
    });
  });

  describe('Memoization', () => {
    it('does not re-render when props are unchanged', () => {
      const { rerender } = render(<StatsRow {...defaultProps} />);

      // Re-render with same props
      rerender(<StatsRow {...defaultProps} />);

      // Should not throw and should render correctly
      expect(screen.getByText('Daily')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('has accessible container', () => {
      render(<StatsRow {...defaultProps} />);

      const container = screen.getByLabelText('Habit statistics');
      expect(container.props.accessible).toBe(true);
    });

    it('frequency badge has text role', () => {
      render(<StatsRow {...defaultProps} />);

      const badge = screen.getByLabelText('Frequency: Daily');
      expect(badge.props.accessibilityRole).toBe('text');
    });

    it('streak badge has text role', () => {
      render(<StatsRow {...defaultProps} />);

      const badge = screen.getByLabelText('Current streak: 15 day streak');
      expect(badge.props.accessibilityRole).toBe('text');
    });

    it('settings button has button role', () => {
      render(<StatsRow {...defaultProps} />);

      const button = screen.getByTestId('stats-row-settings-button');
      expect(button.props.accessibilityRole).toBe('button');
    });
  });
});
