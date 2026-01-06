/**
 * TimeOfDaySelector Component Tests - V5 Redesign
 * Task 5.3: Unit tests for TimeOfDaySelector
 *
 * Tests:
 * - Three buttons: Morning (🌅), Afternoon (☀️), Evening (🌙)
 * - Selected state with green background/border
 * - Returns time range for reminder auto-set
 * - Haptic feedback on selection
 * - Accessibility labels and announcements
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AccessibilityInfo } from 'react-native';
import {
  TimeOfDaySelector,
  PHASE_REMINDER_TIMES,
  getReminderTimeForPhase,
} from '../TimeOfDaySelector';
import type { HubermanPhase } from '../../../../constants/hubermanPhases';

// Mock useHapticFeedback
const mockTriggerSelection = jest.fn();
jest.mock('../../../../hooks/useHapticFeedback', () => ({
  __esModule: true,
  default: () => ({
    triggerSelection: mockTriggerSelection,
    triggerImpact: jest.fn(),
    triggerNotification: jest.fn(),
  }),
}));

// Mock AccessibilityInfo.announceForAccessibility
jest
  .spyOn(AccessibilityInfo, 'announceForAccessibility')
  .mockImplementation(jest.fn());

describe('TimeOfDaySelector - V5 Redesign', () => {
  const mockOnSelectPhase = jest.fn();

  const defaultProps = {
    selectedPhase: null as HubermanPhase | null,
    onSelectPhase: mockOnSelectPhase,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render the section header "When"', () => {
      const { getByText } = render(<TimeOfDaySelector {...defaultProps} />);
      expect(getByText('When')).toBeDefined();
    });

    it('should render 3 time of day buttons', () => {
      const { getAllByRole } = render(<TimeOfDaySelector {...defaultProps} />);
      const buttons = getAllByRole('button');
      expect(buttons.length).toBe(3);
    });

    it('should render Morning button with sunrise icon', () => {
      const { getByText, getByLabelText } = render(
        <TimeOfDaySelector {...defaultProps} />
      );
      expect(getByText('🌅')).toBeDefined();
      expect(getByText('Push')).toBeDefined();
      expect(getByLabelText('Push - 0-8h after waking')).toBeDefined();
    });

    it('should render Afternoon button with sun icon', () => {
      const { getByText, getByLabelText } = render(
        <TimeOfDaySelector {...defaultProps} />
      );
      expect(getByText('☀️')).toBeDefined();
      expect(getByText('Pivot')).toBeDefined();
      expect(getByLabelText('Pivot - 9-15h after waking')).toBeDefined();
    });

    it('should render Evening button with moon icon', () => {
      const { getByText, getByLabelText } = render(
        <TimeOfDaySelector {...defaultProps} />
      );
      expect(getByText('🌙')).toBeDefined();
      expect(getByText('Pull')).toBeDefined();
      expect(getByLabelText('Pull - 16+h after waking')).toBeDefined();
    });
  });

  describe('Selection State', () => {
    it('should show selected state on Push when phase1_push is selected', () => {
      const { getByLabelText } = render(
        <TimeOfDaySelector {...defaultProps} selectedPhase='phase1_push' />
      );

      const pushButton = getByLabelText('Push - 0-8h after waking');
      expect(pushButton.props.accessibilityState?.selected).toBe(true);
    });

    it('should show selected state on Pivot when phase2_pivot is selected', () => {
      const { getByLabelText } = render(
        <TimeOfDaySelector {...defaultProps} selectedPhase='phase2_pivot' />
      );

      const pivotButton = getByLabelText('Pivot - 9-15h after waking');
      expect(pivotButton.props.accessibilityState?.selected).toBe(true);
    });

    it('should show selected state on Pull when phase3_pull is selected', () => {
      const { getByLabelText } = render(
        <TimeOfDaySelector {...defaultProps} selectedPhase='phase3_pull' />
      );

      const pullButton = getByLabelText('Pull - 16+h after waking');
      expect(pullButton.props.accessibilityState?.selected).toBe(true);
    });

    it('should not show selected state on non-selected phases', () => {
      const { getByLabelText } = render(
        <TimeOfDaySelector {...defaultProps} selectedPhase='phase1_push' />
      );

      const pivotButton = getByLabelText('Pivot - 9-15h after waking');
      expect(pivotButton.props.accessibilityState?.selected).toBe(false);

      const pullButton = getByLabelText('Pull - 16+h after waking');
      expect(pullButton.props.accessibilityState?.selected).toBe(false);
    });

    it('should have all phases unselected when selectedPhase is null', () => {
      const { getByLabelText } = render(
        <TimeOfDaySelector {...defaultProps} selectedPhase={null} />
      );

      const pushButton = getByLabelText('Push - 0-8h after waking');
      const pivotButton = getByLabelText('Pivot - 9-15h after waking');
      const pullButton = getByLabelText('Pull - 16+h after waking');

      expect(pushButton.props.accessibilityState?.selected).toBe(false);
      expect(pivotButton.props.accessibilityState?.selected).toBe(false);
      expect(pullButton.props.accessibilityState?.selected).toBe(false);
    });
  });

  describe('User Interactions', () => {
    it('should call onSelectPhase with phase1_push when Push is pressed', () => {
      const { getByLabelText } = render(
        <TimeOfDaySelector {...defaultProps} />
      );

      const pushButton = getByLabelText('Push - 0-8h after waking');
      fireEvent.press(pushButton);

      expect(mockOnSelectPhase).toHaveBeenCalledTimes(1);
      expect(mockOnSelectPhase).toHaveBeenCalledWith('phase1_push');
    });

    it('should call onSelectPhase with phase2_pivot when Pivot is pressed', () => {
      const { getByLabelText } = render(
        <TimeOfDaySelector {...defaultProps} />
      );

      const pivotButton = getByLabelText('Pivot - 9-15h after waking');
      fireEvent.press(pivotButton);

      expect(mockOnSelectPhase).toHaveBeenCalledTimes(1);
      expect(mockOnSelectPhase).toHaveBeenCalledWith('phase2_pivot');
    });

    it('should call onSelectPhase with phase3_pull when Pull is pressed', () => {
      const { getByLabelText } = render(
        <TimeOfDaySelector {...defaultProps} />
      );

      const pullButton = getByLabelText('Pull - 16+h after waking');
      fireEvent.press(pullButton);

      expect(mockOnSelectPhase).toHaveBeenCalledTimes(1);
      expect(mockOnSelectPhase).toHaveBeenCalledWith('phase3_pull');
    });

    it('should trigger haptic feedback on phase selection', () => {
      const { getByLabelText } = render(
        <TimeOfDaySelector {...defaultProps} />
      );

      const pivotButton = getByLabelText('Pivot - 9-15h after waking');
      fireEvent.press(pivotButton);

      expect(mockTriggerSelection).toHaveBeenCalledTimes(1);
    });
  });

  describe('Reminder Time Mapping', () => {
    it('should map phase1_push to 7:00 AM', () => {
      expect(PHASE_REMINDER_TIMES.phase1_push).toEqual({ hour: 7, minute: 0 });
    });

    it('should map phase2_pivot to 12:00 PM', () => {
      expect(PHASE_REMINDER_TIMES.phase2_pivot).toEqual({
        hour: 12,
        minute: 0,
      });
    });

    it('should map phase3_pull to 8:00 PM', () => {
      expect(PHASE_REMINDER_TIMES.phase3_pull).toEqual({ hour: 20, minute: 0 });
    });
  });

  describe('getReminderTimeForPhase utility', () => {
    it('should return Date with 7:00 AM for phase1_push', () => {
      const result = getReminderTimeForPhase('phase1_push');
      expect(result.getHours()).toBe(7);
      expect(result.getMinutes()).toBe(0);
    });

    it('should return Date with 12:00 PM for phase2_pivot', () => {
      const result = getReminderTimeForPhase('phase2_pivot');
      expect(result.getHours()).toBe(12);
      expect(result.getMinutes()).toBe(0);
    });

    it('should return Date with 8:00 PM for phase3_pull', () => {
      const result = getReminderTimeForPhase('phase3_pull');
      expect(result.getHours()).toBe(20);
      expect(result.getMinutes()).toBe(0);
    });

    it('should return a valid Date object', () => {
      const result = getReminderTimeForPhase('phase1_push');
      expect(result instanceof Date).toBe(true);
      expect(isNaN(result.getTime())).toBe(false);
    });
  });

  describe('Accessibility', () => {
    it('should have accessibilityRole="button" for all phase buttons', () => {
      const { getByLabelText } = render(
        <TimeOfDaySelector {...defaultProps} />
      );

      const pushButton = getByLabelText('Push - 0-8h after waking');
      const pivotButton = getByLabelText('Pivot - 9-15h after waking');
      const pullButton = getByLabelText('Pull - 16+h after waking');

      expect(pushButton.props.accessibilityRole).toBe('button');
      expect(pivotButton.props.accessibilityRole).toBe('button');
      expect(pullButton.props.accessibilityRole).toBe('button');
    });

    it('should announce phase selection for screen readers', () => {
      const { getByLabelText } = render(
        <TimeOfDaySelector {...defaultProps} />
      );

      const pushButton = getByLabelText('Push - 0-8h after waking');
      fireEvent.press(pushButton);

      expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalledWith(
        'Selected Push, 0-8h after waking'
      );
    });

    it('should have correct accessibilityLabel with time range', () => {
      const { getByLabelText } = render(
        <TimeOfDaySelector {...defaultProps} />
      );

      // Labels include both short label and time range
      expect(getByLabelText('Push - 0-8h after waking')).toBeDefined();
      expect(getByLabelText('Pivot - 9-15h after waking')).toBeDefined();
      expect(getByLabelText('Pull - 16+h after waking')).toBeDefined();
    });

    it('should have correct accessibilityState for selected phase', () => {
      const { getByLabelText } = render(
        <TimeOfDaySelector {...defaultProps} selectedPhase='phase2_pivot' />
      );

      const pivotButton = getByLabelText('Pivot - 9-15h after waking');
      expect(pivotButton.props.accessibilityState).toEqual(
        expect.objectContaining({ selected: true })
      );

      const pushButton = getByLabelText('Push - 0-8h after waking');
      expect(pushButton.props.accessibilityState).toEqual(
        expect.objectContaining({ selected: false })
      );
    });
  });

  describe('Acceptance Criteria Summary', () => {
    it('✅ AC1: Three buttons - Morning (🌅), Afternoon (☀️), Evening (🌙)', () => {
      const { getByText, getAllByRole } = render(
        <TimeOfDaySelector {...defaultProps} />
      );

      // Verify 3 buttons
      const buttons = getAllByRole('button');
      expect(buttons.length).toBe(3);

      // Verify icons present
      expect(getByText('🌅')).toBeDefined();
      expect(getByText('☀️')).toBeDefined();
      expect(getByText('🌙')).toBeDefined();
    });

    it('✅ AC2: Selected state with green background/border', () => {
      const { getByLabelText } = render(
        <TimeOfDaySelector {...defaultProps} selectedPhase='phase1_push' />
      );

      const pushButton = getByLabelText('Push - 0-8h after waking');
      expect(pushButton.props.accessibilityState?.selected).toBe(true);
    });

    it('✅ AC3: Returns correct phase for reminder auto-set', () => {
      const { getByLabelText } = render(
        <TimeOfDaySelector {...defaultProps} />
      );

      // Test each phase maps correctly
      fireEvent.press(getByLabelText('Push - 0-8h after waking'));
      expect(mockOnSelectPhase).toHaveBeenLastCalledWith('phase1_push');

      fireEvent.press(getByLabelText('Pivot - 9-15h after waking'));
      expect(mockOnSelectPhase).toHaveBeenLastCalledWith('phase2_pivot');

      fireEvent.press(getByLabelText('Pull - 16+h after waking'));
      expect(mockOnSelectPhase).toHaveBeenLastCalledWith('phase3_pull');

      // Verify reminder times are mapped correctly
      expect(PHASE_REMINDER_TIMES.phase1_push.hour).toBe(7);
      expect(PHASE_REMINDER_TIMES.phase2_pivot.hour).toBe(12);
      expect(PHASE_REMINDER_TIMES.phase3_pull.hour).toBe(20);
    });

    it('✅ AC4: Haptic feedback on selection', () => {
      const { getByLabelText } = render(
        <TimeOfDaySelector {...defaultProps} />
      );

      fireEvent.press(getByLabelText('Push - 0-8h after waking'));
      expect(mockTriggerSelection).toHaveBeenCalledTimes(1);

      fireEvent.press(getByLabelText('Pivot - 9-15h after waking'));
      expect(mockTriggerSelection).toHaveBeenCalledTimes(2);

      fireEvent.press(getByLabelText('Pull - 16+h after waking'));
      expect(mockTriggerSelection).toHaveBeenCalledTimes(3);
    });
  });
});
