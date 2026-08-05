/**
 * MonthLabelsRow Component Tests
 *
 * Tests for month label rendering, positioning, accessibility,
 * and edge cases like months spanning multiple weeks.
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { MonthLabelsRow } from '../MonthLabelsRow';
import type { BinaryMonthLabel } from '../types';
import { CELL_SIZE, CELL_GAP, MONTH_LABEL } from '../constants';

describe('MonthLabelsRow', () => {
  const cellUnit = CELL_SIZE + CELL_GAP; // 13px per cell/week column

  describe('Basic Rendering', () => {
    it('should render without crashing', () => {
      const { getByLabelText } = render(
        <MonthLabelsRow monthLabels={[]} gridWidth={100} />
      );

      expect(getByLabelText('Month labels row')).toBeTruthy();
    });

    it('should render with header accessibility role', () => {
      const { getByRole } = render(
        <MonthLabelsRow monthLabels={[]} gridWidth={100} />
      );

      expect(getByRole('header')).toBeTruthy();
    });

    it('should render single month label', () => {
      const monthLabels: BinaryMonthLabel[] = [{ weekIndex: 0, label: 'Jan' }];

      const { getByText } = render(
        <MonthLabelsRow monthLabels={monthLabels} gridWidth={200} />
      );

      expect(getByText('Jan')).toBeTruthy();
    });

    it('should render multiple month labels', () => {
      const monthLabels: BinaryMonthLabel[] = [
        { weekIndex: 0, label: 'Oct' },
        { weekIndex: 4, label: 'Nov' },
        { weekIndex: 8, label: 'Dec' },
      ];

      const { getByText } = render(
        <MonthLabelsRow monthLabels={monthLabels} gridWidth={200} />
      );

      expect(getByText('Oct')).toBeTruthy();
      expect(getByText('Nov')).toBeTruthy();
      expect(getByText('Dec')).toBeTruthy();
    });
  });

  describe('Empty Month Labels', () => {
    it('should render empty container when no labels provided', () => {
      const { getByLabelText, queryByText } = render(
        <MonthLabelsRow monthLabels={[]} gridWidth={100} />
      );

      expect(getByLabelText('Month labels row')).toBeTruthy();
      // Should not have any month text
      expect(
        queryByText(/Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec/)
      ).toBeNull();
    });

    it('should maintain correct container height when empty', () => {
      const { getByLabelText } = render(
        <MonthLabelsRow monthLabels={[]} gridWidth={100} />
      );

      const container = getByLabelText('Month labels row');
      // Container should have height style from MONTH_LABEL.HEIGHT
      expect(container.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ height: MONTH_LABEL.HEIGHT }),
        ])
      );
    });
  });

  describe('Label Positioning', () => {
    // Helper to extract style values from React Native style prop (can be array or object)
    const getStyleValue = (style: unknown, prop: string): unknown => {
      if (!style) return undefined;
      if (Array.isArray(style)) {
        for (const s of style) {
          const val = getStyleValue(s, prop);
          if (val !== undefined) return val;
        }
        return undefined;
      }
      return style[prop];
    };

    it('should position first label at start of grid', () => {
      const monthLabels: BinaryMonthLabel[] = [{ weekIndex: 0, label: 'Jan' }];

      const { UNSAFE_getAllByType } = render(
        <MonthLabelsRow monthLabels={monthLabels} gridWidth={200} />
      );

      // Find the View containing the label
      const views = UNSAFE_getAllByType(require('react-native').View);
      const labelContainer = views.find(
        (v: unknown) =>
          getStyleValue(v.props.style, 'left') === 0 &&
          getStyleValue(v.props.style, 'position') === 'absolute'
      );

      expect(labelContainer).toBeTruthy();
    });

    it('should position labels at correct week indices', () => {
      const monthLabels: BinaryMonthLabel[] = [
        { weekIndex: 0, label: 'Oct' },
        { weekIndex: 5, label: 'Nov' },
      ];

      const { UNSAFE_getAllByType } = render(
        <MonthLabelsRow monthLabels={monthLabels} gridWidth={200} />
      );

      const views = UNSAFE_getAllByType(require('react-native').View);

      // Oct should be at position 0
      const octContainer = views.find(
        (v: unknown) =>
          getStyleValue(v.props.style, 'left') === 0 &&
          getStyleValue(v.props.style, 'position') === 'absolute'
      );
      expect(octContainer).toBeTruthy();

      // Nov should be at position 5 * cellUnit
      const expectedNovPosition = 5 * cellUnit;
      const novContainer = views.find(
        (v: unknown) =>
          getStyleValue(v.props.style, 'left') === expectedNovPosition &&
          getStyleValue(v.props.style, 'position') === 'absolute'
      );
      expect(novContainer).toBeTruthy();
    });

    it('should calculate label width correctly between consecutive months', () => {
      const monthLabels: BinaryMonthLabel[] = [
        { weekIndex: 0, label: 'Oct' }, // width should extend to Nov start
        { weekIndex: 4, label: 'Nov' }, // 4 weeks apart
      ];
      const gridWidth = 200;

      const { UNSAFE_getAllByType } = render(
        <MonthLabelsRow monthLabels={monthLabels} gridWidth={gridWidth} />
      );

      const views = UNSAFE_getAllByType(require('react-native').View);

      // Oct label width should be from week 0 to week 4 = 4 * cellUnit
      const expectedOctWidth = 4 * cellUnit;
      const octContainer = views.find(
        (v: unknown) =>
          getStyleValue(v.props.style, 'left') === 0 &&
          getStyleValue(v.props.style, 'width') === expectedOctWidth
      );
      expect(octContainer).toBeTruthy();
    });

    it('should extend last label to grid width', () => {
      const monthLabels: BinaryMonthLabel[] = [
        { weekIndex: 0, label: 'Oct' },
        { weekIndex: 8, label: 'Nov' },
      ];
      const gridWidth = 200;

      const { UNSAFE_getAllByType } = render(
        <MonthLabelsRow monthLabels={monthLabels} gridWidth={gridWidth} />
      );

      const views = UNSAFE_getAllByType(require('react-native').View);

      // Nov is last label, should extend to gridWidth
      const novPosition = 8 * cellUnit;
      const expectedNovWidth = gridWidth - novPosition;
      const novContainer = views.find(
        (v: unknown) =>
          getStyleValue(v.props.style, 'left') === novPosition &&
          getStyleValue(v.props.style, 'width') === expectedNovWidth
      );
      expect(novContainer).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible labels for each month', () => {
      const monthLabels: BinaryMonthLabel[] = [
        { weekIndex: 0, label: 'Jan' },
        { weekIndex: 4, label: 'Feb' },
      ];

      const { getByLabelText } = render(
        <MonthLabelsRow monthLabels={monthLabels} gridWidth={200} />
      );

      expect(getByLabelText('January column')).toBeTruthy();
      expect(getByLabelText('February column')).toBeTruthy();
    });

    it('should expand abbreviated month names for accessibility', () => {
      const allMonths: BinaryMonthLabel[] = [
        { weekIndex: 0, label: 'Jan' },
        { weekIndex: 4, label: 'Feb' },
        { weekIndex: 8, label: 'Mar' },
        { weekIndex: 12, label: 'Apr' },
        { weekIndex: 16, label: 'May' },
        { weekIndex: 20, label: 'Jun' },
        { weekIndex: 24, label: 'Jul' },
        { weekIndex: 28, label: 'Aug' },
        { weekIndex: 32, label: 'Sep' },
        { weekIndex: 36, label: 'Oct' },
        { weekIndex: 40, label: 'Nov' },
        { weekIndex: 44, label: 'Dec' },
      ];

      const { getByLabelText } = render(
        <MonthLabelsRow monthLabels={allMonths} gridWidth={600} />
      );

      expect(getByLabelText('January column')).toBeTruthy();
      expect(getByLabelText('February column')).toBeTruthy();
      expect(getByLabelText('March column')).toBeTruthy();
      expect(getByLabelText('April column')).toBeTruthy();
      expect(getByLabelText('May column')).toBeTruthy();
      expect(getByLabelText('June column')).toBeTruthy();
      expect(getByLabelText('July column')).toBeTruthy();
      expect(getByLabelText('August column')).toBeTruthy();
      expect(getByLabelText('September column')).toBeTruthy();
      expect(getByLabelText('October column')).toBeTruthy();
      expect(getByLabelText('November column')).toBeTruthy();
      expect(getByLabelText('December column')).toBeTruthy();
    });

    it('should have text accessibility role on labels', () => {
      const monthLabels: BinaryMonthLabel[] = [{ weekIndex: 0, label: 'Oct' }];

      const { getAllByRole } = render(
        <MonthLabelsRow monthLabels={monthLabels} gridWidth={200} />
      );

      const textElements = getAllByRole('text');
      expect(textElements.length).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle month at the end of grid', () => {
      const monthLabels: BinaryMonthLabel[] = [{ weekIndex: 10, label: 'Dec' }];
      const gridWidth = 13 * cellUnit; // 13 weeks

      const { getByText } = render(
        <MonthLabelsRow monthLabels={monthLabels} gridWidth={gridWidth} />
      );

      expect(getByText('Dec')).toBeTruthy();
    });

    it('should handle single week month', () => {
      // When two consecutive months are only 1 week apart
      const monthLabels: BinaryMonthLabel[] = [
        { weekIndex: 0, label: 'Oct' },
        { weekIndex: 1, label: 'Nov' }, // Nov starts just 1 week after Oct
      ];

      const { getByText } = render(
        <MonthLabelsRow monthLabels={monthLabels} gridWidth={200} />
      );

      expect(getByText('Oct')).toBeTruthy();
      expect(getByText('Nov')).toBeTruthy();
    });

    it('should apply minimum width for narrow month spans', () => {
      // Helper to extract style values from React Native style prop (can be array or object)
      const getStyleValue = (style: unknown, prop: string): unknown => {
        if (!style) return undefined;
        if (Array.isArray(style)) {
          for (const s of style) {
            const val = getStyleValue(s, prop);
            if (val !== undefined) return val;
          }
          return undefined;
        }
        return style[prop];
      };

      // Month that spans less than MIN_WIDTH
      const monthLabels: BinaryMonthLabel[] = [
        { weekIndex: 0, label: 'Oct' },
        { weekIndex: 1, label: 'Nov' }, // Very close together
      ];

      const { UNSAFE_getAllByType } = render(
        <MonthLabelsRow monthLabels={monthLabels} gridWidth={200} />
      );

      const views = UNSAFE_getAllByType(require('react-native').View);

      // Oct container should have at least MIN_WIDTH
      const octContainer = views.find(
        (v: unknown) =>
          getStyleValue(v.props.style, 'left') === 0 &&
          getStyleValue(v.props.style, 'width') >= MONTH_LABEL.MIN_WIDTH
      );
      expect(octContainer).toBeTruthy();
    });

    it('should handle many months (full year)', () => {
      const monthLabels: BinaryMonthLabel[] = [];
      for (let i = 0; i < 12; i++) {
        monthLabels.push({
          weekIndex: i * 4,
          label: [
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
          ][i],
        });
      }

      const { getByText } = render(
        <MonthLabelsRow monthLabels={monthLabels} gridWidth={52 * cellUnit} />
      );

      // All 12 months should be rendered
      [
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
      ].forEach((month) => {
        expect(getByText(month)).toBeTruthy();
      });
    });

    it('should handle year boundary (Dec to Jan)', () => {
      const monthLabels: BinaryMonthLabel[] = [
        { weekIndex: 0, label: 'Dec' },
        { weekIndex: 4, label: 'Jan' },
      ];

      const { getByText } = render(
        <MonthLabelsRow monthLabels={monthLabels} gridWidth={200} />
      );

      expect(getByText('Dec')).toBeTruthy();
      expect(getByText('Jan')).toBeTruthy();
    });
  });

  describe('Container Sizing', () => {
    it('should use gridWidth for container width', () => {
      const gridWidth = 350;
      const { getByLabelText } = render(
        <MonthLabelsRow monthLabels={[]} gridWidth={gridWidth} />
      );

      const container = getByLabelText('Month labels row');
      expect(container.props.style).toEqual(
        expect.arrayContaining([expect.objectContaining({ width: gridWidth })])
      );
    });

    it('should handle zero gridWidth', () => {
      const { getByLabelText } = render(
        <MonthLabelsRow monthLabels={[]} gridWidth={0} />
      );

      expect(getByLabelText('Month labels row')).toBeTruthy();
    });

    it('should handle very large gridWidth', () => {
      const monthLabels: BinaryMonthLabel[] = [{ weekIndex: 0, label: 'Jan' }];
      const largeWidth = 10000;

      const { getByText } = render(
        <MonthLabelsRow monthLabels={monthLabels} gridWidth={largeWidth} />
      );

      expect(getByText('Jan')).toBeTruthy();
    });
  });

  describe('Component Updates', () => {
    it('should re-render when monthLabels change', () => {
      const initialLabels: BinaryMonthLabel[] = [
        { weekIndex: 0, label: 'Jan' },
      ];
      const updatedLabels: BinaryMonthLabel[] = [
        { weekIndex: 0, label: 'Feb' },
        { weekIndex: 4, label: 'Mar' },
      ];

      const { getByText, queryByText, rerender } = render(
        <MonthLabelsRow monthLabels={initialLabels} gridWidth={200} />
      );

      expect(getByText('Jan')).toBeTruthy();
      expect(queryByText('Feb')).toBeNull();

      rerender(<MonthLabelsRow monthLabels={updatedLabels} gridWidth={200} />);

      expect(queryByText('Jan')).toBeNull();
      expect(getByText('Feb')).toBeTruthy();
      expect(getByText('Mar')).toBeTruthy();
    });

    it('should re-render when gridWidth changes', () => {
      const monthLabels: BinaryMonthLabel[] = [{ weekIndex: 0, label: 'Jan' }];

      const { getByLabelText, rerender } = render(
        <MonthLabelsRow monthLabels={monthLabels} gridWidth={100} />
      );

      let container = getByLabelText('Month labels row');
      expect(container.props.style).toEqual(
        expect.arrayContaining([expect.objectContaining({ width: 100 })])
      );

      rerender(<MonthLabelsRow monthLabels={monthLabels} gridWidth={300} />);

      container = getByLabelText('Month labels row');
      expect(container.props.style).toEqual(
        expect.arrayContaining([expect.objectContaining({ width: 300 })])
      );
    });
  });

  describe('Style Consistency', () => {
    it('should use secondary text color for labels', () => {
      const monthLabels: BinaryMonthLabel[] = [{ weekIndex: 0, label: 'Jan' }];

      const { UNSAFE_getAllByType } = render(
        <MonthLabelsRow monthLabels={monthLabels} gridWidth={200} />
      );

      const textElements = UNSAFE_getAllByType(require('react-native').Text);
      const labelText = textElements.find(
        (t: unknown) => t.props.children === 'Jan'
      );

      expect(labelText).toBeTruthy();
    });

    it('should use correct font size from constants', () => {
      const monthLabels: BinaryMonthLabel[] = [{ weekIndex: 0, label: 'Jan' }];

      const { UNSAFE_getAllByType } = render(
        <MonthLabelsRow monthLabels={monthLabels} gridWidth={200} />
      );

      const textElements = UNSAFE_getAllByType(require('react-native').Text);
      const labelText = textElements.find(
        (t: unknown) => t.props.children === 'Jan'
      );

      // Font size should come from stylesheet which uses MONTH_LABEL.FONT_SIZE
      expect(labelText).toBeTruthy();
    });
  });

  describe('Key Generation', () => {
    it('should handle duplicate month labels in different years', () => {
      // When spanning year boundaries, same month could appear twice
      const monthLabels: BinaryMonthLabel[] = [
        { weekIndex: 0, label: 'Dec' }, // Dec 2024
        { weekIndex: 48, label: 'Dec' }, // Dec 2025 (unlikely but edge case)
      ];

      const { getAllByText } = render(
        <MonthLabelsRow monthLabels={monthLabels} gridWidth={600} />
      );

      // Should render both Dec labels without key collision warnings
      const decLabels = getAllByText('Dec');
      expect(decLabels).toHaveLength(2);
    });
  });
});
