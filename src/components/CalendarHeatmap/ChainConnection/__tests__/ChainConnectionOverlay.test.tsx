/**
 * ChainConnectionOverlay Component Tests
 * Tests the SVG overlay rendering for streak chain visualization
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { ChainConnectionOverlay } from '../ChainConnectionOverlay';
import type { StreakSegment, GridPosition } from '../types';

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
    withTiming: (value: any) => value,
    withDelay: (_: any, value: any) => value,
    Easing: {
      out: () => {},
      inOut: () => {},
      ease: {},
      cubic: {},
    },
    interpolate: (value: any) => value,
  };
});

describe('ChainConnectionOverlay', () => {
  const defaultProps = {
    habitColor: '#22c55e',
    reduceMotion: false,
    viewMode: '3m' as const,
    gridWidth: 300,
    gridHeight: 200,
  };

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
      type: 'horizontal',
      primaryIndex,
      secondaryIndex,
      x,
      y,
    },
  ];

  describe('rendering', () => {
    it('should render null when no segments provided', () => {
      const { toJSON } = render(
        <ChainConnectionOverlay
          {...defaultProps}
          segments={[]}
          positions={new Map()}
        />
      );

      expect(toJSON()).toBeNull();
    });

    it('should render null when segment has only one day (no connections)', () => {
      const segments = [createSegment(['2025-12-20'])];
      const positions = new Map([createPosition('2025-12-20', 50, 30, 5, 1)]);

      const { toJSON } = render(
        <ChainConnectionOverlay
          {...defaultProps}
          segments={segments}
          positions={positions}
        />
      );

      expect(toJSON()).toBeNull();
    });

    it('should render overlay container with connections', () => {
      const segments = [createSegment(['2025-12-20', '2025-12-21'])];
      const positions = new Map([
        createPosition('2025-12-20', 50, 30, 5, 1),
        createPosition('2025-12-21', 73, 53, 5, 2),
      ]);

      const { toJSON } = render(
        <ChainConnectionOverlay
          {...defaultProps}
          segments={segments}
          positions={positions}
        />
      );

      expect(toJSON()).not.toBeNull();
    });
  });

  describe('accessibility', () => {
    it('should hide connections from accessibility tree', () => {
      const segments = [createSegment(['2025-12-20', '2025-12-21'])];
      const positions = new Map([
        createPosition('2025-12-20', 50, 30, 5, 1),
        createPosition('2025-12-21', 73, 53, 5, 2),
      ]);

      const { getByTestId, queryByRole } = render(
        <ChainConnectionOverlay
          {...defaultProps}
          segments={segments}
          positions={positions}
        />
      );

      // Connections are decorative and should not be announced
      expect(queryByRole('button')).toBeNull();
    });

    it('should set pointerEvents to none', () => {
      const segments = [createSegment(['2025-12-20', '2025-12-21'])];
      const positions = new Map([
        createPosition('2025-12-20', 50, 30, 5, 1),
        createPosition('2025-12-21', 73, 53, 5, 2),
      ]);

      const { toJSON } = render(
        <ChainConnectionOverlay
          {...defaultProps}
          segments={segments}
          positions={positions}
        />
      );

      const tree = toJSON();
      expect(tree?.props?.pointerEvents).toBe('none');
    });
  });

  describe('multiple segments', () => {
    it('should render connections for multiple segments', () => {
      const segments = [
        createSegment(['2025-12-10', '2025-12-11']),
        createSegment(['2025-12-20', '2025-12-21', '2025-12-22'], true),
      ];
      const positions = new Map([
        createPosition('2025-12-10', 20, 20, 2, 0),
        createPosition('2025-12-11', 43, 43, 2, 1),
        createPosition('2025-12-20', 100, 20, 5, 0),
        createPosition('2025-12-21', 123, 43, 5, 1),
        createPosition('2025-12-22', 146, 66, 5, 2),
      ]);

      const { toJSON } = render(
        <ChainConnectionOverlay
          {...defaultProps}
          segments={segments}
          positions={positions}
        />
      );

      expect(toJSON()).not.toBeNull();
    });
  });

  describe('missing positions', () => {
    it('should skip connections when position is missing', () => {
      const segments = [
        createSegment(['2025-12-20', '2025-12-21', '2025-12-22']),
      ];
      // Only provide positions for first and last date (middle is missing)
      const positions = new Map([
        createPosition('2025-12-20', 50, 30, 5, 1),
        createPosition('2025-12-22', 96, 76, 5, 3),
      ]);

      const { toJSON } = render(
        <ChainConnectionOverlay
          {...defaultProps}
          segments={segments}
          positions={positions}
        />
      );

      // Should still render, just without the broken connections
      expect(toJSON()).toBeNull(); // No complete connections exist
    });
  });

  describe('reduce motion', () => {
    it('should pass reduceMotion to connection paths', () => {
      const segments = [createSegment(['2025-12-20', '2025-12-21'])];
      const positions = new Map([
        createPosition('2025-12-20', 50, 30, 5, 1),
        createPosition('2025-12-21', 73, 53, 5, 2),
      ]);

      // This test validates the component doesn't crash with reduceMotion
      const { toJSON } = render(
        <ChainConnectionOverlay
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
    const segments = [createSegment(['2025-12-20', '2025-12-21'])];
    const positions = new Map([
      createPosition('2025-12-20', 50, 30, 5, 1),
      createPosition('2025-12-21', 73, 53, 5, 2),
    ]);

    it('should render for week view', () => {
      const { toJSON } = render(
        <ChainConnectionOverlay
          {...defaultProps}
          viewMode='week'
          segments={segments}
          positions={positions}
        />
      );
      expect(toJSON()).not.toBeNull();
    });

    it('should render for month view', () => {
      const { toJSON } = render(
        <ChainConnectionOverlay
          {...defaultProps}
          viewMode='month'
          segments={segments}
          positions={positions}
        />
      );
      expect(toJSON()).not.toBeNull();
    });

    it('should render for year view', () => {
      const { toJSON } = render(
        <ChainConnectionOverlay
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
        createPosition('2025-12-21', 73, 53, 5, 2),
      ]);

      const { toJSON } = render(
        <ChainConnectionOverlay
          {...defaultProps}
          gridWidth={500}
          gridHeight={300}
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
        (s: any) => s?.width === 500 && s?.height === 300
      );
      expect(hasCorrectDimensions).toBe(true);
    });
  });
});
