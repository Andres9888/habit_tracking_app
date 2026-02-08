/**
 * useHabitMilestones - Tests for production logging guards
 *
 * Verifies that:
 * - console.log calls are guarded by __DEV__ check
 * - The milestone detection log is not exposed in production
 * - useMilestoneCelebrationState.ts dead code has been removed
 */

import { describe, it, expect, beforeAll } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

const SOURCE_PATH = path.resolve(__dirname, '../useHabitMilestones.ts');
const DEAD_CODE_PATH = path.resolve(
  __dirname,
  '../useMilestoneCelebrationState.ts'
);
let source: string;

beforeAll(() => {
  source = fs.readFileSync(SOURCE_PATH, 'utf-8');
});

describe('useHabitMilestones - __DEV__ guard on console.log', () => {
  it('should contain a __DEV__ guard', () => {
    expect(source).toContain('__DEV__');
  });

  it('should guard the MILESTONE DETECTED log with __DEV__', () => {
    const milestoneEffect = source.match(
      /useEffect\(\(\)\s*=>\s*\{[\s\S]*?MILESTONE DETECTED[\s\S]*?\}\s*,\s*\[milestone\]\)/
    );
    expect(milestoneEffect).not.toBeNull();
    const effectBody = milestoneEffect![0];
    expect(effectBody).toContain('__DEV__');
    expect(effectBody).toContain("console.log('🎉 MILESTONE DETECTED!'");
  });

  it('should check __DEV__ before console.log executes', () => {
    const devIndex = source.indexOf('__DEV__');
    const logIndex = source.indexOf("console.log('🎉 MILESTONE DETECTED!'");
    expect(devIndex).toBeGreaterThan(-1);
    expect(logIndex).toBeGreaterThan(-1);
    expect(devIndex).toBeLessThan(logIndex);
  });

  it('should not have any unguarded console.log calls', () => {
    const lines = source.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('console.log(')) {
        const contextBefore = lines.slice(Math.max(0, i - 3), i + 1).join('\n');
        expect(contextBefore).toContain('__DEV__');
      }
    }
  });
});

describe('useMilestoneCelebrationState - dead code removal', () => {
  it('should have been deleted (dead code, never imported)', () => {
    expect(fs.existsSync(DEAD_CODE_PATH)).toBe(false);
  });
});
