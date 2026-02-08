/**
 * useNotificationResponse - Tests for production logging guards
 *
 * Verifies that:
 * - Both console.log calls are guarded by __DEV__ check
 * - No notification tap data is logged in production builds
 */

import { describe, it, expect, beforeAll } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

const SOURCE_PATH = path.resolve(__dirname, '../useNotificationResponse.ts');
let source: string;

beforeAll(() => {
  source = fs.readFileSync(SOURCE_PATH, 'utf-8');
});

describe('useNotificationResponse - __DEV__ guards on console.log', () => {
  it('should contain __DEV__ guards', () => {
    const matches = source.match(/__DEV__/g);
    expect(matches).not.toBeNull();
    expect(matches!.length).toBeGreaterThanOrEqual(2);
  });

  it('should guard the letter notification log with __DEV__', () => {
    const logIndex = source.indexOf('Letter notification tapped');
    expect(logIndex).toBeGreaterThan(-1);
    // Find the nearest __DEV__ before this log
    const precedingSource = source.slice(0, logIndex);
    const lastDevIndex = precedingSource.lastIndexOf('__DEV__');
    expect(lastDevIndex).toBeGreaterThan(-1);
    // __DEV__ should be within a few lines (close proximity)
    const between = source.slice(lastDevIndex, logIndex);
    expect(between).not.toContain('}');
  });

  it('should guard the habit notification log with __DEV__', () => {
    const logIndex = source.indexOf('Habit notification tapped');
    expect(logIndex).toBeGreaterThan(-1);
    // Find the nearest __DEV__ before this log
    const precedingSource = source.slice(0, logIndex);
    const lastDevIndex = precedingSource.lastIndexOf('__DEV__');
    expect(lastDevIndex).toBeGreaterThan(-1);
    // __DEV__ should be within a few lines (close proximity)
    const between = source.slice(lastDevIndex, logIndex);
    expect(between).not.toContain('}');
  });

  it('should not have any unguarded console.log calls', () => {
    const lines = source.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('console.log(')) {
        const contextBefore = lines
          .slice(Math.max(0, i - 5), i + 1)
          .join('\n');
        expect(contextBefore).toContain('__DEV__');
      }
    }
  });

  it('should wrap each console.log inside an if (__DEV__) block', () => {
    const devBlocks = source.match(
      /if\s*\(\s*__DEV__\s*\)\s*\{[\s\S]*?console\.log[\s\S]*?\}/g
    );
    expect(devBlocks).not.toBeNull();
    expect(devBlocks!.length).toBe(2);
  });
});
