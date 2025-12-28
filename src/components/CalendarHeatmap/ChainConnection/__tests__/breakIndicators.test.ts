/**
 * Break Indicators Tests
 * Tests for streak break detection and path generation
 */

import {
  detectStreakBreaks,
  detectStreakSegments,
  generateBreakPath,
  calculateBreakCenter,
  calculateGridPositions,
  getDefaultGridData,
  DEFAULT_BREAK_INDICATOR_CONFIG,
} from '../utils';
import type { StreakSegment, GridPosition, StreakBreak } from '../types';

describe('detectStreakBreaks', () => {
  // Fixed reference date for consistent testing
  const referenceDate = new Date('2025-12-28');
  const gridData = getDefaultGridData('3m');

  /**
   * Helper to create segments and positions from completed dates
   */
  function setupBreakDetection(completedDates: string[]) {
    const dateSet = new Set(completedDates);
    const segments = detectStreakSegments(dateSet, undefined, referenceDate);
    const allDates = segments.flatMap((s) => s.dates);
    const positions = calculateGridPositions(
      allDates,
      '3m',
      gridData,
      referenceDate
    );
    return { segments, positions };
  }

  describe('basic functionality', () => {
    it('should return empty array when no segments exist', () => {
      const positions = new Map<string, GridPosition>();
      const result = detectStreakBreaks([], positions);
      expect(result).toEqual([]);
    });

    it('should return empty array when only one segment exists', () => {
      const { segments, positions } = setupBreakDetection([
        '2025-12-20',
        '2025-12-21',
        '2025-12-22',
      ]);

      const result = detectStreakBreaks(segments, positions);
      expect(result).toEqual([]);
    });

    it('should detect a single break between two segments', () => {
      const { segments, positions } = setupBreakDetection([
        '2025-12-10',
        '2025-12-11',
        // Gap on 12th-14th (3 days)
        '2025-12-15',
        '2025-12-16',
      ]);

      const result = detectStreakBreaks(segments, positions);

      expect(result).toHaveLength(1);
      expect(result[0].beforeDate).toBe('2025-12-11');
      expect(result[0].afterDate).toBe('2025-12-15');
      expect(result[0].gapDays).toBe(3); // 12, 13, 14
    });

    it('should detect multiple breaks between segments', () => {
      const { segments, positions } = setupBreakDetection([
        '2025-12-05',
        '2025-12-06',
        // Gap 1
        '2025-12-10',
        '2025-12-11',
        // Gap 2
        '2025-12-20',
        '2025-12-21',
      ]);

      const result = detectStreakBreaks(segments, positions);

      expect(result).toHaveLength(2);
      expect(result[0].beforeDate).toBe('2025-12-06');
      expect(result[0].afterDate).toBe('2025-12-10');
      expect(result[0].gapDays).toBe(3); // 7, 8, 9

      expect(result[1].beforeDate).toBe('2025-12-11');
      expect(result[1].afterDate).toBe('2025-12-20');
      expect(result[1].gapDays).toBe(8); // 12-19
    });

    it('should correctly calculate single day gaps', () => {
      const { segments, positions } = setupBreakDetection([
        '2025-12-10',
        // Gap on 11th (1 day)
        '2025-12-12',
      ]);

      const result = detectStreakBreaks(segments, positions);

      expect(result).toHaveLength(1);
      expect(result[0].gapDays).toBe(1);
    });
  });

  describe('break properties', () => {
    it('should include segment IDs in break objects', () => {
      const { segments, positions } = setupBreakDetection([
        '2025-12-10',
        '2025-12-11',
        // Gap
        '2025-12-15',
        '2025-12-16',
      ]);

      const result = detectStreakBreaks(segments, positions);

      expect(result[0].beforeSegmentId).toBe(segments[0].id);
      expect(result[0].afterSegmentId).toBe(segments[1].id);
    });

    it('should include positions for before and after dates', () => {
      const { segments, positions } = setupBreakDetection([
        '2025-12-10',
        '2025-12-11',
        // Gap
        '2025-12-15',
        '2025-12-16',
      ]);

      const result = detectStreakBreaks(segments, positions);

      expect(result[0].beforePosition).toBeDefined();
      expect(result[0].afterPosition).toBeDefined();
      expect(result[0].beforePosition).toEqual(positions.get('2025-12-11'));
      expect(result[0].afterPosition).toEqual(positions.get('2025-12-15'));
    });

    it('should generate unique IDs for breaks', () => {
      const { segments, positions } = setupBreakDetection([
        '2025-12-05',
        '2025-12-10',
        '2025-12-15',
        '2025-12-20',
      ]);

      const result = detectStreakBreaks(segments, positions);

      const ids = result.map((b) => b.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe('edge cases', () => {
    it('should handle large gaps correctly', () => {
      const { segments, positions } = setupBreakDetection([
        '2025-10-01',
        '2025-10-02',
        // 88-day gap
        '2025-12-28',
      ]);

      const result = detectStreakBreaks(segments, positions);

      expect(result).toHaveLength(1);
      expect(result[0].gapDays).toBe(86); // Oct 3 to Dec 27
    });

    it('should handle positions not found gracefully', () => {
      // Create segments manually with dates outside grid range
      const segments: StreakSegment[] = [
        {
          id: 'streak-0',
          startDate: '2025-01-01',
          endDate: '2025-01-02',
          length: 2,
          dates: ['2025-01-01', '2025-01-02'],
          isActive: false,
        },
        {
          id: 'streak-1',
          startDate: '2025-01-10',
          endDate: '2025-01-11',
          length: 2,
          dates: ['2025-01-10', '2025-01-11'],
          isActive: false,
        },
      ];
      const positions = new Map<string, GridPosition>();
      // No positions for these dates (outside 3m grid)

      const result = detectStreakBreaks(segments, positions);

      expect(result).toHaveLength(1);
      expect(result[0].beforePosition).toBeUndefined();
      expect(result[0].afterPosition).toBeUndefined();
    });
  });
});

describe('generateBreakPath', () => {
  const cellSize = 20;

  it('should return null when positions are missing', () => {
    const break_: StreakBreak = {
      id: 'break-0',
      beforeDate: '2025-12-10',
      afterDate: '2025-12-15',
      gapDays: 4,
      beforeSegmentId: 'streak-0',
      afterSegmentId: 'streak-1',
      // No positions
    };

    const result = generateBreakPath(break_, cellSize);
    expect(result).toBeNull();
  });

  it('should return null when only beforePosition is missing', () => {
    const break_: StreakBreak = {
      id: 'break-0',
      beforeDate: '2025-12-10',
      afterDate: '2025-12-15',
      gapDays: 4,
      beforeSegmentId: 'streak-0',
      afterSegmentId: 'streak-1',
      afterPosition: {
        type: 'horizontal',
        primaryIndex: 10,
        secondaryIndex: 0,
        x: 100,
        y: 10,
      },
    };

    const result = generateBreakPath(break_, cellSize);
    expect(result).toBeNull();
  });

  it('should generate a valid SVG path when positions exist', () => {
    const break_: StreakBreak = {
      id: 'break-0',
      beforeDate: '2025-12-10',
      afterDate: '2025-12-15',
      gapDays: 4,
      beforeSegmentId: 'streak-0',
      afterSegmentId: 'streak-1',
      beforePosition: {
        type: 'horizontal',
        primaryIndex: 5,
        secondaryIndex: 3,
        x: 50,
        y: 35,
      },
      afterPosition: {
        type: 'horizontal',
        primaryIndex: 10,
        secondaryIndex: 0,
        x: 100,
        y: 10,
      },
    };

    const result = generateBreakPath(break_, cellSize);

    expect(result).not.toBeNull();
    expect(result).toMatch(/^M\s+[\d.]+\s+[\d.]+\s+Q\s+[\d.]+\s+[\d.]+\s+[\d.]+\s+[\d.]+$/);
  });

  it('should generate horizontal path for same-row positions', () => {
    const break_: StreakBreak = {
      id: 'break-0',
      beforeDate: '2025-12-10',
      afterDate: '2025-12-15',
      gapDays: 4,
      beforeSegmentId: 'streak-0',
      afterSegmentId: 'streak-1',
      beforePosition: {
        type: 'horizontal',
        primaryIndex: 5,
        secondaryIndex: 3,
        x: 50,
        y: 35,
      },
      afterPosition: {
        type: 'horizontal',
        primaryIndex: 10,
        secondaryIndex: 3,
        x: 100,
        y: 35, // Same row
      },
    };

    const result = generateBreakPath(break_, cellSize);

    expect(result).not.toBeNull();
    // Path should be mostly horizontal
    expect(result).toContain('M');
    expect(result).toContain('Q');
  });
});

describe('calculateBreakCenter', () => {
  it('should return null when positions are missing', () => {
    const break_: StreakBreak = {
      id: 'break-0',
      beforeDate: '2025-12-10',
      afterDate: '2025-12-15',
      gapDays: 4,
      beforeSegmentId: 'streak-0',
      afterSegmentId: 'streak-1',
    };

    const result = calculateBreakCenter(break_);
    expect(result).toBeNull();
  });

  it('should calculate center point between two positions', () => {
    const break_: StreakBreak = {
      id: 'break-0',
      beforeDate: '2025-12-10',
      afterDate: '2025-12-15',
      gapDays: 4,
      beforeSegmentId: 'streak-0',
      afterSegmentId: 'streak-1',
      beforePosition: {
        type: 'horizontal',
        primaryIndex: 5,
        secondaryIndex: 3,
        x: 50,
        y: 30,
      },
      afterPosition: {
        type: 'horizontal',
        primaryIndex: 10,
        secondaryIndex: 3,
        x: 100,
        y: 30,
      },
    };

    const result = calculateBreakCenter(break_);

    expect(result).toEqual({ x: 75, y: 30 });
  });

  it('should handle diagonal positions correctly', () => {
    const break_: StreakBreak = {
      id: 'break-0',
      beforeDate: '2025-12-10',
      afterDate: '2025-12-15',
      gapDays: 4,
      beforeSegmentId: 'streak-0',
      afterSegmentId: 'streak-1',
      beforePosition: {
        type: 'horizontal',
        primaryIndex: 5,
        secondaryIndex: 0,
        x: 0,
        y: 0,
      },
      afterPosition: {
        type: 'horizontal',
        primaryIndex: 10,
        secondaryIndex: 6,
        x: 100,
        y: 60,
      },
    };

    const result = calculateBreakCenter(break_);

    expect(result).toEqual({ x: 50, y: 30 });
  });
});

describe('DEFAULT_BREAK_INDICATOR_CONFIG', () => {
  it('should have all required properties', () => {
    expect(DEFAULT_BREAK_INDICATOR_CONFIG).toHaveProperty('enabled');
    expect(DEFAULT_BREAK_INDICATOR_CONFIG).toHaveProperty('color');
    expect(DEFAULT_BREAK_INDICATOR_CONFIG).toHaveProperty('opacity');
    expect(DEFAULT_BREAK_INDICATOR_CONFIG).toHaveProperty('thickness');
    expect(DEFAULT_BREAK_INDICATOR_CONFIG).toHaveProperty('dashPattern');
    expect(DEFAULT_BREAK_INDICATOR_CONFIG).toHaveProperty('showIcon');
    expect(DEFAULT_BREAK_INDICATOR_CONFIG).toHaveProperty('iconSize');
  });

  it('should have sensible default values', () => {
    expect(DEFAULT_BREAK_INDICATOR_CONFIG.enabled).toBe(true);
    expect(DEFAULT_BREAK_INDICATOR_CONFIG.opacity).toBeGreaterThan(0);
    expect(DEFAULT_BREAK_INDICATOR_CONFIG.opacity).toBeLessThanOrEqual(1);
    expect(DEFAULT_BREAK_INDICATOR_CONFIG.thickness).toBeGreaterThan(0);
    expect(DEFAULT_BREAK_INDICATOR_CONFIG.iconSize).toBeGreaterThan(0);
  });

  it('should use amber color for warning indication', () => {
    // Amber-500 in hex
    expect(DEFAULT_BREAK_INDICATOR_CONFIG.color).toBe('#f59e0b');
  });
});

describe('break detection integration with segments', () => {
  const referenceDate = new Date('2025-12-28');
  const gridData = getDefaultGridData('3m');

  it('should correctly link breaks to their segments', () => {
    const completedDates = new Set([
      '2025-12-01',
      '2025-12-02',
      '2025-12-03',
      // Gap
      '2025-12-10',
      '2025-12-11',
      // Gap
      '2025-12-20',
      '2025-12-21',
      '2025-12-22',
    ]);

    const segments = detectStreakSegments(
      completedDates,
      undefined,
      referenceDate
    );
    const allDates = segments.flatMap((s) => s.dates);
    const positions = calculateGridPositions(
      allDates,
      '3m',
      gridData,
      referenceDate
    );
    const breaks = detectStreakBreaks(segments, positions);

    expect(segments).toHaveLength(3);
    expect(breaks).toHaveLength(2);

    // First break connects segment 0 to segment 1
    expect(breaks[0].beforeSegmentId).toBe(segments[0].id);
    expect(breaks[0].afterSegmentId).toBe(segments[1].id);

    // Second break connects segment 1 to segment 2
    expect(breaks[1].beforeSegmentId).toBe(segments[1].id);
    expect(breaks[1].afterSegmentId).toBe(segments[2].id);
  });

  it('should handle week view positions correctly', () => {
    const gridDataWeek = getDefaultGridData('week');
    const completedDates = new Set([
      '2025-12-22', // Sunday
      '2025-12-23', // Monday
      // Gap on Tuesday (24th)
      '2025-12-25', // Thursday
      '2025-12-26', // Friday
    ]);

    const segments = detectStreakSegments(
      completedDates,
      undefined,
      referenceDate
    );
    const allDates = segments.flatMap((s) => s.dates);
    const positions = calculateGridPositions(
      allDates,
      'week',
      gridDataWeek,
      referenceDate
    );
    const breaks = detectStreakBreaks(segments, positions);

    expect(breaks).toHaveLength(1);
    expect(breaks[0].gapDays).toBe(1); // Just Tuesday
  });
});
