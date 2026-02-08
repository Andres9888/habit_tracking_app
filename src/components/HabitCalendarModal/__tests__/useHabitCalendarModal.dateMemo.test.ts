/**
 * useHabitCalendarModal - Date Memoization Tests
 *
 * Verifies that `todayDateString = format(new Date(), 'yyyy-MM-dd')` is
 * wrapped in useMemo to prevent downstream recomputations of todayTracking,
 * recentMissBadge, and handleQuickLogPress on every re-render.
 *
 * @see docs/Code-Audit/CODE-AUDIT-05.md Task 6
 */

import { describe, it, expect, beforeAll } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('useHabitCalendarModal - todayDateString memoization', () => {
  const hookPath = path.resolve(__dirname, '../useHabitCalendarModal.ts');
  let source: string;

  beforeAll(() => {
    source = fs.readFileSync(hookPath, 'utf-8');
  });

  it('should memoize todayDateString with useMemo', () => {
    expect(source).toMatch(/todayDateString\s*=\s*useMemo\(/);
  });

  it('should use format(new Date(), ...) inside useMemo', () => {
    const memoBlock = source.match(
      /todayDateString\s*=\s*useMemo\(\s*\(\)\s*=>\s*format\(new Date\(\)/
    );
    expect(memoBlock).not.toBeNull();
  });

  it('should use empty dependency array for todayDateString', () => {
    const memoWithDeps = source.match(
      /todayDateString\s*=\s*useMemo\(\s*\(\)\s*=>\s*format\(new Date\(\),\s*'yyyy-MM-dd'\),\s*\[]\)/
    );
    expect(memoWithDeps).not.toBeNull();
  });

  it('should NOT have bare format(new Date()) outside useMemo', () => {
    const withoutMemoized = source.replace(
      /useMemo\(\s*\(\)\s*=>\s*format\(new Date\(\),\s*'yyyy-MM-dd'\),\s*\[]\)/,
      ''
    );
    expect(withoutMemoized).not.toMatch(/format\(new Date\(\)/);
  });

  it('todayDateString should be used as dependency in downstream memos', () => {
    // todayTracking depends on todayDateString
    expect(source).toMatch(/todayTracking\s*=\s*useMemo\(/);
    const todayTrackingBlock = source.match(
      /todayTracking\s*=\s*useMemo\([^)]+\)[^;]*,\s*\[[^\]]*todayDateString/
    );
    expect(todayTrackingBlock).not.toBeNull();
  });
});
