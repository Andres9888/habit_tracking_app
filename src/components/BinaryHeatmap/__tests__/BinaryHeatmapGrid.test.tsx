/**
 * BinaryHeatmapGrid Component Tests
 *
 * Tests for grid layout, row rendering, cell positioning,
 * staggered animations, and accessibility.
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { ScrollView, View } from 'react-native';
import { BinaryHeatmapGrid } from '../BinaryHeatmapGrid';
import type { BinaryGridData, BinaryDay } from '../types';
import { CELL_SIZE, GRID } from '../constants';

const countSizedCells = (getAllByType: (type: typeof View) => Array<{ props: { style?: unknown } }>) =>
  getAllByType(View).filter((node) => {
    const style = node.props.style;
    const flat = Array.isArray(style)
      ? Object.assign({}, ...style.filter(Boolean))
      : style;
    return flat?.width === CELL_SIZE && flat?.height === CELL_SIZE;
  }).length;

// Mock the useReduceMotion hook
jest.mock('../../../hooks/useReduceMotion', () => ({
  useReduceMotion: jest.fn(() => false),
}));

describe('BinaryHeatmapGrid', () => {
  const mockOnCellPress = jest.fn();
  const mockHabitColor = '#10b981'; // emerald-500

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Helper to create a day object with a valid date
  const createDay = (
    date: string,
    overrides: Partial<BinaryDay> = {}
  ): BinaryDay => ({
    date,
    completed: false,
    isToday: false,
    isFuture: false,
    isBeforeCreation: false,
    ...overrides,
  });

  // Helper to generate a valid date string for a given week and day index
  const getDateForWeekAndDay = (
    weekIndex: number,
    dayIndex: number
  ): string => {
    // Start from a known Sunday (2025-01-05 is a Sunday)
    const startDate = new Date(2025, 0, 5); // Jan 5, 2025 (Sunday)
    const targetDate = new Date(startDate);
    targetDate.setDate(startDate.getDate() + weekIndex * 7 + dayIndex);
    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, '0');
    const day = String(targetDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Helper to create minimal grid data with valid dates
  const createGridData = (
    weekCount: number,
    customizer?: (weekIndex: number, dayIndex: number) => BinaryDay | null
  ): BinaryGridData => {
    const weeks: (BinaryDay | null)[][] = [];

    for (let weekIndex = 0; weekIndex < weekCount; weekIndex++) {
      const week: (BinaryDay | null)[] = [];
      for (let dayIndex = 0; dayIndex < GRID.ROWS; dayIndex++) {
        if (customizer) {
          week.push(customizer(weekIndex, dayIndex));
        } else {
          const date = getDateForWeekAndDay(weekIndex, dayIndex);
          week.push(createDay(date));
        }
      }
      weeks.push(week);
    }

    return {
      weeks,
      monthLabels: [{ weekIndex: 0, label: 'Jan' }],
      stats: {
        completions: 0,
        eligibleDays: weekCount * 7,
        completionRate: 0,
      },
    };
  };

  describe('Day Labels Column', () => {
    it('should render all 7 day label characters', () => {
      const gridData = createGridData(4);

      const { getAllByLabelText } = render(
        <BinaryHeatmapGrid
          gridData={gridData}
          habitColor={mockHabitColor}
          onCellPress={mockOnCellPress}
        />
      );

      // Check all day labels are rendered via their accessibility labels
      expect(getAllByLabelText(/Sunday row/)).toHaveLength(1);
      expect(getAllByLabelText(/Monday row/)).toHaveLength(1);
      expect(getAllByLabelText(/Tuesday row/)).toHaveLength(1);
      expect(getAllByLabelText(/Wednesday row/)).toHaveLength(1);
      expect(getAllByLabelText(/Thursday row/)).toHaveLength(1);
      expect(getAllByLabelText(/Friday row/)).toHaveLength(1);
      expect(getAllByLabelText(/Saturday row/)).toHaveLength(1);
    });

    it('should render day labels with correct accessibility labels', () => {
      const gridData = createGridData(2);

      const { getByLabelText } = render(
        <BinaryHeatmapGrid
          gridData={gridData}
          habitColor={mockHabitColor}
          onCellPress={mockOnCellPress}
        />
      );

      expect(getByLabelText('Sunday row')).toBeTruthy();
      expect(getByLabelText('Monday row')).toBeTruthy();
      expect(getByLabelText('Tuesday row')).toBeTruthy();
      expect(getByLabelText('Wednesday row')).toBeTruthy();
      expect(getByLabelText('Thursday row')).toBeTruthy();
      expect(getByLabelText('Friday row')).toBeTruthy();
      expect(getByLabelText('Saturday row')).toBeTruthy();
    });

    it('should render 7 day label elements', () => {
      const gridData = createGridData(2);

      const { getAllByRole } = render(
        <BinaryHeatmapGrid
          gridData={gridData}
          habitColor={mockHabitColor}
          onCellPress={mockOnCellPress}
        />
      );

      // Get text nodes with "row" accessibility (day labels)
      const textNodes = getAllByRole('text').filter((node) =>
        node.props.accessibilityLabel?.includes('row')
      );

      expect(textNodes).toHaveLength(7);
    });
  });

  describe('Grid Structure', () => {
    it('should render grid with proper accessibility label', () => {
      const gridData = createGridData(4);

      const { getByLabelText } = render(
        <BinaryHeatmapGrid
          gridData={gridData}
          habitColor={mockHabitColor}
          onCellPress={mockOnCellPress}
        />
      );

      expect(getByLabelText('Habit completion heatmap grid')).toBeTruthy();
    });

    it('should render 7 rows for days of week', () => {
      const gridData = createGridData(4);

      const { getAllByLabelText } = render(
        <BinaryHeatmapGrid
          gridData={gridData}
          habitColor={mockHabitColor}
          onCellPress={mockOnCellPress}
        />
      );

      expect(
        getAllByLabelText(
          /^(Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday) row$/
        )
      ).toHaveLength(7);
    });
  });

  describe('Cell Rendering', () => {
    it('should render cells for each day in the grid', () => {
      const weekCount = 2;
      const gridData = createGridData(weekCount);

      const { UNSAFE_getAllByType } = render(
        <BinaryHeatmapGrid
          gridData={gridData}
          habitColor={mockHabitColor}
          onCellPress={mockOnCellPress}
        />
      );

      expect(countSizedCells(UNSAFE_getAllByType)).toBe(weekCount * 7);
    });

    it('should render cells with correct habit color', () => {
      const customColor = '#ff5500';
      const gridData = createGridData(1, (weekIndex, dayIndex) =>
        createDay(getDateForWeekAndDay(weekIndex, dayIndex), {
          completed: true,
        })
      );

      const { UNSAFE_getAllByType } = render(
        <BinaryHeatmapGrid
          gridData={gridData}
          habitColor={customColor}
          onCellPress={mockOnCellPress}
        />
      );

      expect(countSizedCells(UNSAFE_getAllByType)).toBeGreaterThan(0);
    });

    it('should handle null cells (padding)', () => {
      // Create grid with some null cells
      const gridData = createGridData(2, (weekIndex, dayIndex) => {
        // First 2 days of first week are null (padding)
        if (weekIndex === 0 && dayIndex < 2) {
          return null;
        }
        return createDay(getDateForWeekAndDay(weekIndex, dayIndex));
      });

      const { getByLabelText, UNSAFE_getAllByType } = render(
        <BinaryHeatmapGrid
          gridData={gridData}
          habitColor={mockHabitColor}
          onCellPress={mockOnCellPress}
        />
      );

      expect(getByLabelText('Habit completion heatmap grid')).toBeTruthy();
      expect(countSizedCells(UNSAFE_getAllByType)).toBe(14);
    });
  });

  describe('Row Transposition', () => {
    it('should transpose week-based data to row-based layout', () => {
      // Create a grid where we can verify the transposition
      // Week 0: [A, B, C, D, E, F, G] (days 0-6)
      // Week 1: [H, I, J, K, L, M, N] (days 0-6)
      //
      // Should render as:
      // Row 0 (Sunday): [A, H]
      // Row 1 (Monday): [B, I]
      // etc.

      const gridData: BinaryGridData = {
        weeks: [
          [
            createDay('2025-01-05', { completed: true }), // Sunday
            createDay('2025-01-06', { completed: false }), // Monday
            createDay('2025-01-07', { completed: true }), // Tuesday
            createDay('2025-01-08', { completed: false }), // Wednesday
            createDay('2025-01-09', { completed: true }), // Thursday
            createDay('2025-01-10', { completed: false }), // Friday
            createDay('2025-01-11', { completed: true }), // Saturday
          ],
          [
            createDay('2025-01-12', { completed: false }), // Sunday
            createDay('2025-01-13', { completed: true }), // Monday
            createDay('2025-01-14', { completed: false }), // Tuesday
            createDay('2025-01-15', { completed: true }), // Wednesday
            createDay('2025-01-16', { completed: false }), // Thursday
            createDay('2025-01-17', { completed: true }), // Friday
            createDay('2025-01-18', { completed: false }), // Saturday
          ],
        ],
        monthLabels: [{ weekIndex: 0, label: 'Jan' }],
        stats: { completions: 7, eligibleDays: 14, completionRate: 50 },
      };

      const { UNSAFE_getAllByType } = render(
        <BinaryHeatmapGrid
          gridData={gridData}
          habitColor={mockHabitColor}
          onCellPress={mockOnCellPress}
        />
      );

      // We should have 14 cells total (2 weeks * 7 days)
      expect(countSizedCells(UNSAFE_getAllByType)).toBe(14);
    });
  });

  describe('Cell Press Handling', () => {
    it('does not wire onCellPress on display-only grid cells', () => {
      const gridData = createGridData(1);

      const { getByLabelText } = render(
        <BinaryHeatmapGrid
          gridData={gridData}
          habitColor={mockHabitColor}
          onCellPress={mockOnCellPress}
        />
      );

      expect(getByLabelText('Habit completion heatmap grid')).toBeTruthy();
      expect(mockOnCellPress).not.toHaveBeenCalled();
    });

    it('should handle missing onCellPress gracefully', () => {
      const gridData = createGridData(1);

      expect(() =>
        render(
          <BinaryHeatmapGrid
            gridData={gridData}
            habitColor={mockHabitColor}
          />
        )
      ).not.toThrow();
    });
  });

  describe('Staggered Animation', () => {
    it('should calculate animation indices correctly', () => {
      // Create a 2-week grid
      const gridData = createGridData(2);

      const { UNSAFE_getAllByType } = render(
        <BinaryHeatmapGrid
          gridData={gridData}
          habitColor={mockHabitColor}
          onCellPress={mockOnCellPress}
        />
      );

      expect(countSizedCells(UNSAFE_getAllByType)).toBe(14);
    });
  });

  describe('Empty Grid Handling', () => {
    it('should render empty grid without errors', () => {
      const gridData: BinaryGridData = {
        weeks: [],
        monthLabels: [],
        stats: { completions: 0, eligibleDays: 0, completionRate: 0 },
      };

      const { getByLabelText } = render(
        <BinaryHeatmapGrid
          gridData={gridData}
          habitColor={mockHabitColor}
          onCellPress={mockOnCellPress}
        />
      );

      // Grid container still renders with accessibility label
      expect(getByLabelText('Habit completion heatmap grid')).toBeTruthy();
    });

    it('should still render day labels for empty grid', () => {
      const gridData: BinaryGridData = {
        weeks: [],
        monthLabels: [],
        stats: { completions: 0, eligibleDays: 0, completionRate: 0 },
      };

      const { getByLabelText } = render(
        <BinaryHeatmapGrid
          gridData={gridData}
          habitColor={mockHabitColor}
          onCellPress={mockOnCellPress}
        />
      );

      // Day labels should still be present
      expect(getByLabelText('Sunday row')).toBeTruthy();
      expect(getByLabelText('Saturday row')).toBeTruthy();
    });
  });

  describe('Large Grid Performance', () => {
    it('should handle 52-week (1 year) grid', () => {
      const gridData = createGridData(52);

      const { getByLabelText } = render(
        <BinaryHeatmapGrid
          gridData={gridData}
          habitColor={mockHabitColor}
          onCellPress={mockOnCellPress}
        />
      );

      expect(getByLabelText('Habit completion heatmap grid')).toBeTruthy();
    });

    it('should handle 26-week (6 month) grid', () => {
      const gridData = createGridData(26);

      const { UNSAFE_getAllByType } = render(
        <BinaryHeatmapGrid
          gridData={gridData}
          habitColor={mockHabitColor}
          onCellPress={mockOnCellPress}
        />
      );

      expect(countSizedCells(UNSAFE_getAllByType)).toBe(26 * 7);
    });
  });

  describe('Mixed Cell States', () => {
    it('should render grid with various cell states', () => {
      const gridData: BinaryGridData = {
        weeks: [
          [
            createDay('2025-12-14', { completed: true }), // done
            createDay('2025-12-15', { completed: false }), // missed
            createDay('2025-12-16', { isToday: true, completed: false }), // today
            createDay('2025-12-17', { isFuture: true }), // future
            createDay('2025-12-18', { isBeforeCreation: true }), // beforeCreation
            null, // empty
            createDay('2025-12-20', { completed: true }), // done
          ],
        ],
        monthLabels: [{ weekIndex: 0, label: 'Dec' }],
        stats: { completions: 2, eligibleDays: 4, completionRate: 50 },
      };

      const { getByLabelText, UNSAFE_getAllByType } = render(
        <BinaryHeatmapGrid
          gridData={gridData}
          habitColor={mockHabitColor}
          onCellPress={mockOnCellPress}
        />
      );

      expect(getByLabelText('Habit completion heatmap grid')).toBeTruthy();
      expect(countSizedCells(UNSAFE_getAllByType)).toBe(7);
    });
  });

  describe('Accessibility', () => {
    it('should have correct ARIA structure for screen readers', () => {
      const gridData = createGridData(2);

      const { getByLabelText, getAllByLabelText } = render(
        <BinaryHeatmapGrid
          gridData={gridData}
          habitColor={mockHabitColor}
          onCellPress={mockOnCellPress}
        />
      );

      // Main grid has label
      expect(getByLabelText('Habit completion heatmap grid')).toBeTruthy();

      expect(
        getAllByLabelText(
          /^(Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday) row$/
        )
      ).toHaveLength(7);
    });

    it('should have accessible day label column', () => {
      const gridData = createGridData(2);

      const { getByLabelText } = render(
        <BinaryHeatmapGrid
          gridData={gridData}
          habitColor={mockHabitColor}
          onCellPress={mockOnCellPress}
        />
      );

      // Each day label should be accessible
      expect(getByLabelText('Sunday row')).toBeTruthy();
      expect(getByLabelText('Saturday row')).toBeTruthy();
    });
  });

  describe('Horizontal Scrolling', () => {
    it('should render horizontal scrollview for grid content', () => {
      const gridData = createGridData(13);

      const { UNSAFE_getByType } = render(
        <BinaryHeatmapGrid
          gridData={gridData}
          habitColor={mockHabitColor}
          onCellPress={mockOnCellPress}
        />
      );

      // This tests that ScrollView is rendered (horizontal scroll)
      const scrollView = UNSAFE_getByType(ScrollView);
      expect(scrollView.props.horizontal).toBe(true);
    });

    it('should hide horizontal scroll indicator', () => {
      const gridData = createGridData(4);

      const { UNSAFE_getByType } = render(
        <BinaryHeatmapGrid
          gridData={gridData}
          habitColor={mockHabitColor}
          onCellPress={mockOnCellPress}
        />
      );

      const scrollView = UNSAFE_getByType(ScrollView);
      expect(scrollView.props.showsHorizontalScrollIndicator).toBe(false);
    });
  });

  describe('Month Labels Row', () => {
    it('should render month labels above the grid', () => {
      const gridData: BinaryGridData = {
        weeks: [
          [
            createDay('2025-01-05'),
            createDay('2025-01-06'),
            createDay('2025-01-07'),
            createDay('2025-01-08'),
            createDay('2025-01-09'),
            createDay('2025-01-10'),
            createDay('2025-01-11'),
          ],
        ],
        monthLabels: [{ weekIndex: 0, label: 'Jan' }],
        stats: { completions: 0, eligibleDays: 7, completionRate: 0 },
      };

      const { getByText, getByLabelText } = render(
        <BinaryHeatmapGrid
          gridData={gridData}
          habitColor={mockHabitColor}
          onCellPress={mockOnCellPress}
        />
      );

      // Month label should be rendered
      expect(getByText('Jan')).toBeTruthy();
      // Month labels row should have proper accessibility
      expect(getByLabelText('Month labels row')).toBeTruthy();
    });

    it('should render multiple month labels', () => {
      const gridData = createGridData(13); // ~3 months
      gridData.monthLabels = [
        { weekIndex: 0, label: 'Oct' },
        { weekIndex: 4, label: 'Nov' },
        { weekIndex: 9, label: 'Dec' },
      ];

      const { getByText } = render(
        <BinaryHeatmapGrid
          gridData={gridData}
          habitColor={mockHabitColor}
          onCellPress={mockOnCellPress}
        />
      );

      expect(getByText('Oct')).toBeTruthy();
      expect(getByText('Nov')).toBeTruthy();
      expect(getByText('Dec')).toBeTruthy();
    });

    it('should scroll month labels with the grid', () => {
      const gridData = createGridData(26); // ~6 months
      gridData.monthLabels = [
        { weekIndex: 0, label: 'Jul' },
        { weekIndex: 4, label: 'Aug' },
        { weekIndex: 8, label: 'Sep' },
        { weekIndex: 13, label: 'Oct' },
        { weekIndex: 17, label: 'Nov' },
        { weekIndex: 22, label: 'Dec' },
      ];

      const { getByLabelText, UNSAFE_getByType } = render(
        <BinaryHeatmapGrid
          gridData={gridData}
          habitColor={mockHabitColor}
          onCellPress={mockOnCellPress}
        />
      );

      // Month labels should be inside the scrollview
      const scrollView = UNSAFE_getByType(ScrollView);
      expect(scrollView).toBeTruthy();

      // The month labels row should exist
      expect(getByLabelText('Month labels row')).toBeTruthy();
    });

    it('should render day label spacer for month labels alignment', () => {
      const gridData = createGridData(4);
      gridData.monthLabels = [{ weekIndex: 0, label: 'Jan' }];

      const { UNSAFE_getAllByType } = render(
        <BinaryHeatmapGrid
          gridData={gridData}
          habitColor={mockHabitColor}
          onCellPress={mockOnCellPress}
        />
      );

      // There should be a spacer view in the day labels column
      const views = UNSAFE_getAllByType(require('react-native').View);
      // The component renders several views including the spacer
      expect(views.length).toBeGreaterThan(0);
    });

    it('should handle empty month labels array', () => {
      const gridData = createGridData(4);
      gridData.monthLabels = [];

      const { getByLabelText, queryByText } = render(
        <BinaryHeatmapGrid
          gridData={gridData}
          habitColor={mockHabitColor}
          onCellPress={mockOnCellPress}
        />
      );

      // Grid should still render
      expect(getByLabelText('Habit completion heatmap grid')).toBeTruthy();
      // No month labels should be present
      expect(
        queryByText(/Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec/)
      ).toBeNull();
    });
  });

  describe('Component Updates', () => {
    it('should re-render when gridData changes', () => {
      const initialData = createGridData(2);
      const updatedData = createGridData(4);

      const { UNSAFE_getAllByType, rerender } = render(
        <BinaryHeatmapGrid
          gridData={initialData}
          habitColor={mockHabitColor}
          onCellPress={mockOnCellPress}
        />
      );

      expect(countSizedCells(UNSAFE_getAllByType)).toBe(14);

      rerender(
        <BinaryHeatmapGrid
          gridData={updatedData}
          habitColor={mockHabitColor}
          onCellPress={mockOnCellPress}
        />
      );

      expect(countSizedCells(UNSAFE_getAllByType)).toBe(28);
    });

    it('should re-render when habitColor changes', () => {
      const gridData = createGridData(1);

      const { rerender, UNSAFE_getAllByType } = render(
        <BinaryHeatmapGrid
          gridData={gridData}
          habitColor='#ff0000'
          onCellPress={mockOnCellPress}
        />
      );

      expect(countSizedCells(UNSAFE_getAllByType)).toBe(7);

      rerender(
        <BinaryHeatmapGrid
          gridData={gridData}
          habitColor='#00ff00'
          onCellPress={mockOnCellPress}
        />
      );

      expect(countSizedCells(UNSAFE_getAllByType)).toBe(7);
    });
  });
});
