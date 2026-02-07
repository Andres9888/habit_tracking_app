/**
 * useHabitCalendar - Source Verification Tests
 *
 * Verifies that:
 * - useHabitCalendar uses the useToday hook instead of stale useMemo
 * - The old stale pattern is no longer present
 */

import * as fs from 'fs';
import * as path from 'path';

const SOURCE_PATH = path.resolve(__dirname, '../useHabitCalendar.ts');
let source: string;

beforeAll(() => {
  source = fs.readFileSync(SOURCE_PATH, 'utf-8');
});

describe('useHabitCalendar - Stale today fix', () => {
  it('should import useToday from ./useToday', () => {
    expect(source).toContain("from './useToday'");
  });

  it('should call useToday() to get today', () => {
    expect(source).toContain('useToday()');
  });

  it('should NOT use the old stale useMemo pattern', () => {
    expect(source).not.toContain('useMemo(() => startOfDay(new Date()), [])');
  });

  it('should no longer import startOfDay (moved to useToday)', () => {
    // startOfDay is no longer needed in useHabitCalendar itself
    expect(source).not.toContain("startOfDay");
  });
});
