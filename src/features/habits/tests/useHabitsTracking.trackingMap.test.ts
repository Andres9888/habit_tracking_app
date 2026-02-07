/**
 * useHabitsTracking - Tracking Map Optimization Tests
 *
 * Verifies that getHabitStatus uses O(1) Map lookup instead of O(n) .find().
 * The trackingMap is built once in useMemo and keyed by `${habitId}-${date}`.
 *
 * @see docs/Code-Audit/CODE-AUDIT-03.md Task 1
 */

import { describe, it, expect, beforeAll } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('useHabitsTracking - Tracking Map Optimization', () => {
  const hookPath = path.resolve(
    __dirname,
    '../hooks/useHabitsTracking.ts'
  );

  let source: string;

  beforeAll(() => {
    source = fs.readFileSync(hookPath, 'utf-8');
  });

  describe('trackingMap construction', () => {
    it('should build a trackingMap keyed by habitId-date in useMemo', () => {
      expect(source).toContain('trackingMap');
      expect(source).toContain('`${entry.habitId}-${entry.date}`');
    });

    it('should destructure trackingMap from useMemo alongside completedDatesByHabit', () => {
      expect(source).toMatch(
        /const\s*\{\s*completedDatesByHabit\s*,\s*trackingMap\s*\}\s*=\s*useMemo/
      );
    });
  });

  describe('getHabitStatus uses Map lookup', () => {
    it('should NOT use tracking.find() for status lookup', () => {
      // The old O(n) pattern that should be removed
      expect(source).not.toContain('tracking.find(');
    });

    it('should use trackingMap.get() for O(1) lookup', () => {
      expect(source).toContain('trackingMap.get(');
      expect(source).toContain('`${habitId}-${dateString}`');
    });

    it('should depend on trackingMap instead of tracking in getHabitStatus deps', () => {
      // Extract getHabitStatus's useCallback dependency array
      const getHabitStatusBlock = source.match(
        /const getHabitStatus = useCallback\([\s\S]*?\n\s*\[([^\]]+)\]\s*\)/
      );
      expect(getHabitStatusBlock).not.toBeNull();
      const deps = getHabitStatusBlock![1];
      expect(deps).toContain('trackingMap');
      expect(deps).not.toMatch(/\btracking\b/);
    });
  });
});
