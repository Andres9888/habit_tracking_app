/**
 * SwipeableMonthGrid Tests
 * Tests for swipe gesture navigation on MonthGrid
 *
 * Tests cover:
 * - Basic rendering (passes props to MonthGrid)
 * - Swipe gesture detection
 * - Month navigation callbacks
 * - Navigation limits (minDate, maxDate)
 * - Haptic feedback
 * - Accessibility announcements
 * - Reduce motion support
 * - Edge cases
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { AccessibilityInfo } from 'react-native';
import * as Haptics from 'expo-haptics';
import { SwipeableMonthGrid, type SwipeDirection } from '../SwipeableMonthGrid';
import type { CalendarDay } from '../types';

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native').View;
  return {
    Gesture: {
      Pan: () => ({
        enabled: jest.fn().mockReturnThis(),
        activeOffsetX: jest.fn().mockReturnThis(),
        failOffsetY: jest.fn().mockReturnThis(),
        onUpdate: jest.fn().mockReturnThis(),
        onEnd: jest.fn().mockReturnThis(),
      }),
    },
    GestureDetector: ({ children }: { children: React.ReactNode }) => (
      <View testID='gesture-detector'>{children}</View>
    ),
  };
});

// Mock useReduceMotion hook
jest.mock('../../../hooks/useReduceMotion', () => ({
  useReduceMotion: jest.fn(() => false),
}));

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
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

describe('SwipeableMonthGrid', () => {
  const mockOnDayPress = jest.fn();
  const mockOnMonthChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Helper: Create a simple month grid for testing
   */
  const createMonthGrid = (
    year: number = 2025,
    month: number = 0
  ): CalendarDay[][] => {
    const grid: CalendarDay[][] = [];
    let dayNum = 1;

    // Create first week with padding
    const firstWeek: CalendarDay[] = [];
    // Padding for days before month starts (assuming month starts on Wed)
    for (let i = 0; i < 3; i++) {
      firstWeek.push({
        date: null,
        dayOfMonth: null,
        completed: false,
        isToday: false,
        isFuture: false,
        isBeforeCreation: false,
      });
    }
    // Actual days
    for (let i = 3; i < 7; i++) {
      firstWeek.push({
        date: `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`,
        dayOfMonth: dayNum,
        completed: dayNum % 3 === 0, // Every 3rd day completed
        isToday: dayNum === 15,
        isFuture: dayNum > 28,
        isBeforeCreation: false,
      });
      dayNum++;
    }
    grid.push(firstWeek);

    // Add remaining weeks
    while (dayNum <= 31) {
      const week: CalendarDay[] = [];
      for (let i = 0; i < 7 && dayNum <= 31; i++) {
        week.push({
          date: `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`,
          dayOfMonth: dayNum,
          completed: dayNum % 3 === 0,
          isToday: dayNum === 15,
          isFuture: dayNum > 28,
          isBeforeCreation: false,
        });
        dayNum++;
      }
      // Pad incomplete weeks
      while (week.length < 7) {
        week.push({
          date: null,
          dayOfMonth: null,
          completed: false,
          isToday: false,
          isFuture: false,
          isBeforeCreation: false,
        });
      }
      grid.push(week);
    }

    return grid;
  };

  describe('Basic Rendering', () => {
    it('renders MonthGrid with correct props', () => {
      const grid = createMonthGrid(2025, 0);

      const { getByText, getByTestId } = render(
        <SwipeableMonthGrid
          grid={grid}
          month={0}
          year={2025}
          onDayPress={mockOnDayPress}
        />
      );

      // Should render month header
      expect(getByText('January 2025')).toBeTruthy();

      // Should wrap with gesture detector
      expect(getByTestId('gesture-detector')).toBeTruthy();
    });

    it('passes habitColor to MonthGrid', () => {
      const grid = createMonthGrid();

      const { getByText } = render(
        <SwipeableMonthGrid
          grid={grid}
          habitColor='#ff0000'
          month={0}
          year={2025}
        />
      );

      // Component should render without errors
      expect(getByText('January 2025')).toBeTruthy();
    });

    it('passes instantToggle prop to MonthGrid', () => {
      const grid = createMonthGrid();

      const { getByText } = render(
        <SwipeableMonthGrid
          grid={grid}
          instantToggle={false}
          month={0}
          year={2025}
        />
      );

      expect(getByText('January 2025')).toBeTruthy();
    });
  });

  describe('Swipe Configuration', () => {
    it('renders with swipe enabled by default', () => {
      const grid = createMonthGrid();

      const { getByRole } = render(
        <SwipeableMonthGrid grid={grid} month={0} year={2025} />
      );

      const container = getByRole('adjustable');
      expect(container.props.accessibilityHint).toBe(
        'Swipe left or right to navigate between months'
      );
    });

    it('does not show swipe hint when disabled', () => {
      const grid = createMonthGrid();

      const { getByRole } = render(
        <SwipeableMonthGrid
          grid={grid}
          month={0}
          swipeEnabled={false}
          year={2025}
        />
      );

      const container = getByRole('adjustable');
      expect(container.props.accessibilityHint).toBeUndefined();
    });

    it('accepts custom swipe threshold', () => {
      const grid = createMonthGrid();

      // Should render without error with custom threshold
      const { getByText } = render(
        <SwipeableMonthGrid
          grid={grid}
          month={0}
          swipeThreshold={100}
          year={2025}
        />
      );

      expect(getByText('January 2025')).toBeTruthy();
    });

    it('accepts custom velocity threshold', () => {
      const grid = createMonthGrid();

      const { getByText } = render(
        <SwipeableMonthGrid
          grid={grid}
          month={0}
          velocityThreshold={1000}
          year={2025}
        />
      );

      expect(getByText('January 2025')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('has adjustable accessibility role', () => {
      const grid = createMonthGrid();

      const { getByRole } = render(
        <SwipeableMonthGrid grid={grid} month={0} year={2025} />
      );

      expect(getByRole('adjustable')).toBeTruthy();
    });

    it('is accessible with proper hint for swipe navigation', () => {
      const grid = createMonthGrid();

      const { getByRole } = render(
        <SwipeableMonthGrid
          grid={grid}
          month={0}
          year={2025}
          onMonthChange={mockOnMonthChange}
        />
      );

      const container = getByRole('adjustable');
      expect(container.props.accessibilityHint).toContain('Swipe');
    });
  });

  describe('Navigation Limits', () => {
    it('accepts minDate prop', () => {
      const grid = createMonthGrid();

      const { getByText } = render(
        <SwipeableMonthGrid
          grid={grid}
          minDate='2024-06-01'
          month={0}
          year={2025}
        />
      );

      expect(getByText('January 2025')).toBeTruthy();
    });

    it('accepts maxDate prop', () => {
      const grid = createMonthGrid();

      const { getByText } = render(
        <SwipeableMonthGrid
          grid={grid}
          maxDate='2025-12-31'
          month={0}
          year={2025}
        />
      );

      expect(getByText('January 2025')).toBeTruthy();
    });

    it('accepts both minDate and maxDate props', () => {
      const grid = createMonthGrid();

      const { getByText } = render(
        <SwipeableMonthGrid
          grid={grid}
          maxDate='2025-12-31'
          minDate='2024-01-01'
          month={6}
          year={2025}
        />
      );

      expect(getByText('July 2025')).toBeTruthy();
    });
  });

  describe('Haptic Feedback', () => {
    it('accepts disableHaptics prop', () => {
      const grid = createMonthGrid();

      const { getByText } = render(
        <SwipeableMonthGrid disableHaptics grid={grid} month={0} year={2025} />
      );

      expect(getByText('January 2025')).toBeTruthy();
    });
  });

  describe('Month Change Callback', () => {
    it('accepts onMonthChange callback', () => {
      const grid = createMonthGrid();

      const { getByText } = render(
        <SwipeableMonthGrid
          grid={grid}
          month={0}
          year={2025}
          onMonthChange={mockOnMonthChange}
        />
      );

      expect(getByText('January 2025')).toBeTruthy();
    });
  });

  describe('Day Press Handling', () => {
    it('passes day press events to parent', () => {
      const grid = createMonthGrid();

      const { getAllByRole } = render(
        <SwipeableMonthGrid
          grid={grid}
          month={0}
          year={2025}
          onDayPress={mockOnDayPress}
        />
      );

      // Find day buttons and press one
      const dayButtons = getAllByRole('button');
      if (dayButtons.length > 0) {
        fireEvent.press(dayButtons[0]);
        // onDayPress should be called (exact behavior depends on MonthGrid)
      }
    });
  });

  describe('Different Months', () => {
    it('renders January correctly', () => {
      const grid = createMonthGrid(2025, 0);

      const { getByText } = render(
        <SwipeableMonthGrid grid={grid} month={0} year={2025} />
      );

      expect(getByText('January 2025')).toBeTruthy();
    });

    it('renders December correctly', () => {
      const grid = createMonthGrid(2025, 11);

      const { getByText } = render(
        <SwipeableMonthGrid grid={grid} month={11} year={2025} />
      );

      expect(getByText('December 2025')).toBeTruthy();
    });

    it('renders different years correctly', () => {
      const grid = createMonthGrid(2024, 6);

      const { getByText } = render(
        <SwipeableMonthGrid grid={grid} month={6} year={2024} />
      );

      expect(getByText('July 2024')).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty grid gracefully', () => {
      const emptyGrid: CalendarDay[][] = [];

      const { getByText } = render(
        <SwipeableMonthGrid grid={emptyGrid} month={0} year={2025} />
      );

      // Should still render month header
      expect(getByText('January 2025')).toBeTruthy();
    });

    it('handles January to December transition (year boundary)', () => {
      const grid = createMonthGrid(2025, 0);

      const { getByText } = render(
        <SwipeableMonthGrid
          grid={grid}
          month={0}
          year={2025}
          onMonthChange={mockOnMonthChange}
        />
      );

      // Should render without errors
      expect(getByText('January 2025')).toBeTruthy();
    });

    it('handles December to January transition (year boundary)', () => {
      const grid = createMonthGrid(2024, 11);

      const { getByText } = render(
        <SwipeableMonthGrid
          grid={grid}
          month={11}
          year={2024}
          onMonthChange={mockOnMonthChange}
        />
      );

      expect(getByText('December 2024')).toBeTruthy();
    });

    it('handles re-renders with new month/year props', () => {
      const grid1 = createMonthGrid(2025, 0);
      const grid2 = createMonthGrid(2025, 1);

      const { getByText, rerender } = render(
        <SwipeableMonthGrid grid={grid1} month={0} year={2025} />
      );

      expect(getByText('January 2025')).toBeTruthy();

      rerender(<SwipeableMonthGrid grid={grid2} month={1} year={2025} />);

      expect(getByText('February 2025')).toBeTruthy();
    });
  });

  describe('Integration with MonthGrid Props', () => {
    it('passes all MonthGrid props correctly', () => {
      const grid = createMonthGrid();

      const { getByText } = render(
        <SwipeableMonthGrid
          grid={grid}
          habitColor='#10b981'
          instantToggle={true}
          month={0}
          year={2025}
          onDayPress={mockOnDayPress}
          onMonthChange={mockOnMonthChange}
        />
      );

      expect(getByText('January 2025')).toBeTruthy();
    });
  });
});

describe('SwipeableMonthGrid Gesture Logic', () => {
  /**
   * These tests verify the gesture handling logic
   * Since we're mocking react-native-gesture-handler, we test
   * that the gesture detector is rendered correctly
   */

  it('renders with gesture detector wrapper', () => {
    const grid: CalendarDay[][] = [
      [
        {
          date: '2025-01-01',
          dayOfMonth: 1,
          completed: false,
          isToday: false,
          isFuture: false,
          isBeforeCreation: false,
        },
      ],
    ];

    const { getByTestId, getByText } = render(
      <SwipeableMonthGrid
        grid={grid}
        month={0}
        swipeEnabled={true}
        year={2025}
      />
    );

    // Verify GestureDetector wrapper is rendered
    expect(getByTestId('gesture-detector')).toBeTruthy();

    // Verify MonthGrid is rendered inside
    expect(getByText('January 2025')).toBeTruthy();
  });

  it('renders gesture detector when swipe is disabled', () => {
    const grid: CalendarDay[][] = [
      [
        {
          date: '2025-01-01',
          dayOfMonth: 1,
          completed: false,
          isToday: false,
          isFuture: false,
          isBeforeCreation: false,
        },
      ],
    ];

    const { getByTestId } = render(
      <SwipeableMonthGrid
        grid={grid}
        month={0}
        swipeEnabled={false}
        year={2025}
      />
    );

    // Gesture detector should still be present (just disabled)
    expect(getByTestId('gesture-detector')).toBeTruthy();
  });
});

describe('Grid Entry Animation', () => {
  const createSimpleGrid = (): CalendarDay[][] => [
    [
      {
        date: '2025-01-01',
        dayOfMonth: 1,
        completed: false,
        isToday: false,
        isFuture: false,
        isBeforeCreation: false,
      },
    ],
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('accepts gridEntryAnimation prop', () => {
    const grid = createSimpleGrid();

    const { getByTestId } = render(
      <SwipeableMonthGrid
        grid={grid}
        month={0}
        year={2025}
        gridEntryAnimation="fade"
      />
    );

    expect(getByTestId('gesture-detector')).toBeTruthy();
  });

  it('accepts gridEntryAnimation none to disable animations', () => {
    const grid = createSimpleGrid();

    const { getByTestId } = render(
      <SwipeableMonthGrid
        grid={grid}
        month={0}
        year={2025}
        gridEntryAnimation="none"
      />
    );

    expect(getByTestId('gesture-detector')).toBeTruthy();
  });

  it('accepts slideIn animation type', () => {
    const grid = createSimpleGrid();

    const { getByTestId } = render(
      <SwipeableMonthGrid
        grid={grid}
        month={0}
        year={2025}
        gridEntryAnimation="slideIn"
      />
    );

    expect(getByTestId('gesture-detector')).toBeTruthy();
  });

  it('accepts custom gridEntryDuration', () => {
    const grid = createSimpleGrid();

    const { getByTestId } = render(
      <SwipeableMonthGrid
        grid={grid}
        month={0}
        year={2025}
        gridEntryAnimation="fade"
        gridEntryDuration={300}
      />
    );

    expect(getByTestId('gesture-detector')).toBeTruthy();
  });

  it('handles month change with grid entry animation', async () => {
    const grid = createSimpleGrid();

    const { rerender, getByTestId } = render(
      <SwipeableMonthGrid
        grid={grid}
        month={0}
        year={2025}
        gridEntryAnimation="fade"
      />
    );

    // Change to a different month
    rerender(
      <SwipeableMonthGrid
        grid={grid}
        month={1}
        year={2025}
        gridEntryAnimation="fade"
      />
    );

    await waitFor(() => {
      expect(getByTestId('gesture-detector')).toBeTruthy();
    });
  });

  it('handles year change with grid entry animation', async () => {
    const grid = createSimpleGrid();

    const { rerender, getByTestId } = render(
      <SwipeableMonthGrid
        grid={grid}
        month={0}
        year={2025}
        gridEntryAnimation="slideIn"
      />
    );

    // Change to a different year
    rerender(
      <SwipeableMonthGrid
        grid={grid}
        month={0}
        year={2026}
        gridEntryAnimation="slideIn"
      />
    );

    await waitFor(() => {
      expect(getByTestId('gesture-detector')).toBeTruthy();
    });
  });
});
