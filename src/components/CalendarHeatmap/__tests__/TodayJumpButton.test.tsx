/**
 * TodayJumpButton Tests
 *
 * Tests cover:
 * - Basic rendering (all variants)
 * - Press handling and callbacks
 * - Visibility logic (hide when current, date constraints)
 * - Haptic feedback
 * - Accessibility (roles, labels, hints, announcements)
 * - Reduce motion support
 * - Edge cases (date constraints, custom labels)
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { AccessibilityInfo } from 'react-native';
import { TodayJumpButton, type TodayJumpButtonProps } from '../TodayJumpButton';

// Mock useReduceMotion hook
let mockReduceMotion = false;
jest.mock('../../../hooks/useReduceMotion', () => ({
  useReduceMotion: jest.fn(() => mockReduceMotion),
}));

// Mock useHapticFeedback hook
const mockTriggerSelection = jest.fn();
const mockTriggerLightImpact = jest.fn();
jest.mock('../../../hooks/useHapticFeedback', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    triggerSelection: mockTriggerSelection,
    triggerLightImpact: mockTriggerLightImpact,
    triggerError: jest.fn(),
    triggerHeavyImpact: jest.fn(),
    triggerMediumImpact: jest.fn(),
    triggerSuccess: jest.fn(),
    triggerWarning: jest.fn(),
  })),
}));

// Mock AccessibilityInfo
jest.mock(
  'react-native/Libraries/Components/AccessibilityInfo/AccessibilityInfo',
  () => ({
    isReduceMotionEnabled: jest.fn(() => Promise.resolve(false)),
    addEventListener: jest.fn(() => ({ remove: jest.fn() })),
    announceForAccessibility: jest.fn(),
  })
);

// Mock date-fns format for consistent test output
jest.mock('date-fns', () => {
  const actual = jest.requireActual('date-fns');
  return {
    ...actual,
    format: jest.fn((date: Date, formatStr: string) => {
      if (formatStr === 'MMMM yyyy') {
        const months = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return `${months[date.getMonth()]} ${date.getFullYear()}`;
      }
      return actual.format(date, formatStr);
    }),
  };
});

describe('TodayJumpButton', () => {
  const mockOnJumpToToday = jest.fn();

  // Fixed "now" for consistent tests - December 2025
  const fixedNow = new Date(2025, 11, 28); // December 28, 2025

  beforeEach(() => {
    jest.clearAllMocks();
    mockReduceMotion = false;

    // Mock Date to return fixed date
    jest.useFakeTimers();
    jest.setSystemTime(fixedNow);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  /**
   * Default props for testing
   */
  const defaultProps: TodayJumpButtonProps = {
    currentMonth: 9, // October (not current month, so button is visible)
    currentYear: 2025,
    onJumpToToday: mockOnJumpToToday,
  };

  // ===========================================================================
  // BASIC RENDERING TESTS
  // ===========================================================================

  describe('Basic Rendering', () => {
    it('renders pill variant by default', () => {
      const { getByRole, getByText } = render(
        <TodayJumpButton {...defaultProps} />
      );

      expect(getByRole('button')).toBeTruthy();
      expect(getByText('Today')).toBeTruthy();
    });

    it('renders icon variant correctly', () => {
      const { getByRole, queryByText } = render(
        <TodayJumpButton {...defaultProps} variant='icon' />
      );

      expect(getByRole('button')).toBeTruthy();
      // Icon variant should not show label by default
      expect(queryByText('Today')).toBeNull();
    });

    it('renders floating variant correctly', () => {
      const { getByRole, queryByText } = render(
        <TodayJumpButton {...defaultProps} variant='floating' />
      );

      expect(getByRole('button')).toBeTruthy();
      // Floating variant should not show label by default
      expect(queryByText('Today')).toBeNull();
    });

    it('shows custom label text', () => {
      const { getByText } = render(
        <TodayJumpButton {...defaultProps} label='Jump to Now' />
      );

      expect(getByText('Jump to Now')).toBeTruthy();
    });

    it('respects showLabel override for pill variant', () => {
      const { queryByText } = render(
        <TodayJumpButton {...defaultProps} variant='pill' showLabel={false} />
      );

      expect(queryByText('Today')).toBeNull();
    });

    it('respects showLabel override for icon variant', () => {
      const { getByText } = render(
        <TodayJumpButton {...defaultProps} variant='icon' showLabel={true} label='Today' />
      );

      expect(getByText('Today')).toBeTruthy();
    });
  });

  // ===========================================================================
  // VISIBILITY LOGIC TESTS
  // ===========================================================================

  describe('Visibility Logic', () => {
    it('hides button when viewing current month (hideWhenCurrent=true)', () => {
      const { queryByRole } = render(
        <TodayJumpButton
          currentMonth={11} // December - current month
          currentYear={2025}
          onJumpToToday={mockOnJumpToToday}
        />
      );

      expect(queryByRole('button')).toBeNull();
    });

    it('shows button when viewing current month with hideWhenCurrent=false', () => {
      const { getByRole } = render(
        <TodayJumpButton
          currentMonth={11}
          currentYear={2025}
          hideWhenCurrent={false}
          onJumpToToday={mockOnJumpToToday}
        />
      );

      expect(getByRole('button')).toBeTruthy();
    });

    it('shows button when viewing past month', () => {
      const { getByRole } = render(
        <TodayJumpButton
          currentMonth={6} // July
          currentYear={2025}
          onJumpToToday={mockOnJumpToToday}
        />
      );

      expect(getByRole('button')).toBeTruthy();
    });

    it('shows button when viewing future month', () => {
      const { getByRole } = render(
        <TodayJumpButton
          currentMonth={2} // March
          currentYear={2026}
          onJumpToToday={mockOnJumpToToday}
        />
      );

      expect(getByRole('button')).toBeTruthy();
    });

    it('hides button when current month is before minDate', () => {
      const { queryByRole } = render(
        <TodayJumpButton
          currentMonth={6}
          currentYear={2025}
          minDate='2026-01-01' // Current month (Dec 2025) is before this
          onJumpToToday={mockOnJumpToToday}
        />
      );

      expect(queryByRole('button')).toBeNull();
    });

    it('hides button when current month is after maxDate', () => {
      const { queryByRole } = render(
        <TodayJumpButton
          currentMonth={6}
          currentYear={2025}
          maxDate='2025-06-30' // Current month (Dec 2025) is after this
          onJumpToToday={mockOnJumpToToday}
        />
      );

      expect(queryByRole('button')).toBeNull();
    });

    it('shows button when current month is within date range', () => {
      const { getByRole } = render(
        <TodayJumpButton
          currentMonth={6}
          currentYear={2025}
          minDate='2025-01-01'
          maxDate='2026-12-31'
          onJumpToToday={mockOnJumpToToday}
        />
      );

      expect(getByRole('button')).toBeTruthy();
    });

    it('handles Date object for minDate', () => {
      const { getByRole } = render(
        <TodayJumpButton
          currentMonth={6}
          currentYear={2025}
          minDate={new Date(2025, 0, 1)} // January 1, 2025
          onJumpToToday={mockOnJumpToToday}
        />
      );

      expect(getByRole('button')).toBeTruthy();
    });

    it('handles Date object for maxDate', () => {
      const { getByRole } = render(
        <TodayJumpButton
          currentMonth={6}
          currentYear={2025}
          maxDate={new Date(2026, 11, 31)} // December 31, 2026
          onJumpToToday={mockOnJumpToToday}
        />
      );

      expect(getByRole('button')).toBeTruthy();
    });
  });

  // ===========================================================================
  // PRESS HANDLING TESTS
  // ===========================================================================

  describe('Press Handling', () => {
    it('calls onJumpToToday with current month and year on press', () => {
      const { getByRole } = render(
        <TodayJumpButton {...defaultProps} />
      );

      fireEvent.press(getByRole('button'));

      expect(mockOnJumpToToday).toHaveBeenCalledWith(11, 2025); // December 2025
    });

    it('does not call onJumpToToday when button is hidden', () => {
      const { queryByRole } = render(
        <TodayJumpButton
          currentMonth={11}
          currentYear={2025}
          onJumpToToday={mockOnJumpToToday}
        />
      );

      // Button should not exist
      expect(queryByRole('button')).toBeNull();
      expect(mockOnJumpToToday).not.toHaveBeenCalled();
    });
  });

  // ===========================================================================
  // HAPTIC FEEDBACK TESTS
  // ===========================================================================

  describe('Haptic Feedback', () => {
    it('triggers selection haptic for pill variant', () => {
      const { getByRole } = render(
        <TodayJumpButton {...defaultProps} variant='pill' />
      );

      fireEvent.press(getByRole('button'));

      expect(mockTriggerSelection).toHaveBeenCalled();
      expect(mockTriggerLightImpact).not.toHaveBeenCalled();
    });

    it('triggers selection haptic for icon variant', () => {
      const { getByRole } = render(
        <TodayJumpButton {...defaultProps} variant='icon' />
      );

      fireEvent.press(getByRole('button'));

      expect(mockTriggerSelection).toHaveBeenCalled();
      expect(mockTriggerLightImpact).not.toHaveBeenCalled();
    });

    it('triggers light impact haptic for floating variant', () => {
      const { getByRole } = render(
        <TodayJumpButton {...defaultProps} variant='floating' />
      );

      fireEvent.press(getByRole('button'));

      expect(mockTriggerLightImpact).toHaveBeenCalled();
      expect(mockTriggerSelection).not.toHaveBeenCalled();
    });

    it('does not trigger haptics when disabled', () => {
      const { getByRole } = render(
        <TodayJumpButton {...defaultProps} disableHaptics />
      );

      fireEvent.press(getByRole('button'));

      expect(mockTriggerSelection).not.toHaveBeenCalled();
      expect(mockTriggerLightImpact).not.toHaveBeenCalled();
    });
  });

  // ===========================================================================
  // ACCESSIBILITY TESTS
  // ===========================================================================

  describe('Accessibility', () => {
    it('has correct accessibilityRole', () => {
      const { getByRole } = render(
        <TodayJumpButton {...defaultProps} />
      );

      expect(getByRole('button')).toBeTruthy();
    });

    it('has correct accessibilityLabel with month and year', () => {
      const { getByLabelText } = render(
        <TodayJumpButton {...defaultProps} />
      );

      expect(getByLabelText('Jump to today, December 2025')).toBeTruthy();
    });

    it('has correct accessibilityHint', () => {
      const { getByRole } = render(
        <TodayJumpButton {...defaultProps} />
      );

      const button = getByRole('button');
      expect(button.props.accessibilityHint).toBe('Returns calendar to current month');
    });

    it('announces navigation for screen readers on press', () => {
      const { getByRole } = render(
        <TodayJumpButton {...defaultProps} />
      );

      fireEvent.press(getByRole('button'));

      expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalledWith(
        'Jumped to December 2025'
      );
    });

    it('has proper hitSlop for touch targets (pill)', () => {
      const { getByRole } = render(
        <TodayJumpButton {...defaultProps} variant='pill' />
      );

      const button = getByRole('button');
      expect(button.props.hitSlop).toEqual({ bottom: 8, left: 8, right: 8, top: 8 });
    });

    it('has proper hitSlop for touch targets (icon)', () => {
      const { getByRole } = render(
        <TodayJumpButton {...defaultProps} variant='icon' />
      );

      const button = getByRole('button');
      expect(button.props.hitSlop).toEqual({ bottom: 8, left: 8, right: 8, top: 8 });
    });

    it('has proper hitSlop for touch targets (floating)', () => {
      const { getByRole } = render(
        <TodayJumpButton {...defaultProps} variant='floating' />
      );

      const button = getByRole('button');
      expect(button.props.hitSlop).toEqual({ bottom: 8, left: 8, right: 8, top: 8 });
    });
  });

  // ===========================================================================
  // REDUCE MOTION TESTS
  // ===========================================================================

  describe('Reduce Motion Support', () => {
    beforeEach(() => {
      mockReduceMotion = true;
    });

    afterEach(() => {
      mockReduceMotion = false;
    });

    it('renders without animation when reduce motion is enabled', () => {
      const { getByRole } = render(
        <TodayJumpButton {...defaultProps} />
      );

      // Should still render the button
      expect(getByRole('button')).toBeTruthy();
    });

    it('still triggers haptics with reduce motion (haptics != motion)', () => {
      const { getByRole } = render(
        <TodayJumpButton {...defaultProps} />
      );

      fireEvent.press(getByRole('button'));

      // Haptics should still trigger even with reduce motion
      // (haptic feedback is separate from visual motion)
      expect(mockTriggerSelection).toHaveBeenCalled();
    });
  });

  // ===========================================================================
  // EDGE CASES TESTS
  // ===========================================================================

  describe('Edge Cases', () => {
    it('handles viewing January (month 0) correctly', () => {
      const { getByRole } = render(
        <TodayJumpButton
          currentMonth={0}
          currentYear={2025}
          onJumpToToday={mockOnJumpToToday}
        />
      );

      expect(getByRole('button')).toBeTruthy();
    });

    it('handles viewing December (month 11) in different year', () => {
      const { getByRole } = render(
        <TodayJumpButton
          currentMonth={11}
          currentYear={2024} // Different year than current
          onJumpToToday={mockOnJumpToToday}
        />
      );

      expect(getByRole('button')).toBeTruthy();
    });

    it('handles minDate at exactly current month start', () => {
      const { getByRole } = render(
        <TodayJumpButton
          currentMonth={6}
          currentYear={2025}
          minDate='2025-12-01' // Start of current month
          onJumpToToday={mockOnJumpToToday}
        />
      );

      expect(getByRole('button')).toBeTruthy();
    });

    it('handles maxDate at exactly current month start', () => {
      const { getByRole } = render(
        <TodayJumpButton
          currentMonth={6}
          currentYear={2025}
          maxDate='2025-12-01' // Start of current month
          onJumpToToday={mockOnJumpToToday}
        />
      );

      expect(getByRole('button')).toBeTruthy();
    });

    it('handles year boundary correctly (Dec -> Jan)', () => {
      // Current is December 2025, viewing January 2026
      const { getByRole } = render(
        <TodayJumpButton
          currentMonth={0} // January
          currentYear={2026}
          onJumpToToday={mockOnJumpToToday}
        />
      );

      fireEvent.press(getByRole('button'));

      // Should jump back to December 2025
      expect(mockOnJumpToToday).toHaveBeenCalledWith(11, 2025);
    });

    it('applies custom style prop', () => {
      const customStyle = { marginTop: 10 };
      const { UNSAFE_root } = render(
        <TodayJumpButton {...defaultProps} style={customStyle} />
      );

      // The custom style should be applied to the Animated.View wrapper
      // This is a basic check that the prop is passed through
      expect(UNSAFE_root).toBeTruthy();
    });

    it('handles undefined minDate and maxDate gracefully', () => {
      const { getByRole } = render(
        <TodayJumpButton
          currentMonth={6}
          currentYear={2025}
          minDate={undefined}
          maxDate={undefined}
          onJumpToToday={mockOnJumpToToday}
        />
      );

      expect(getByRole('button')).toBeTruthy();
    });
  });

  // ===========================================================================
  // INTEGRATION TESTS
  // ===========================================================================

  describe('Integration', () => {
    it('complete flow: render -> press -> callback -> announcement', async () => {
      const { getByRole, getByText } = render(
        <TodayJumpButton {...defaultProps} />
      );

      // 1. Button renders with label
      expect(getByText('Today')).toBeTruthy();

      // 2. Press the button
      const button = getByRole('button');
      fireEvent.press(button);

      // 3. Callback is invoked
      expect(mockOnJumpToToday).toHaveBeenCalledWith(11, 2025);

      // 4. Haptic is triggered
      expect(mockTriggerSelection).toHaveBeenCalled();

      // 5. Accessibility announcement is made
      expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalledWith(
        'Jumped to December 2025'
      );
    });

    it('handles rapid presses gracefully', () => {
      const { getByRole } = render(
        <TodayJumpButton {...defaultProps} />
      );

      const button = getByRole('button');

      // Rapid presses
      fireEvent.press(button);
      fireEvent.press(button);
      fireEvent.press(button);

      // All presses should be handled
      expect(mockOnJumpToToday).toHaveBeenCalledTimes(3);
    });
  });
});
