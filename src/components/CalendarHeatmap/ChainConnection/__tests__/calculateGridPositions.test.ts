/**
 * calculateGridPositions Tests
 * Tests grid position calculation for different view modes
 */

import { calculateGridPositions, getDefaultGridData, getConnectionPathType } from '../utils';
import type { ChainConnection, GridPosition } from '../types';

describe('calculateGridPositions', () => {
  // Use noon UTC to avoid timezone boundary issues where local date differs from UTC
  const referenceDate = new Date('2025-12-28T12:00:00Z');

  describe('week view', () => {
    it('should calculate positions for week view (7 large cells)', () => {
      const dates = [
        '2025-12-28', // Sunday
        '2025-12-29', // Monday - future but still calculates position
      ];
      const gridData = getDefaultGridData('week');
      const positions = calculateGridPositions(dates, 'week', gridData, referenceDate);

      // Check Sunday position
      const sundayPos = positions.get('2025-12-28');
      expect(sundayPos).toBeDefined();
      expect(sundayPos?.type).toBe('week');
      expect(sundayPos?.primaryIndex).toBe(0); // Sunday = day 0
      expect(sundayPos?.secondaryIndex).toBe(0);
    });

    it('should position each day based on day-of-week', () => {
      // Monday Dec 22 to Sunday Dec 28, 2025
      const dates = ['2025-12-22', '2025-12-23', '2025-12-24', '2025-12-25', '2025-12-26', '2025-12-27', '2025-12-28'];
      const gridData = getDefaultGridData('week');
      const positions = calculateGridPositions(dates, 'week', gridData, referenceDate);

      // Dec 22 is a Monday
      expect(positions.get('2025-12-22')?.primaryIndex).toBe(1);
      // Dec 28 is a Sunday
      expect(positions.get('2025-12-28')?.primaryIndex).toBe(0);
    });
  });

  describe('month view', () => {
    it('should calculate positions with row and column', () => {
      const dates = ['2025-12-01', '2025-12-15'];
      const gridData = getDefaultGridData('month');
      const positions = calculateGridPositions(dates, 'month', gridData, referenceDate);

      // Dec 1 is a Monday (column 1), row 0
      const dec1Pos = positions.get('2025-12-01');
      expect(dec1Pos).toBeDefined();
      expect(dec1Pos?.type).toBe('month');
      expect(dec1Pos?.secondaryIndex).toBe(1); // Monday = column 1

      // Dec 15 is a Monday, row 2
      const dec15Pos = positions.get('2025-12-15');
      expect(dec15Pos).toBeDefined();
      expect(dec15Pos?.primaryIndex).toBe(2); // Third row
    });

    it('should include header height offset in Y position', () => {
      const dates = ['2025-12-01'];
      const gridData = getDefaultGridData('month');
      const positions = calculateGridPositions(dates, 'month', gridData, referenceDate);

      const pos = positions.get('2025-12-01');
      expect(pos?.y).toBeGreaterThan(gridData.headerHeight);
    });
  });

  describe('3-month horizontal view', () => {
    it('should calculate positions with week columns and day rows', () => {
      const dates = ['2025-12-01', '2025-12-08'];
      const gridData = getDefaultGridData('3m');
      const positions = calculateGridPositions(dates, '3m', gridData, referenceDate);

      const dec1Pos = positions.get('2025-12-01');
      expect(dec1Pos).toBeDefined();
      expect(dec1Pos?.type).toBe('horizontal');
      expect(dec1Pos?.secondaryIndex).toBe(1); // Monday = row 1

      const dec8Pos = positions.get('2025-12-08');
      expect(dec8Pos).toBeDefined();
      expect(dec8Pos?.secondaryIndex).toBe(1); // Also Monday
      // Different week column
      expect(dec8Pos?.primaryIndex).toBeGreaterThan(dec1Pos?.primaryIndex ?? 0);
    });

    it('should exclude dates outside 90-day window', () => {
      const dates = ['2025-06-01']; // More than 90 days before reference
      const gridData = getDefaultGridData('3m');
      const positions = calculateGridPositions(dates, '3m', gridData, referenceDate);

      expect(positions.get('2025-06-01')).toBeUndefined();
    });

    it('should include label width offset in X position', () => {
      const dates = ['2025-12-28'];
      const gridData = getDefaultGridData('3m');
      const positions = calculateGridPositions(dates, '3m', gridData, referenceDate);

      const pos = positions.get('2025-12-28');
      expect(pos?.x).toBeGreaterThanOrEqual(gridData.labelWidth);
    });
  });

  describe('year view', () => {
    it('should calculate positions for full year', () => {
      const dates = ['2025-01-01', '2025-06-15', '2025-12-25'];
      const gridData = getDefaultGridData('year');
      const positions = calculateGridPositions(dates, 'year', gridData, referenceDate);

      // Jan 1 should be near the start
      const jan1Pos = positions.get('2025-01-01');
      expect(jan1Pos?.type).toBe('year');
      expect(jan1Pos?.primaryIndex).toBeLessThan(5); // First few weeks

      // June 15 should be around week 24
      const june15Pos = positions.get('2025-06-15');
      expect(june15Pos?.primaryIndex).toBeGreaterThan(20);
      expect(june15Pos?.primaryIndex).toBeLessThan(30);

      // Dec 25 should be near week 52
      const dec25Pos = positions.get('2025-12-25');
      expect(dec25Pos?.primaryIndex).toBeGreaterThan(50);
    });

    it('should use small cell size for year view', () => {
      const gridData = getDefaultGridData('year');
      expect(gridData.cellSize).toBe(10);
      expect(gridData.cellGap).toBe(1);
    });
  });
});

describe('getConnectionPathType', () => {
  const createMockConnection = (
    fromPrimary: number,
    fromSecondary: number,
    toPrimary: number,
    toSecondary: number,
    type: 'horizontal' | 'month' | 'week' | 'year' = 'horizontal'
  ): ChainConnection => ({
    id: 'test',
    fromDate: '2025-12-01',
    toDate: '2025-12-02',
    fromPosition: { type, primaryIndex: fromPrimary, secondaryIndex: fromSecondary, x: 0, y: 0 },
    toPosition: { type, primaryIndex: toPrimary, secondaryIndex: toSecondary, x: 0, y: 0 },
    streakPosition: 1,
    streakLength: 2,
    strength: 'subtle',
    isActive: true,
  });

  it('should identify horizontal connection (same row, adjacent columns)', () => {
    const connection = createMockConnection(5, 3, 6, 3);
    expect(getConnectionPathType(connection)).toBe('horizontal');
  });

  it('should identify vertical connection (same column, adjacent rows)', () => {
    const connection = createMockConnection(5, 3, 5, 4);
    expect(getConnectionPathType(connection)).toBe('vertical');
  });

  it('should identify week-wrap connection (Saturday to Sunday)', () => {
    // Row 6 (Saturday) to Row 0 (Sunday), next column
    const connection = createMockConnection(10, 6, 11, 0, 'horizontal');
    expect(getConnectionPathType(connection)).toBe('week-wrap');
  });

  it('should identify diagonal connection for other cases', () => {
    // Different row AND column, not week-wrap
    const connection = createMockConnection(5, 2, 6, 4);
    expect(getConnectionPathType(connection)).toBe('diagonal');
  });

  it('should handle year view week-wrap', () => {
    const connection = createMockConnection(25, 6, 26, 0, 'year');
    expect(getConnectionPathType(connection)).toBe('week-wrap');
  });

  it('should not identify week-wrap for month view', () => {
    // Month view doesn't have week-wrap
    const connection = createMockConnection(0, 6, 1, 0, 'month');
    // Should be diagonal, not week-wrap (month view has different layout)
    expect(getConnectionPathType(connection)).toBe('diagonal');
  });
});
