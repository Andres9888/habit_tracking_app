/**
 * interactions.ts - Tests for production logging guards
 *
 * Verifies that:
 * - console.log calls are guarded by __DEV__ check
 * - No interaction events are logged in production builds
 */

import { describe, it, expect, beforeAll } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

const SOURCE_PATH = path.resolve(__dirname, '../interactions.ts');
let source: string;

beforeAll(() => {
  source = fs.readFileSync(SOURCE_PATH, 'utf-8');
});

describe('interactions.ts - __DEV__ guard on console.log', () => {
  it('should contain a __DEV__ guard', () => {
    expect(source).toContain('__DEV__');
  });

  it('should guard the interaction log with __DEV__', () => {
    const logMatch = source.match(/console\.log\(`\[interaction:/);
    expect(logMatch).not.toBeNull();
    // __DEV__ should appear before the console.log
    const devIndex = source.indexOf('__DEV__');
    const logIndex = source.indexOf('console.log(`[interaction:');
    expect(devIndex).toBeGreaterThan(-1);
    expect(logIndex).toBeGreaterThan(-1);
    expect(devIndex).toBeLessThan(logIndex);
  });

  it('should not have any unguarded console.log calls', () => {
    const lines = source.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('console.log(')) {
        const contextBefore = lines
          .slice(Math.max(0, i - 3), i + 1)
          .join('\n');
        expect(contextBefore).toContain('__DEV__');
      }
    }
  });

  it('should wrap console.log inside an if (__DEV__) block', () => {
    const devBlock = source.match(
      /if\s*\(\s*__DEV__\s*\)\s*\{[\s\S]*?console\.log[\s\S]*?\}/
    );
    expect(devBlock).not.toBeNull();
  });
});
