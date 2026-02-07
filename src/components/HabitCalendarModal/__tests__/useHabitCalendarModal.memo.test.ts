/**
 * useHabitCalendarModal - Memoization Tests
 *
 * Verifies that expensive computations (habitTrackingEntries, habitTracking,
 * bestStreak, completionPercentage) are wrapped in useMemo and that event
 * handlers use useCallback to prevent unnecessary re-renders.
 *
 * @see docs/Code-Audit/CODE-AUDIT-03.md Task 4
 */

import { describe, it, expect, beforeAll } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('useHabitCalendarModal - Memoization', () => {
  const hookPath = path.resolve(
    __dirname,
    '../useHabitCalendarModal.ts'
  );

  let source: string;

  beforeAll(() => {
    source = fs.readFileSync(hookPath, 'utf-8');
  });

  describe('imports', () => {
    it('should import useMemo and useCallback from react', () => {
      expect(source).toMatch(/import\s*\{[^}]*useMemo[^}]*\}\s*from\s*'react'/);
      expect(source).toMatch(/import\s*\{[^}]*useCallback[^}]*\}\s*from\s*'react'/);
    });
  });

  describe('useMemo for expensive computations', () => {
    it('should memoize habitTrackingEntries with tracking and habitId deps', () => {
      expect(source).toMatch(
        /habitTrackingEntries\s*=\s*useMemo\(/
      );
    });

    it('should memoize habitTracking derived from habitTrackingEntries', () => {
      expect(source).toMatch(
        /habitTracking\s*=\s*useMemo\(/
      );
    });

    it('should memoize bestStreak (O(n log n) calculateBestStreak)', () => {
      expect(source).toMatch(
        /bestStreak\s*=\s*useMemo\(/
      );
      expect(source).toContain('calculateBestStreak(habitTracking)');
    });

    it('should memoize completionPercentage (O(n) calculateCompletionPercentage)', () => {
      expect(source).toMatch(
        /completionPercentage\s*=\s*useMemo\(/
      );
      expect(source).toContain('calculateCompletionPercentage(');
    });

    it('should memoize recentMissBadge', () => {
      expect(source).toMatch(
        /recentMissBadge\s*=\s*useMemo\(/
      );
    });
  });

  describe('useCallback for event handlers', () => {
    it('should wrap handleEditPress in useCallback', () => {
      expect(source).toMatch(/handleEditPress\s*=\s*useCallback\(/);
    });

    it('should wrap handleCloseEdit in useCallback', () => {
      expect(source).toMatch(/handleCloseEdit\s*=\s*useCallback\(/);
    });

    it('should wrap handleQuickLogPress in useCallback', () => {
      expect(source).toMatch(/handleQuickLogPress\s*=\s*useCallback\(/);
    });

    it('should wrap handleOpenAdvancedFeatures in useCallback', () => {
      expect(source).toMatch(/handleOpenAdvancedFeatures\s*=\s*useCallback\(/);
    });
  });

  describe('hooks-before-early-return (Rules of Hooks)', () => {
    it('should call all useMemo hooks before the early return', () => {
      const earlyReturnIndex = source.indexOf('return { isValid: false }');
      expect(earlyReturnIndex).toBeGreaterThan(-1);

      const lastUseMemoIndex = source.lastIndexOf('useMemo(');
      const lastUseCallbackIndex = source.lastIndexOf('useCallback(');
      const lastHookIndex = Math.max(lastUseMemoIndex, lastUseCallbackIndex);

      expect(lastHookIndex).toBeLessThan(earlyReturnIndex);
    });
  });
});
