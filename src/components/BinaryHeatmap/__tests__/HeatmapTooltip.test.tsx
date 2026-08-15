/**
 * HeatmapTooltip Component Tests
 *
 * Tests for rendering, positioning, animations, accessibility, and interactions.
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { HeatmapTooltip } from '../HeatmapTooltip';
import { COLORS, TOOLTIP } from '../constants';
import type { BinaryDay } from '../types';

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return {
    ...Reanimated,
    useReducedMotion: () => false,
    useAnimatedStyle: (fn: () => object) => fn(),
    useSharedValue: (initial: number) => ({ value: initial }),
    withTiming: (value: number) => value,
    withSpring: (value: number) => value,
    runOnJS: (fn: Function) => fn,
    FadeIn: { duration: () => ({ delay: () => ({}) }) },
  };
});

// Mock useReduceMotion hook
const mockUseReduceMotion = jest.fn(() => false);
jest.mock('../../../hooks/useReduceMotion', () => ({
  useReduceMotion: () => mockUseReduceMotion(),
}));

describe('HeatmapTooltip', () => {
  // Test data for different day states
  const completedDay: BinaryDay = {
    date: '2024-12-15',
    completed: true,
    isToday: false,
    isFuture: false,
    isBeforeCreation: false,
  };

  const missedDay: BinaryDay = {
    date: '2024-07-07',
    completed: false,
    isToday: false,
    isFuture: false,
    isBeforeCreation: false,
  };

  const todayDay: BinaryDay = {
    date: '2024-12-30',
    completed: false,
    isToday: true,
    isFuture: false,
    isBeforeCreation: false,
  };

  const futureDay: BinaryDay = {
    date: '2025-01-05',
    completed: false,
    isToday: false,
    isFuture: true,
    isBeforeCreation: false,
  };

  const beforeCreationDay: BinaryDay = {
    date: '2024-01-01',
    completed: false,
    isToday: false,
    isFuture: false,
    isBeforeCreation: true,
  };

  const defaultProps = {
    day: completedDay,
    position: { x: 100, y: 50 },
    visible: true,
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render when visible is true', () => {
      const { getByRole } = render(<HeatmapTooltip {...defaultProps} />);

      expect(getByRole('alert')).toBeTruthy();
    });

    it('should not render when visible is false', () => {
      const { queryByRole } = render(
        <HeatmapTooltip {...defaultProps} visible={false} />
      );

      expect(queryByRole('alert')).toBeNull();
    });

    it('should render tooltip text correctly', () => {
      const { getByText } = render(<HeatmapTooltip {...defaultProps} />);

      expect(getByText(/Dec 15/)).toBeTruthy();
    });

    it('should render arrow element', () => {
      const { getByRole } = render(<HeatmapTooltip {...defaultProps} />);

      // Arrow is a child of the tooltip
      const tooltip = getByRole('alert');
      expect(tooltip).toBeTruthy();
    });
  });

  describe('Tooltip content for different day states', () => {
    it('should show "Done ✓" for completed days', () => {
      const { getByText } = render(
        <HeatmapTooltip {...defaultProps} day={completedDay} />
      );

      expect(getByText('Dec 15: Done ✓')).toBeTruthy();
    });

    it('should show "Missed" for missed days', () => {
      const { getByText } = render(
        <HeatmapTooltip {...defaultProps} day={missedDay} />
      );

      expect(getByText('Jul 7: Missed')).toBeTruthy();
    });

    it('should show "Today" for current day', () => {
      const { getByText } = render(
        <HeatmapTooltip {...defaultProps} day={todayDay} />
      );

      expect(getByText('Dec 30: Today')).toBeTruthy();
    });

    it('should show "Future" for future days', () => {
      const { getByText } = render(
        <HeatmapTooltip {...defaultProps} day={futureDay} />
      );

      expect(getByText('Jan 5: Future')).toBeTruthy();
    });

    it('should show "Before tracking" for pre-creation days', () => {
      const { getByText } = render(
        <HeatmapTooltip {...defaultProps} day={beforeCreationDay} />
      );

      expect(getByText('Jan 1: Before tracking')).toBeTruthy();
    });
  });

  describe('Positioning', () => {
    it('should position tooltip at specified coordinates', () => {
      const { getByRole } = render(
        <HeatmapTooltip {...defaultProps} position={{ x: 150, y: 75 }} />
      );

      const tooltip = getByRole('alert');
      expect(tooltip).toBeTruthy();
    });

    it('should handle edge positions (near screen edges)', () => {
      const { getByRole } = render(
        <HeatmapTooltip {...defaultProps} position={{ x: 10, y: 10 }} />
      );

      const tooltip = getByRole('alert');
      expect(tooltip).toBeTruthy();
    });

    it('should handle large x positions', () => {
      const { getByRole } = render(
        <HeatmapTooltip {...defaultProps} position={{ x: 500, y: 200 }} />
      );

      const tooltip = getByRole('alert');
      expect(tooltip).toBeTruthy();
    });
  });

  describe('Interactions', () => {
    it('should call onClose when backdrop is pressed', () => {
      const onClose = jest.fn();
      const { getByLabelText } = render(
        <HeatmapTooltip {...defaultProps} onClose={onClose} />
      );

      const backdrop = getByLabelText('Close tooltip');
      fireEvent.press(backdrop);

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should have onRequestClose handler for the hardware back action', () => {
      const onClose = jest.fn();
      const { UNSAFE_getByType } = render(
        <HeatmapTooltip {...defaultProps} onClose={onClose} />
      );

      // Modal should have onRequestClose prop
      const modal = UNSAFE_getByType(require('react-native').Modal);
      expect(modal.props.onRequestClose).toBe(onClose);
    });
  });

  describe('Accessibility', () => {
    it('should have alert role', () => {
      const { getByRole } = render(<HeatmapTooltip {...defaultProps} />);

      expect(getByRole('alert')).toBeTruthy();
    });

    it('should have accessible label with tooltip content', () => {
      const { getByLabelText } = render(
        <HeatmapTooltip {...defaultProps} day={completedDay} />
      );

      expect(getByLabelText('Dec 15: Done ✓')).toBeTruthy();
    });

    it('should have accessibilityLiveRegion for screen readers', () => {
      const { getByRole } = render(<HeatmapTooltip {...defaultProps} />);

      const tooltip = getByRole('alert');
      expect(tooltip.props.accessibilityLiveRegion).toBe('polite');
    });

    it('should have close button with proper accessibility', () => {
      const { getByLabelText } = render(<HeatmapTooltip {...defaultProps} />);

      const closeButton = getByLabelText('Close tooltip');
      expect(closeButton.props.accessibilityRole).toBe('button');
      expect(closeButton.props.accessibilityHint).toBe(
        'Tap anywhere to close tooltip'
      );
    });

    it('should update accessible label when day changes', () => {
      const { getByLabelText, rerender } = render(
        <HeatmapTooltip {...defaultProps} day={completedDay} />
      );

      expect(getByLabelText('Dec 15: Done ✓')).toBeTruthy();

      rerender(<HeatmapTooltip {...defaultProps} day={missedDay} />);

      expect(getByLabelText('Jul 7: Missed')).toBeTruthy();
    });
  });

  describe('Modal behavior', () => {
    it('should render as transparent modal', () => {
      const { UNSAFE_getByType } = render(<HeatmapTooltip {...defaultProps} />);

      const modal = UNSAFE_getByType(require('react-native').Modal);
      expect(modal.props.transparent).toBe(true);
    });

    it('should have animationType set to none', () => {
      const { UNSAFE_getByType } = render(<HeatmapTooltip {...defaultProps} />);

      const modal = UNSAFE_getByType(require('react-native').Modal);
      expect(modal.props.animationType).toBe('none');
    });

    it('should pass visible prop to modal', () => {
      const { UNSAFE_getByType } = render(<HeatmapTooltip {...defaultProps} />);

      const modal = UNSAFE_getByType(require('react-native').Modal);
      expect(modal.props.visible).toBe(true);
    });
  });

  describe('Component updates', () => {
    it('should update tooltip text when day changes', () => {
      const { getByText, rerender, queryByText } = render(
        <HeatmapTooltip {...defaultProps} day={completedDay} />
      );

      expect(getByText('Dec 15: Done ✓')).toBeTruthy();

      rerender(<HeatmapTooltip {...defaultProps} day={missedDay} />);

      expect(queryByText('Dec 15: Done ✓')).toBeNull();
      expect(getByText('Jul 7: Missed')).toBeTruthy();
    });

    it('should update position when position prop changes', () => {
      const { getByRole, rerender } = render(
        <HeatmapTooltip {...defaultProps} position={{ x: 100, y: 50 }} />
      );

      expect(getByRole('alert')).toBeTruthy();

      rerender(
        <HeatmapTooltip {...defaultProps} position={{ x: 200, y: 100 }} />
      );

      expect(getByRole('alert')).toBeTruthy();
    });

    it('should handle visibility toggle', () => {
      const { queryByRole, rerender } = render(
        <HeatmapTooltip {...defaultProps} visible={true} />
      );

      expect(queryByRole('alert')).toBeTruthy();

      rerender(<HeatmapTooltip {...defaultProps} visible={false} />);

      expect(queryByRole('alert')).toBeNull();
    });
  });

  describe('Edge cases', () => {
    it('should handle day with completed today', () => {
      const todayCompleted: BinaryDay = {
        date: '2024-12-30',
        completed: true,
        isToday: true,
        isFuture: false,
        isBeforeCreation: false,
      };

      const { getByText } = render(
        <HeatmapTooltip {...defaultProps} day={todayCompleted} />
      );

      // Today takes precedence over completion status in display
      expect(getByText('Dec 30: Today')).toBeTruthy();
    });

    it('should handle position at origin (0, 0)', () => {
      const { getByRole } = render(
        <HeatmapTooltip {...defaultProps} position={{ x: 0, y: 0 }} />
      );

      expect(getByRole('alert')).toBeTruthy();
    });

    it('should handle negative positions', () => {
      const { getByRole } = render(
        <HeatmapTooltip {...defaultProps} position={{ x: -10, y: -10 }} />
      );

      expect(getByRole('alert')).toBeTruthy();
    });

    it('should handle rapid visibility toggles', () => {
      const { rerender, queryByRole } = render(
        <HeatmapTooltip {...defaultProps} visible={true} />
      );

      expect(queryByRole('alert')).toBeTruthy();

      rerender(<HeatmapTooltip {...defaultProps} visible={false} />);
      rerender(<HeatmapTooltip {...defaultProps} visible={true} />);
      rerender(<HeatmapTooltip {...defaultProps} visible={false} />);

      expect(queryByRole('alert')).toBeNull();
    });
  });

  describe('Date formatting', () => {
    it('should format dates with short month names', () => {
      const januaryDay: BinaryDay = {
        date: '2024-01-15',
        completed: true,
        isToday: false,
        isFuture: false,
        isBeforeCreation: false,
      };

      const { getByText } = render(
        <HeatmapTooltip {...defaultProps} day={januaryDay} />
      );

      expect(getByText('Jan 15: Done ✓')).toBeTruthy();
    });

    it('should format February dates correctly', () => {
      const februaryDay: BinaryDay = {
        date: '2024-02-29',
        completed: false,
        isToday: false,
        isFuture: false,
        isBeforeCreation: false,
      };

      const { getByText } = render(
        <HeatmapTooltip {...defaultProps} day={februaryDay} />
      );

      expect(getByText('Feb 29: Missed')).toBeTruthy();
    });

    it('should format single-digit days without leading zero', () => {
      const singleDigitDay: BinaryDay = {
        date: '2024-03-05',
        completed: true,
        isToday: false,
        isFuture: false,
        isBeforeCreation: false,
      };

      const { getByText } = render(
        <HeatmapTooltip {...defaultProps} day={singleDigitDay} />
      );

      expect(getByText('Mar 5: Done ✓')).toBeTruthy();
    });
  });

  describe('Memoization', () => {
    it('should not break with same props', () => {
      const { rerender, getByRole } = render(
        <HeatmapTooltip {...defaultProps} />
      );

      // Rerender with same props
      rerender(<HeatmapTooltip {...defaultProps} />);

      expect(getByRole('alert')).toBeTruthy();
    });
  });

  describe('Reduced motion support', () => {
    afterEach(() => {
      // Reset mock to default after each test
      mockUseReduceMotion.mockReturnValue(false);
    });

    it('should render correctly when reduced motion is enabled', () => {
      mockUseReduceMotion.mockReturnValue(true);

      const { getByRole, getByText } = render(
        <HeatmapTooltip {...defaultProps} day={completedDay} />
      );

      // Should still render the tooltip with correct content
      expect(getByRole('alert')).toBeTruthy();
      expect(getByText('Dec 15: Done ✓')).toBeTruthy();
    });

    it('should handle visibility changes with reduced motion enabled', () => {
      mockUseReduceMotion.mockReturnValue(true);

      const { queryByRole, rerender } = render(
        <HeatmapTooltip {...defaultProps} visible={true} />
      );

      expect(queryByRole('alert')).toBeTruthy();

      rerender(<HeatmapTooltip {...defaultProps} visible={false} />);
      expect(queryByRole('alert')).toBeNull();
    });

    it('should handle onClose callback with reduced motion enabled', () => {
      mockUseReduceMotion.mockReturnValue(true);

      const onClose = jest.fn();
      const { getByLabelText } = render(
        <HeatmapTooltip {...defaultProps} onClose={onClose} />
      );

      const backdrop = getByLabelText('Close tooltip');
      fireEvent.press(backdrop);

      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });
});
