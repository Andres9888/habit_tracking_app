/**
 * MonthPickerSheet Component Tests
 *
 * Tests for the month picker modal including:
 * - Rendering and visibility
 * - Month selection behavior
 * - Year navigation
 * - Date range constraints (minDate/maxDate)
 * - Jump to Today functionality
 * - Accessibility features
 * - Haptic feedback
 * - Animation behavior with reduce motion
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { AccessibilityInfo } from 'react-native';
import { MonthPickerSheet } from '../MonthPickerSheet';

// Mock haptics
const mockTriggerSelection = jest.fn();
const mockTriggerLightImpact = jest.fn();
jest.mock('../../../hooks/useHapticFeedback', () => ({
  __esModule: true,
  default: () => ({
    triggerSelection: mockTriggerSelection,
    triggerLightImpact: mockTriggerLightImpact,
  }),
}));

// Mock reduce motion hook
let mockReduceMotion = false;
jest.mock('../../../hooks/useReduceMotion', () => ({
  useReduceMotion: () => mockReduceMotion,
}));

// Mock AccessibilityInfo
jest.spyOn(AccessibilityInfo, 'announceForAccessibility');

// Mock reanimated for tests
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.FadeIn = {
    duration: () => ({
      springify: () => ({}),
    }),
  };
  Reanimated.FadeInDown = {
    delay: () => ({
      springify: () => ({}),
    }),
  };
  return Reanimated;
});

describe('MonthPickerSheet', () => {
  const mockOnSelectMonth = jest.fn();
  const mockOnClose = jest.fn();

  // Fixed date for consistent testing
  const now = new Date(2024, 6, 15); // July 15, 2024
  const RealDate = Date;

  const defaultProps = {
    visible: true,
    selectedMonth: 6, // July
    selectedYear: 2024,
    onSelectMonth: mockOnSelectMonth,
    onClose: mockOnClose,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockReduceMotion = false;

    // Mock Date to return consistent "now"
    global.Date = class extends RealDate {
      constructor(...args: any[]) {
        super();
        if (args.length === 0) {
          return now;
        }
        // @ts-ignore
        return new RealDate(...args);
      }
      static now() {
        return now.getTime();
      }
    } as any;
  });

  afterEach(() => {
    global.Date = RealDate;
  });

  describe('Rendering', () => {
    it('should render null when not visible', () => {
      const { queryByText } = render(
        <MonthPickerSheet {...defaultProps} visible={false} />
      );

      expect(queryByText('Select Month')).toBeNull();
    });

    it('should render modal when visible', () => {
      const { getByText } = render(<MonthPickerSheet {...defaultProps} />);

      expect(getByText('Select Month')).toBeTruthy();
    });

    it('should render all 12 months', () => {
      const { getAllByText } = render(<MonthPickerSheet {...defaultProps} />);

      // Check all short month names are rendered (might appear multiple times across years)
      const shortMonths = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];
      shortMonths.forEach((month) => {
        expect(getAllByText(month).length).toBeGreaterThanOrEqual(1);
      });
    });

    it('should render the selected year in header', () => {
      const { getAllByText } = render(<MonthPickerSheet {...defaultProps} />);

      // Year appears in header and as section header
      expect(getAllByText('2024').length).toBeGreaterThanOrEqual(1);
    });

    it('should render footer hint text', () => {
      const { getByText } = render(<MonthPickerSheet {...defaultProps} />);

      expect(
        getByText('Select a month to navigate your habit calendar')
      ).toBeTruthy();
    });

    it('should render close button', () => {
      const { getByLabelText } = render(<MonthPickerSheet {...defaultProps} />);

      expect(getByLabelText('Close month picker')).toBeTruthy();
    });

    it('should render year navigation arrows', () => {
      const { getByLabelText } = render(<MonthPickerSheet {...defaultProps} />);

      expect(getByLabelText(/Previous year/i)).toBeTruthy();
      expect(getByLabelText(/Next year/i)).toBeTruthy();
    });
  });

  describe('Month Selection', () => {
    it('should call onSelectMonth when a different month is selected', () => {
      const { getByLabelText } = render(<MonthPickerSheet {...defaultProps} />);

      // Select March 2024
      const marchOption = getByLabelText(/March 2024/i);
      fireEvent.press(marchOption);

      expect(mockOnSelectMonth).toHaveBeenCalledWith(2, 2024);
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should close without calling onSelectMonth when current month is tapped', () => {
      const { getByLabelText } = render(<MonthPickerSheet {...defaultProps} />);

      // Tap the already selected July 2024
      const julyOption = getByLabelText(/July 2024/i);
      fireEvent.press(julyOption);

      expect(mockOnSelectMonth).not.toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should announce month selection for accessibility', async () => {
      const { getByLabelText } = render(<MonthPickerSheet {...defaultProps} />);

      // Select October 2024
      const octoberOption = getByLabelText(/October 2024/i);
      fireEvent.press(octoberOption);

      await waitFor(() => {
        expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalledWith(
          'Selected October 2024'
        );
      });
    });

    it('should trigger haptic feedback on month selection', () => {
      const { getByLabelText } = render(<MonthPickerSheet {...defaultProps} />);

      const marchOption = getByLabelText(/March 2024/i);
      fireEvent.press(marchOption);

      expect(mockTriggerSelection).toHaveBeenCalled();
    });

    it('should not trigger haptic feedback when disableHaptics is true', () => {
      const { getByLabelText } = render(
        <MonthPickerSheet {...defaultProps} disableHaptics />
      );

      const marchOption = getByLabelText(/March 2024/i);
      fireEvent.press(marchOption);

      expect(mockTriggerSelection).not.toHaveBeenCalled();
    });
  });

  describe('Year Navigation', () => {
    it('should navigate to previous year when left arrow is pressed', () => {
      const { getByLabelText } = render(<MonthPickerSheet {...defaultProps} />);

      const prevButton = getByLabelText(/Previous year, 2023/i);
      fireEvent.press(prevButton);

      // Should select same month in previous year
      expect(mockOnSelectMonth).toHaveBeenCalledWith(6, 2023);
    });

    it('should navigate to next year when right arrow is pressed', () => {
      const { getByLabelText } = render(<MonthPickerSheet {...defaultProps} />);

      const nextButton = getByLabelText(/Next year, 2025/i);
      fireEvent.press(nextButton);

      // Should select same month in next year
      expect(mockOnSelectMonth).toHaveBeenCalledWith(6, 2025);
    });

    it('should trigger light haptic on year navigation', () => {
      const { getByLabelText } = render(<MonthPickerSheet {...defaultProps} />);

      const prevButton = getByLabelText(/Previous year/i);
      fireEvent.press(prevButton);

      expect(mockTriggerLightImpact).toHaveBeenCalled();
    });

    it('should announce year navigation for accessibility', async () => {
      const { getByLabelText } = render(<MonthPickerSheet {...defaultProps} />);

      const prevButton = getByLabelText(/Previous year/i);
      fireEvent.press(prevButton);

      await waitFor(() => {
        expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalledWith(
          'Navigated to July 2023'
        );
      });
    });
  });

  describe('Date Range Constraints', () => {
    it('should disable months before minDate', () => {
      const { getByLabelText } = render(
        <MonthPickerSheet
          {...defaultProps}
          minDate={new Date(2024, 3, 1)} // April 2024
        />
      );

      // March 2024 should be disabled
      const marchOption = getByLabelText(/March 2024/i);
      expect(marchOption.props.accessibilityState.disabled).toBe(true);

      // April 2024 should be enabled
      const aprilOption = getByLabelText(/April 2024/i);
      expect(aprilOption.props.accessibilityState.disabled).toBe(false);
    });

    it('should disable months after maxDate', () => {
      const { getByLabelText } = render(
        <MonthPickerSheet
          {...defaultProps}
          maxDate={new Date(2024, 8, 30)} // September 2024
        />
      );

      // September 2024 should be enabled
      const septOption = getByLabelText(/September 2024/i);
      expect(septOption.props.accessibilityState.disabled).toBe(false);

      // October 2024 should be disabled
      const octOption = getByLabelText(/October 2024/i);
      expect(octOption.props.accessibilityState.disabled).toBe(true);
    });

    it('should not call onSelectMonth when disabled month is pressed', () => {
      const { getByLabelText } = render(
        <MonthPickerSheet
          {...defaultProps}
          minDate={new Date(2024, 3, 1)} // April 2024
        />
      );

      const marchOption = getByLabelText(/March 2024/i);
      fireEvent.press(marchOption);

      expect(mockOnSelectMonth).not.toHaveBeenCalled();
    });

    it('should disable year navigation when no valid months in target year', () => {
      const { getByLabelText } = render(
        <MonthPickerSheet
          {...defaultProps}
          minDate={new Date(2024, 0, 1)} // Jan 2024
          maxDate={new Date(2024, 11, 31)} // Dec 2024
        />
      );

      const prevButton = getByLabelText(/Previous year/i);
      expect(prevButton.props.accessibilityState.disabled).toBe(true);

      const nextButton = getByLabelText(/Next year/i);
      expect(nextButton.props.accessibilityState.disabled).toBe(true);
    });

    it('should accept string dates for minDate/maxDate', () => {
      const { getByLabelText } = render(
        <MonthPickerSheet
          {...defaultProps}
          minDate='2024-04-01'
          maxDate='2024-09-30'
        />
      );

      // March should be disabled
      const marchOption = getByLabelText(/March 2024/i);
      expect(marchOption.props.accessibilityState.disabled).toBe(true);

      // October should be disabled
      const octOption = getByLabelText(/October 2024/i);
      expect(octOption.props.accessibilityState.disabled).toBe(true);
    });
  });

  describe('Jump to Today', () => {
    it('should render Jump to Today button when current month is not selected', () => {
      const { getByLabelText } = render(
        <MonthPickerSheet
          {...defaultProps}
          selectedMonth={5} // June (not July which is current)
          selectedYear={2024}
        />
      );

      expect(getByLabelText(/Jump to today/i)).toBeTruthy();
    });

    it('should not render Jump to Today button when current month is selected', () => {
      const { queryByLabelText } = render(
        <MonthPickerSheet
          {...defaultProps}
          selectedMonth={6} // July (current month)
          selectedYear={2024}
        />
      );

      expect(queryByLabelText(/Jump to today/i)).toBeNull();
    });

    it('should navigate to current month when Jump to Today is pressed', () => {
      const { getByLabelText } = render(
        <MonthPickerSheet
          {...defaultProps}
          selectedMonth={0} // January
          selectedYear={2023}
        />
      );

      const jumpButton = getByLabelText(/Jump to today/i);
      fireEvent.press(jumpButton);

      expect(mockOnSelectMonth).toHaveBeenCalledWith(6, 2024); // July 2024
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should announce jump to today for accessibility', async () => {
      const { getByLabelText } = render(
        <MonthPickerSheet
          {...defaultProps}
          selectedMonth={0}
          selectedYear={2023}
        />
      );

      const jumpButton = getByLabelText(/Jump to today/i);
      fireEvent.press(jumpButton);

      await waitFor(() => {
        expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalledWith(
          'Jumped to July 2024'
        );
      });
    });

    it('should not show Jump to Today when current month is outside date range', () => {
      const { queryByLabelText } = render(
        <MonthPickerSheet
          {...defaultProps}
          selectedMonth={0}
          selectedYear={2023}
          maxDate={new Date(2024, 5, 30)} // June 2024 (before current July)
        />
      );

      expect(queryByLabelText(/Jump to today/i)).toBeNull();
    });
  });

  describe('Close Behavior', () => {
    it('should call onClose when close button is pressed', () => {
      const { getByLabelText } = render(<MonthPickerSheet {...defaultProps} />);

      const closeButton = getByLabelText('Close month picker');
      fireEvent.press(closeButton);

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should close modal after month selection', () => {
      const { getByLabelText } = render(<MonthPickerSheet {...defaultProps} />);

      const marchOption = getByLabelText(/March 2024/i);
      fireEvent.press(marchOption);

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should trigger light haptic on close', () => {
      const { getByLabelText } = render(<MonthPickerSheet {...defaultProps} />);

      const closeButton = getByLabelText('Close month picker');
      fireEvent.press(closeButton);

      expect(mockTriggerLightImpact).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible modal', () => {
      const { getByLabelText } = render(<MonthPickerSheet {...defaultProps} />);

      expect(getByLabelText('Month picker')).toBeTruthy();
    });

    it('should have header with accessibility role', () => {
      const { getAllByRole } = render(<MonthPickerSheet {...defaultProps} />);

      // Multiple headers: "Select Month" and year section headers
      const headers = getAllByRole('header');
      expect(headers.length).toBeGreaterThanOrEqual(1);
    });

    it('should have button role for month options', () => {
      const { getAllByRole } = render(<MonthPickerSheet {...defaultProps} />);

      const buttons = getAllByRole('button');
      // 12 months + close button + year arrows (2) + jump to today (if shown)
      expect(buttons.length).toBeGreaterThanOrEqual(15);
    });

    it('should have correct accessibility labels for months', () => {
      const { getByLabelText } = render(<MonthPickerSheet {...defaultProps} />);

      const julyOption = getByLabelText(/July 2024, current month/i);
      expect(julyOption).toBeTruthy();
    });

    it('should have accessibility hint for unselected months', () => {
      const { getByLabelText } = render(<MonthPickerSheet {...defaultProps} />);

      const marchOption = getByLabelText(/March 2024/i);
      expect(marchOption.props.accessibilityHint).toContain(
        'Double tap to select'
      );
    });

    it('should have accessibility hint for selected month', () => {
      const { getByLabelText } = render(<MonthPickerSheet {...defaultProps} />);

      const julyOption = getByLabelText(/July 2024/i);
      expect(julyOption.props.accessibilityHint).toContain(
        'Currently selected'
      );
    });

    it('should have accessibility hint for disabled months', () => {
      const { getByLabelText } = render(
        <MonthPickerSheet
          {...defaultProps}
          minDate={new Date(2024, 6, 1)} // July 2024
        />
      );

      const juneOption = getByLabelText(/June 2024/i);
      expect(juneOption.props.accessibilityHint).toContain('Not available');
    });

    it('should have close button with accessibility hint', () => {
      const { getByLabelText } = render(<MonthPickerSheet {...defaultProps} />);

      const closeButton = getByLabelText('Close month picker');
      expect(closeButton.props.accessibilityHint).toBe(
        'Closes the month selection modal'
      );
    });

    it('should have accessibility hints for year navigation', () => {
      const { getByLabelText } = render(<MonthPickerSheet {...defaultProps} />);

      const prevButton = getByLabelText(/Previous year/i);
      expect(prevButton.props.accessibilityHint).toContain(
        'Navigate to previous year'
      );
    });
  });

  describe('Current Month Indicator', () => {
    it('should highlight the current month differently', () => {
      const { getByLabelText } = render(
        <MonthPickerSheet
          {...defaultProps}
          selectedMonth={0} // January (not current)
          selectedYear={2024}
        />
      );

      // July 2024 is current month and should have "current month" in label
      const julyOption = getByLabelText(/July 2024, current month/i);
      expect(julyOption).toBeTruthy();
    });

    it('should not mark non-current months as current', () => {
      const { getByLabelText } = render(<MonthPickerSheet {...defaultProps} />);

      // June should not have "current month" label
      const juneOption = getByLabelText(/^June 2024$/i);
      expect(juneOption).toBeTruthy();
    });
  });

  describe('Reduce Motion', () => {
    it('should respect reduce motion for animations', () => {
      mockReduceMotion = true;

      const { getByText } = render(<MonthPickerSheet {...defaultProps} />);

      // Component should still render without animations
      expect(getByText('Select Month')).toBeTruthy();
    });
  });

  describe('Selected Month State', () => {
    it('should show correct selected state for current selection', () => {
      const { getByLabelText } = render(
        <MonthPickerSheet
          {...defaultProps}
          selectedMonth={3}
          selectedYear={2024}
        />
      );

      const aprilOption = getByLabelText(/April 2024/i);
      expect(aprilOption.props.accessibilityState.selected).toBe(true);

      const mayOption = getByLabelText(/May 2024/i);
      expect(mayOption.props.accessibilityState.selected).toBe(false);
    });

    it('should update selection when props change', () => {
      const { rerender, getByLabelText } = render(
        <MonthPickerSheet
          {...defaultProps}
          selectedMonth={3}
          selectedYear={2024}
        />
      );

      let aprilOption = getByLabelText(/April 2024/i);
      expect(aprilOption.props.accessibilityState.selected).toBe(true);

      rerender(
        <MonthPickerSheet
          {...defaultProps}
          selectedMonth={5}
          selectedYear={2024}
        />
      );

      aprilOption = getByLabelText(/April 2024/i);
      expect(aprilOption.props.accessibilityState.selected).toBe(false);

      const juneOption = getByLabelText(/June 2024/i);
      expect(juneOption.props.accessibilityState.selected).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid month selection', () => {
      const { getByLabelText } = render(<MonthPickerSheet {...defaultProps} />);

      const marchOption = getByLabelText(/March 2024/i);
      const aprilOption = getByLabelText(/April 2024/i);

      fireEvent.press(marchOption);
      fireEvent.press(aprilOption);

      // First selection should have triggered callback
      expect(mockOnSelectMonth).toHaveBeenCalledWith(2, 2024);
    });

    it('should handle modal open/close transitions', () => {
      const { rerender, queryByText, getByText } = render(
        <MonthPickerSheet {...defaultProps} visible={false} />
      );

      expect(queryByText('Select Month')).toBeNull();

      rerender(<MonthPickerSheet {...defaultProps} visible={true} />);

      expect(getByText('Select Month')).toBeTruthy();

      rerender(<MonthPickerSheet {...defaultProps} visible={false} />);

      expect(queryByText('Select Month')).toBeNull();
    });

    it('should handle year with only some months available', () => {
      const { getByLabelText } = render(
        <MonthPickerSheet
          {...defaultProps}
          selectedMonth={6}
          selectedYear={2024}
          minDate={new Date(2024, 4, 1)} // May 2024
        />
      );

      // April should be disabled, May should be enabled
      const aprilOption = getByLabelText(/April 2024/i);
      expect(aprilOption.props.accessibilityState.disabled).toBe(true);

      const mayOption = getByLabelText(/May 2024/i);
      expect(mayOption.props.accessibilityState.disabled).toBe(false);
    });

    it('should handle December/January year boundary', () => {
      const { getByLabelText } = render(
        <MonthPickerSheet
          {...defaultProps}
          selectedMonth={11} // December
          selectedYear={2024}
        />
      );

      // Navigate to next year
      const nextButton = getByLabelText(/Next year/i);
      fireEvent.press(nextButton);

      // Should select December 2025
      expect(mockOnSelectMonth).toHaveBeenCalledWith(11, 2025);
    });

    it('should find first valid month when navigating to constrained year', () => {
      const { getByLabelText } = render(
        <MonthPickerSheet
          {...defaultProps}
          selectedMonth={0} // January
          selectedYear={2024}
          minDate={new Date(2023, 5, 1)} // June 2023
        />
      );

      // Navigate to previous year (2023)
      const prevButton = getByLabelText(/Previous year/i);
      fireEvent.press(prevButton);

      // Should select June 2023 (first available month)
      expect(mockOnSelectMonth).toHaveBeenCalledWith(5, 2023);
    });
  });

  describe('Multiple Years Display', () => {
    it('should display multiple years when date range spans years', () => {
      const { getAllByText } = render(
        <MonthPickerSheet
          {...defaultProps}
          selectedMonth={6}
          selectedYear={2024}
          minDate={new Date(2022, 0, 1)}
          maxDate={new Date(2025, 11, 31)}
        />
      );

      // Should show multiple years as section headers (may appear in nav header too)
      expect(getAllByText('2025').length).toBeGreaterThanOrEqual(1);
      expect(getAllByText('2024').length).toBeGreaterThanOrEqual(1);
      expect(getAllByText('2023').length).toBeGreaterThanOrEqual(1);
      expect(getAllByText('2022').length).toBeGreaterThanOrEqual(1);
    });

    it('should order years from most recent to oldest', () => {
      const { getAllByRole } = render(
        <MonthPickerSheet
          {...defaultProps}
          selectedMonth={6}
          selectedYear={2024}
          minDate={new Date(2022, 0, 1)}
          maxDate={new Date(2025, 11, 31)}
        />
      );

      const headers = getAllByRole('header');
      // First header is "Select Month", then years in descending order
      expect(headers[1].props.children).toBe(2025);
      expect(headers[2].props.children).toBe(2024);
    });
  });
});
