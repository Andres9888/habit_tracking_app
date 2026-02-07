/**
 * useHabitHandlers - Tests for error handling in habit action handlers
 *
 * Verifies that:
 * - handleArchive wraps archiveHabit in try/catch
 * - handleArchive logs errors only in __DEV__ mode
 * - handleArchive shows user-facing Alert on failure
 * - handleDragEnd still has its original error handling
 */

import { describe, it, expect, beforeAll } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

const SOURCE_PATH = path.resolve(__dirname, '../useHabitHandlers.ts');
let source: string;

beforeAll(() => {
  source = fs.readFileSync(SOURCE_PATH, 'utf-8');
});

describe('useHabitHandlers - handleArchive error handling', () => {
  it('should wrap archiveHabit call in try/catch', () => {
    // Extract the handleArchive function body
    const archiveMatch = source.match(
      /const handleArchive[\s\S]*?(?=const \w+\s*=\s*useCallback|return \{)/
    );
    expect(archiveMatch).not.toBeNull();
    const archiveBody = archiveMatch![0];
    expect(archiveBody).toContain('try {');
    expect(archiveBody).toContain('await archiveHabit({ habitId })');
    expect(archiveBody).toContain('catch (error)');
  });

  it('should guard console.error with __DEV__ check', () => {
    const archiveMatch = source.match(
      /const handleArchive[\s\S]*?(?=const \w+\s*=\s*useCallback|return \{)/
    );
    const archiveBody = archiveMatch![0];
    expect(archiveBody).toContain('if (__DEV__)');
    expect(archiveBody).toContain("console.error('Failed to archive habit:'");
  });

  it('should show user-facing Alert on archive failure', () => {
    const archiveMatch = source.match(
      /const handleArchive[\s\S]*?(?=const \w+\s*=\s*useCallback|return \{)/
    );
    const archiveBody = archiveMatch![0];
    expect(archiveBody).toContain('Alert.alert(');
    expect(archiveBody).toMatch(/Failed to archive habit/);
  });

  it('should import Alert from react-native', () => {
    expect(source).toMatch(/import\s*\{[^}]*Alert[^}]*\}\s*from\s*'react-native'/);
  });
});

describe('useHabitHandlers - handleDragEnd error handling (existing)', () => {
  it('should still have try/catch in handleDragEnd', () => {
    const dragMatch = source.match(
      /const handleDragEnd[\s\S]*?(?=const handleArchive)/
    );
    expect(dragMatch).not.toBeNull();
    const dragBody = dragMatch![0];
    expect(dragBody).toContain('try {');
    expect(dragBody).toContain('catch (error)');
    expect(dragBody).toContain("console.error('Failed to reorder habits:'");
  });
});
