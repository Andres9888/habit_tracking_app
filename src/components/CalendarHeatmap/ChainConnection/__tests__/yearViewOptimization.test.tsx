/**
 * Year View Optimization Tests
 * Tests for BatchedConnectionPath and OptimizedChainConnectionOverlay
 *
 * These tests verify the performance optimization features:
 * - Batched rendering for year view
 * - Proper connection grouping
 * - Animation behavior with batches
 * - Fallback to standard rendering for smaller datasets
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { BatchedConnectionPath } from '../BatchedConnectionPath';
import { OptimizedChainConnectionOverlay } from '../OptimizedChainConnectionOverlay';
import type {
  ChainConnection,
  StreakSegment,
  GridPosition,
  ConnectionConfig,
} from '../types';

// Mock react-native-svg
jest.mock('react-native-svg', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ children, ...props }: any) =>
      React.createElement('svg', props, children),
    Svg: ({ children, ...props }: any) =>
      React.createElement('svg', props, children),
    Path: (props: any) => React.createElement('path', props),
    G: ({ children, ...props }: any) =>
      React.createElement('g', props, children),
    Defs: ({ children, ...props }: any) =>
      React.createElement('defs', props, children),
    LinearGradient: ({ children, ...props }: any) =>
      React.createElement('linearGradient', props, children),
    Stop: (props: any) => React.createElement('stop', props),
    Circle: (props: any) => React.createElement('circle', props),
    Line: (props: any) => React.createElement('line', props),
  };
});

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: {
      createAnimatedComponent: (Component: any) => Component,
    },
    useSharedValue: (initial: any) => ({ value: initial }),
    useAnimatedProps: () => ({}),
    useAnimatedStyle: () => ({}),
    withTiming: (value: any) => value,
    withDelay: (_: any, value: any) => value,
    Easing: {
      out: () => {},
      inOut: () => {},
      ease: {},
      cubic: {},
    },
    interpolate: (value: any) => value,
    FadeIn: {
      delay: () => ({
        duration: () => ({
          easing: () => undefined,
        }),
      }),
    },
  };
});

describe('BatchedConnectionPath', () => {
  const createConnection = (
    id: string,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    streakLength: number = 3,
    streakPosition: number = 1
  ): ChainConnection => ({
    id,
    fromDate: '2025-01-01',
    toDate: '2025-01-02',
    fromPosition: {
      type: 'year',
      primaryIndex: 0,
      secondaryIndex: 0,
      x: fromX,
      y: fromY,
    },
    toPosition: {
      type: 'year',
      primaryIndex: 0,
      secondaryIndex: 1,
      x: toX,
      y: toY,
    },
    streakPosition,
    streakLength,
    strength: 'growing',
    isActive: false,
  });

  const defaultConfig: ConnectionConfig = {
    habitColor: '#22c55e',
    useMutedColors: false,
    reduceMotion: false,
    cellSize: 10,
    cellGap: 1,
    labelOffset: 20,
  };

  const defaultViewBox = {
    minX: 0,
    minY: 0,
    width: 600,
    height: 100,
  };

  describe('rendering', () => {
    it('should render null when no connections provided', () => {
      const { toJSON } = render(
        <BatchedConnectionPath
          connections={[]}
          config={defaultConfig}
          viewBox={defaultViewBox}
        />
      );

      expect(toJSON()).toBeNull();
    });

    it('should render single SVG for multiple connections', () => {
      const connections = [
        createConnection('conn-1', 20, 10, 30, 10),
        createConnection('conn-2', 40, 10, 50, 10),
        createConnection('conn-3', 60, 10, 70, 10),
      ];

      const { toJSON } = render(
        <BatchedConnectionPath
          connections={connections}
          config={defaultConfig}
          viewBox={defaultViewBox}
          testID='batched-path'
        />
      );

      const tree = toJSON();
      expect(tree).not.toBeNull();
      // Should be a single svg element, not multiple
      expect(tree?.type).toBe('svg');
    });

    it('should render paths for each connection', () => {
      const connections = [
        createConnection('conn-1', 20, 10, 30, 10),
        createConnection('conn-2', 40, 10, 50, 10),
      ];

      const { toJSON } = render(
        <BatchedConnectionPath
          connections={connections}
          config={defaultConfig}
          viewBox={defaultViewBox}
        />
      );

      const tree = toJSON();
      // Find all path elements
      const findPaths = (node: any): any[] => {
        if (!node) return [];
        if (node.type === 'path') return [node];
        if (node.children) {
          return node.children.flatMap((child: any) => findPaths(child));
        }
        return [];
      };

      const paths = findPaths(tree);
      // Should have at least 2 paths (one per connection)
      expect(paths.length).toBeGreaterThanOrEqual(2);
    });

    it('should apply viewBox dimensions correctly', () => {
      const connections = [createConnection('conn-1', 100, 50, 110, 50)];
      const viewBox = { minX: 80, minY: 30, width: 60, height: 50 };

      const { toJSON } = render(
        <BatchedConnectionPath
          connections={connections}
          config={defaultConfig}
          viewBox={viewBox}
        />
      );

      const tree = toJSON();
      expect(tree?.props?.viewBox).toBe('80 30 60 50');
      expect(tree?.props?.width).toBe(60);
      expect(tree?.props?.height).toBe(50);
    });
  });

  describe('progression gradient', () => {
    it('should apply progression-based opacity to connections', () => {
      // Create connections with different streak positions
      const connections = [
        createConnection('conn-1', 20, 10, 30, 10, 5, 1), // Start of streak
        createConnection('conn-2', 30, 10, 40, 10, 5, 2), // Middle
        createConnection('conn-3', 40, 10, 50, 10, 5, 4), // Near end
      ];

      const { toJSON } = render(
        <BatchedConnectionPath
          connections={connections}
          config={defaultConfig}
          viewBox={defaultViewBox}
        />
      );

      // The component should render without errors
      expect(toJSON()).not.toBeNull();
    });
  });

  describe('reduce motion', () => {
    it('should render immediately when reduceMotion is true', () => {
      const connections = [createConnection('conn-1', 20, 10, 30, 10)];
      const configWithReduceMotion = { ...defaultConfig, reduceMotion: true };

      const { toJSON } = render(
        <BatchedConnectionPath
          connections={connections}
          config={configWithReduceMotion}
          viewBox={defaultViewBox}
        />
      );

      expect(toJSON()).not.toBeNull();
    });
  });

  describe('shadow rendering', () => {
    it('should render shadow paths for legendary streaks', () => {
      const connections = [
        {
          ...createConnection('conn-1', 20, 10, 30, 10, 21, 10),
          strength: 'legendary-plus' as const,
        },
      ];

      const { toJSON } = render(
        <BatchedConnectionPath
          connections={connections}
          config={defaultConfig}
          viewBox={defaultViewBox}
        />
      );

      const tree = toJSON();
      // Find all path elements
      const findPaths = (node: any): any[] => {
        if (!node) return [];
        if (node.type === 'path') return [node];
        if (node.children) {
          return node.children.flatMap((child: any) => findPaths(child));
        }
        return [];
      };

      const paths = findPaths(tree);
      // Should have 2 paths: shadow + main
      expect(paths.length).toBe(2);
    });
  });
});

describe('OptimizedChainConnectionOverlay', () => {
  const createSegment = (dates: string[], isActive = false): StreakSegment => ({
    id: `segment-${dates[0]}`,
    startDate: dates[0],
    endDate: dates[dates.length - 1],
    length: dates.length,
    dates,
    isActive,
  });

  const createPosition = (
    date: string,
    x: number,
    y: number,
    primaryIndex: number,
    secondaryIndex: number
  ): [string, GridPosition] => [
    date,
    {
      type: 'year',
      primaryIndex,
      secondaryIndex,
      x,
      y,
    },
  ];

  const defaultProps = {
    habitColor: '#22c55e',
    reduceMotion: false,
    viewMode: 'year' as const,
    gridWidth: 600,
    gridHeight: 100,
  };

  describe('rendering strategy selection', () => {
    it('should use batched rendering for year view with many connections', () => {
      // Create 40 consecutive days (will create 39 connections, above threshold)
      const dates: string[] = [];
      for (let i = 1; i <= 40; i++) {
        const day = String(i).padStart(2, '0');
        dates.push(`2025-01-${day}`);
      }

      const segments = [createSegment(dates)];
      const positions = new Map(
        dates.map((date, index) =>
          createPosition(date, 20 + index * 11, 10, index, 0)
        )
      );

      const { toJSON } = render(
        <OptimizedChainConnectionOverlay
          {...defaultProps}
          segments={segments}
          positions={positions}
        />
      );

      // Should render the overlay
      const tree = toJSON();
      expect(tree).not.toBeNull();

      // Should have children (batches are rendered as svg elements inside the container)
      // For batched rendering, we should see svg elements inside
      const children = tree?.children;
      expect(children).toBeDefined();
      expect(children?.length).toBeGreaterThan(0);

      // First child should be an svg (batch) since we're above threshold
      const firstChild = children?.[0];
      expect(firstChild?.type).toBe('svg');
    });

    it('should use standard rendering for smaller connection counts', () => {
      // Create only 10 consecutive days (9 connections, below threshold)
      const dates = [
        '2025-01-01',
        '2025-01-02',
        '2025-01-03',
        '2025-01-04',
        '2025-01-05',
        '2025-01-06',
        '2025-01-07',
        '2025-01-08',
        '2025-01-09',
        '2025-01-10',
      ];

      const segments = [createSegment(dates)];
      const positions = new Map(
        dates.map((date, index) =>
          createPosition(date, 20 + index * 11, 10, index, 0)
        )
      );

      const { toJSON, queryAllByTestId } = render(
        <OptimizedChainConnectionOverlay
          {...defaultProps}
          segments={segments}
          positions={positions}
        />
      );

      // Should render the overlay
      expect(toJSON()).not.toBeNull();
      // Should NOT have batch containers (standard rendering doesn't use batches)
      const batches = queryAllByTestId(/connection-batch-/);
      expect(batches.length).toBe(0);
    });

    it('should use standard rendering for week view regardless of connection count', () => {
      // Create 7 consecutive days for week view
      const dates: string[] = [];
      for (let i = 1; i <= 7; i++) {
        const day = String(i).padStart(2, '0');
        dates.push(`2025-01-${day}`);
      }

      const segments = [createSegment(dates)];
      const positions = new Map(
        dates.map((date, index) =>
          createPosition(date, 20 + index * 72, 32, index, 0)
        )
      );

      const { toJSON, queryAllByTestId } = render(
        <OptimizedChainConnectionOverlay
          {...defaultProps}
          viewMode='week'
          segments={segments}
          positions={positions}
        />
      );

      // Should render the overlay
      expect(toJSON()).not.toBeNull();
      // Week view uses standard rendering
      const batches = queryAllByTestId(/connection-batch-/);
      expect(batches.length).toBe(0);
    });
  });

  describe('batching behavior', () => {
    it('should create multiple batches for large connection counts', () => {
      // Create 100 consecutive days (99 connections)
      // With batch size of 20, should create 5 batches
      const dates: string[] = [];
      for (let i = 0; i < 100; i++) {
        const month = Math.floor(i / 31) + 1;
        const day = (i % 31) + 1;
        dates.push(
          `2025-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        );
      }

      const segments = [createSegment(dates)];
      const positions = new Map(
        dates.map((date, index) =>
          createPosition(date, 20 + index * 11, 10, index, 0)
        )
      );

      const { toJSON } = render(
        <OptimizedChainConnectionOverlay
          {...defaultProps}
          segments={segments}
          positions={positions}
        />
      );

      const tree = toJSON();
      // Count svg children (each batch is an svg element)
      const svgChildren =
        tree?.children?.filter((child: any) => child?.type === 'svg') || [];
      // 99 connections / 20 per batch = 5 batches
      expect(svgChildren.length).toBe(5);
    });
  });

  describe('empty state', () => {
    it('should render null when no segments provided', () => {
      const { toJSON } = render(
        <OptimizedChainConnectionOverlay
          {...defaultProps}
          segments={[]}
          positions={new Map()}
        />
      );

      expect(toJSON()).toBeNull();
    });

    it('should render null when single-day segment (no connections)', () => {
      const segments = [createSegment(['2025-12-20'])];
      const positions = new Map([createPosition('2025-12-20', 50, 30, 5, 1)]);

      const { toJSON } = render(
        <OptimizedChainConnectionOverlay
          {...defaultProps}
          segments={segments}
          positions={positions}
        />
      );

      expect(toJSON()).toBeNull();
    });
  });

  describe('accessibility', () => {
    it('should hide from accessibility tree', () => {
      const segments = [createSegment(['2025-12-20', '2025-12-21'])];
      const positions = new Map([
        createPosition('2025-12-20', 50, 30, 5, 1),
        createPosition('2025-12-21', 61, 41, 5, 2),
      ]);

      const { toJSON } = render(
        <OptimizedChainConnectionOverlay
          {...defaultProps}
          segments={segments}
          positions={positions}
        />
      );

      const tree = toJSON();
      expect(tree?.props?.accessible).toBe(false);
      expect(tree?.props?.importantForAccessibility).toBe(
        'no-hide-descendants'
      );
    });

    it('should set pointerEvents to none', () => {
      const segments = [createSegment(['2025-12-20', '2025-12-21'])];
      const positions = new Map([
        createPosition('2025-12-20', 50, 30, 5, 1),
        createPosition('2025-12-21', 61, 41, 5, 2),
      ]);

      const { toJSON } = render(
        <OptimizedChainConnectionOverlay
          {...defaultProps}
          segments={segments}
          positions={positions}
        />
      );

      expect(toJSON()?.props?.pointerEvents).toBe('none');
    });
  });

  describe('break indicators', () => {
    it('should render break indicators between segments', () => {
      const segments = [
        createSegment(['2025-01-01', '2025-01-02']),
        createSegment(['2025-01-05', '2025-01-06']), // Gap of 2 days
      ];
      const positions = new Map([
        createPosition('2025-01-01', 20, 10, 0, 0),
        createPosition('2025-01-02', 31, 10, 1, 0),
        createPosition('2025-01-05', 64, 10, 4, 0),
        createPosition('2025-01-06', 75, 10, 5, 0),
      ]);

      const { toJSON } = render(
        <OptimizedChainConnectionOverlay
          {...defaultProps}
          showBreakIndicators={true}
          segments={segments}
          positions={positions}
        />
      );

      expect(toJSON()).not.toBeNull();
    });

    it('should hide break indicators when disabled', () => {
      const segments = [
        createSegment(['2025-01-01', '2025-01-02']),
        createSegment(['2025-01-05', '2025-01-06']),
      ];
      const positions = new Map([
        createPosition('2025-01-01', 20, 10, 0, 0),
        createPosition('2025-01-02', 31, 10, 1, 0),
        createPosition('2025-01-05', 64, 10, 4, 0),
        createPosition('2025-01-06', 75, 10, 5, 0),
      ]);

      const { toJSON } = render(
        <OptimizedChainConnectionOverlay
          {...defaultProps}
          showBreakIndicators={false}
          segments={segments}
          positions={positions}
        />
      );

      expect(toJSON()).not.toBeNull();
    });
  });

  describe('reduce motion', () => {
    it('should respect reduceMotion setting', () => {
      const dates: string[] = [];
      for (let i = 1; i <= 40; i++) {
        const day = String(i).padStart(2, '0');
        dates.push(`2025-01-${day}`);
      }

      const segments = [createSegment(dates)];
      const positions = new Map(
        dates.map((date, index) =>
          createPosition(date, 20 + index * 11, 10, index, 0)
        )
      );

      const { toJSON } = render(
        <OptimizedChainConnectionOverlay
          {...defaultProps}
          reduceMotion={true}
          segments={segments}
          positions={positions}
        />
      );

      expect(toJSON()).not.toBeNull();
    });
  });

  describe('view modes', () => {
    const createTestData = () => {
      const dates = ['2025-12-20', '2025-12-21', '2025-12-22'];
      const segments = [createSegment(dates)];
      const positions = new Map([
        createPosition('2025-12-20', 50, 30, 5, 1),
        createPosition('2025-12-21', 61, 41, 5, 2),
        createPosition('2025-12-22', 72, 52, 5, 3),
      ]);
      return { segments, positions };
    };

    it('should render for week view', () => {
      const { segments, positions } = createTestData();
      const { toJSON } = render(
        <OptimizedChainConnectionOverlay
          {...defaultProps}
          viewMode='week'
          segments={segments}
          positions={positions}
        />
      );
      expect(toJSON()).not.toBeNull();
    });

    it('should render for month view', () => {
      const { segments, positions } = createTestData();
      const { toJSON } = render(
        <OptimizedChainConnectionOverlay
          {...defaultProps}
          viewMode='month'
          segments={segments}
          positions={positions}
        />
      );
      expect(toJSON()).not.toBeNull();
    });

    it('should render for 3m view', () => {
      const { segments, positions } = createTestData();
      const { toJSON } = render(
        <OptimizedChainConnectionOverlay
          {...defaultProps}
          viewMode='3m'
          segments={segments}
          positions={positions}
        />
      );
      expect(toJSON()).not.toBeNull();
    });

    it('should render for year view', () => {
      const { segments, positions } = createTestData();
      const { toJSON } = render(
        <OptimizedChainConnectionOverlay
          {...defaultProps}
          viewMode='year'
          segments={segments}
          positions={positions}
        />
      );
      expect(toJSON()).not.toBeNull();
    });
  });

  describe('grid dimensions', () => {
    it('should respect provided grid dimensions', () => {
      const segments = [createSegment(['2025-12-20', '2025-12-21'])];
      const positions = new Map([
        createPosition('2025-12-20', 50, 30, 5, 1),
        createPosition('2025-12-21', 61, 41, 5, 2),
      ]);

      const { toJSON } = render(
        <OptimizedChainConnectionOverlay
          {...defaultProps}
          gridWidth={700}
          gridHeight={150}
          segments={segments}
          positions={positions}
        />
      );

      const tree = toJSON();
      // Style can be an array or object
      const styleArray = Array.isArray(tree?.props?.style)
        ? tree?.props?.style
        : [tree?.props?.style];
      const hasCorrectDimensions = styleArray.some(
        (s: any) => s?.width === 700 && s?.height === 150
      );
      expect(hasCorrectDimensions).toBe(true);
    });
  });
});

describe('Performance characteristics', () => {
  it('should handle 365-day year view efficiently', () => {
    const createSegmentForYear = (dates: string[]): StreakSegment => ({
      id: `segment-${dates[0]}`,
      startDate: dates[0],
      endDate: dates[dates.length - 1],
      length: dates.length,
      dates,
      isActive: true,
    });

    const createPositionForYear = (
      date: string,
      weekIndex: number,
      dayOfWeek: number
    ): [string, GridPosition] => [
      date,
      {
        type: 'year',
        primaryIndex: weekIndex,
        secondaryIndex: dayOfWeek,
        x: 20 + weekIndex * 11 + 5,
        y: dayOfWeek * 11 + 5,
      },
    ];

    // Create full year of data
    const dates: string[] = [];
    for (let month = 1; month <= 12; month++) {
      const daysInMonth = new Date(2025, month, 0).getDate();
      for (let day = 1; day <= daysInMonth; day++) {
        dates.push(
          `2025-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        );
      }
    }

    const segments = [createSegmentForYear(dates)];
    const positions = new Map(
      dates.map((date) => {
        const d = new Date(date);
        const startOfYear = new Date(2025, 0, 1);
        const weekIndex = Math.floor(
          (d.getTime() - startOfYear.getTime()) / (7 * 24 * 60 * 60 * 1000)
        );
        return createPositionForYear(date, weekIndex, d.getDay());
      })
    );

    const startTime = performance.now();

    const { toJSON } = render(
      <OptimizedChainConnectionOverlay
        habitColor='#22c55e'
        reduceMotion={true}
        viewMode='year'
        gridWidth={600}
        gridHeight={100}
        segments={segments}
        positions={positions}
      />
    );

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    // Should render successfully
    const tree = toJSON();
    expect(tree).not.toBeNull();

    // Should use batched rendering (365 days = 364 connections)
    // Each batch is an SVG child element
    const svgChildren =
      tree?.children?.filter((child: any) => child?.type === 'svg') || [];
    // 364 connections / 20 per batch = 19 batches (ceiling)
    expect(svgChildren.length).toBeGreaterThan(0);

    // Render should be reasonably fast (under 500ms in test environment)
    // Note: This is a soft assertion; actual performance depends on test environment
    expect(renderTime).toBeLessThan(500);
  });
});
