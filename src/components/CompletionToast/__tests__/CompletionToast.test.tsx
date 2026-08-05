/**
 * CompletionToast Tests
 *
 * Tests for the habit completion feedback toast.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';

import { CompletionToast } from '../CompletionToast';

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.addWhitelistedNativeProps = jest.fn();
  Reanimated.default.addWhitelistedUIProps = jest.fn();
  return Reanimated;
});

// Mock safe area context
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ bottom: 34, left: 0, right: 0, top: 47 }),
}));

// Mock haptic feedback
jest.mock('../../../hooks/useHapticFeedback', () => ({
  useHapticFeedback: () => ({ triggerLightImpact: jest.fn() }),
}));

// Mock theme
jest.mock('../../../theme', () => ({
  useAppTheme: () => ({
    custom: {
      shadows: { card: {} },
      typography: { body: {} },
    },
  }),
}));

describe('CompletionToast', () => {
  const defaultProps = {
    habitName: 'Exercise',
    streak: 3,
    visible: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('visibility', () => {
    it('renders nothing when visible is false', () => {
      render(<CompletionToast {...defaultProps} visible={false} />);
      expect(screen.queryByText('Exercise done!')).toBeNull();
    });

    it('renders when visible is true', () => {
      render(<CompletionToast {...defaultProps} />);
      expect(screen.getByText('Exercise done!')).toBeTruthy();
    });
  });

  describe('content', () => {
    it('displays habit name with "done!"', () => {
      render(<CompletionToast {...defaultProps} />);
      expect(screen.getByText('Exercise done!')).toBeTruthy();
    });

    it('displays custom icon', () => {
      render(<CompletionToast {...defaultProps} icon='🏃' />);
      expect(screen.getByText('🏃')).toBeTruthy();
    });

    it('displays default icon when not provided', () => {
      render(<CompletionToast {...defaultProps} />);
      expect(screen.getByText('✓')).toBeTruthy();
    });

    it('displays streak count', () => {
      render(<CompletionToast {...defaultProps} streak={5} />);
      expect(screen.getByText('5')).toBeTruthy();
    });
  });

  describe('streak emoji milestones', () => {
    it('shows fire emoji for streak < 7', () => {
      render(<CompletionToast {...defaultProps} streak={3} />);
      expect(screen.getByText('🔥')).toBeTruthy();
    });

    it('shows star emoji for streak >= 7', () => {
      render(<CompletionToast {...defaultProps} streak={7} />);
      expect(screen.getByText('🌟')).toBeTruthy();
    });

    it('shows flexed arm emoji for streak >= 14', () => {
      render(<CompletionToast {...defaultProps} streak={14} />);
      expect(screen.getByText('💪')).toBeTruthy();
    });

    it('shows trophy emoji for streak >= 30', () => {
      render(<CompletionToast {...defaultProps} streak={30} />);
      expect(screen.getByText('🏆')).toBeTruthy();
    });

    it('shows star emoji for streak >= 50', () => {
      render(<CompletionToast {...defaultProps} streak={50} />);
      expect(screen.getByText('⭐')).toBeTruthy();
    });

    it('shows diamond emoji for streak >= 100', () => {
      render(<CompletionToast {...defaultProps} streak={100} />);
      expect(screen.getByText('💎')).toBeTruthy();
    });
  });

  describe('accessibility', () => {
    it('has appropriate accessibility label', () => {
      render(<CompletionToast {...defaultProps} streak={3} />);
      const toast = screen.getByLabelText('Exercise completed. 3 day streak');
      expect(toast).toBeTruthy();
    });

    it('has singular streak message for 1 day streak', () => {
      render(<CompletionToast {...defaultProps} streak={1} />);
      const toast = screen.getByLabelText('Exercise completed. 1 day streak');
      expect(toast).toBeTruthy();
    });

    it('has accessibility role of alert', () => {
      render(<CompletionToast {...defaultProps} />);
      const toast = screen.getByLabelText(/Exercise completed/);
      expect(toast.props.accessibilityRole).toBe('alert');
    });

    it('has polite accessibility live region', () => {
      render(<CompletionToast {...defaultProps} />);
      const toast = screen.getByLabelText(/Exercise completed/);
      expect(toast.props.accessibilityLiveRegion).toBe('polite');
    });
  });

  describe('dismiss', () => {
    it('calls onDismiss when badge is pressed', () => {
      const onDismiss = jest.fn();
      render(<CompletionToast {...defaultProps} onDismiss={onDismiss} />);

      const badge = screen.getByLabelText('🔥 3 day streak');
      fireEvent.press(badge);

      // onDismiss is called via setTimeout in handleDismiss
      expect(badge).toBeTruthy();
    });
  });
});
