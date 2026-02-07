/**
 * useHabitHandlers - Tests for error handling in habit action handlers
 *
 * Verifies that:
 * - handleArchive wraps archiveHabit in try/catch
 * - handleArchive logs errors only in __DEV__ mode
 * - handleArchive shows user-facing Alert on failure
 * - finalizeDeletion wraps removeHabit in try/catch
 * - finalizeDeletion always closes UI via finally block
 * - finalizeDeletion logs errors only in __DEV__ mode
 * - finalizeDeletion shows user-facing Alert on failure
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

describe('useHabitHandlers - finalizeDeletion error handling', () => {
  // Extract the handleDeleteHabit function body (which contains finalizeDeletion)
  const getDeleteBody = () => {
    const deleteMatch = source.match(
      /const handleDeleteHabit[\s\S]*?(?=const handleHabitPress)/
    );
    expect(deleteMatch).not.toBeNull();
    return deleteMatch![0];
  };

  it('should wrap removeHabit call in try/catch', () => {
    const deleteBody = getDeleteBody();
    expect(deleteBody).toContain('try {');
    expect(deleteBody).toContain('await removeHabit({ habitId })');
    expect(deleteBody).toContain('catch (error)');
  });

  it('should guard console.error with __DEV__ check', () => {
    const deleteBody = getDeleteBody();
    expect(deleteBody).toContain('if (__DEV__)');
    expect(deleteBody).toContain("console.error('Failed to delete habit:'");
  });

  it('should show user-facing Alert on deletion failure', () => {
    const deleteBody = getDeleteBody();
    expect(deleteBody).toContain("Alert.alert('Error', 'Failed to delete habit. Please try again.')");
  });

  it('should use finally block to always close the detail screen', () => {
    const deleteBody = getDeleteBody();
    expect(deleteBody).toContain('finally {');
    expect(deleteBody).toContain('setIsHabitDetailOpen(false)');
    expect(deleteBody).toContain('setSelectedHabit(null)');
  });

  it('should have cleanup calls inside finally, not in try or catch', () => {
    // Verify that setIsHabitDetailOpen and setSelectedHabit appear AFTER "finally"
    const deleteBody = getDeleteBody();
    const finallyIndex = deleteBody.indexOf('finally {');
    const setDetailIndex = deleteBody.indexOf('setIsHabitDetailOpen(false)');
    const setHabitIndex = deleteBody.indexOf('setSelectedHabit(null)');
    expect(finallyIndex).toBeGreaterThan(-1);
    expect(setDetailIndex).toBeGreaterThan(finallyIndex);
    expect(setHabitIndex).toBeGreaterThan(finallyIndex);
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
