/**
 * AnalyticsScreen.hooks - setTimeout cleanup verification tests
 *
 * Verifies that:
 * - Refresh timeout ID is stored in a ref
 * - A cleanup useEffect clears the timeout on unmount
 * - useRef and useEffect are imported from react
 */

import { describe, it, expect, beforeAll } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

const HOOK_PATH = path.resolve(__dirname, '../AnalyticsScreen.hooks.ts');

let source: string;

beforeAll(() => {
  source = fs.readFileSync(HOOK_PATH, 'utf-8');
});

describe('useAnalyticsScreen - setTimeout cleanup', () => {
  it('should import useRef from react', () => {
    expect(source).toMatch(/import.*useRef.*from 'react'/);
  });

  it('should import useEffect from react', () => {
    expect(source).toMatch(/import.*useEffect.*from 'react'/);
  });

  it('should create refreshTimeoutRef with useRef', () => {
    expect(source).toContain('const refreshTimeoutRef = useRef');
  });

  it('should store setTimeout ID in refreshTimeoutRef', () => {
    expect(source).toContain(
      'refreshTimeoutRef.current = setTimeout(() => setRefreshing(false), 1000)'
    );
  });

  it('should clear refreshTimeoutRef in cleanup', () => {
    expect(source).toContain('clearTimeout(refreshTimeoutRef.current)');
  });

  it('should have a useEffect with cleanup for the refresh timeout', () => {
    const cleanupMatch = source.match(
      /useEffect\(\(\) => \{\s*return \(\) => \{[\s\S]*?clearTimeout\(refreshTimeoutRef[\s\S]*?\};[\s\S]*?\}, \[\]\)/
    );
    expect(cleanupMatch).not.toBeNull();
  });

  it('should NOT have bare setTimeout without ref assignment in onRefresh', () => {
    // Extract the onRefresh callback body and verify all setTimeouts store in ref
    const lines = source.split('\n');
    const setTimeoutLines = lines.filter(
      (l) => l.includes('setTimeout(') && !l.trim().startsWith('//')
    );
    for (const line of setTimeoutLines) {
      expect(line).toContain('Ref.current = setTimeout');
    }
  });
});
