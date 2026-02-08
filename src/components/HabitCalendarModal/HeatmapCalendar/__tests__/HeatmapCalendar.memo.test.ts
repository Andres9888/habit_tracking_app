/**
 * HeatmapCalendar - Memoization Tests
 *
 * Verifies that `new Date()` is wrapped in useMemo to prevent
 * unnecessary downstream recomputations (months array, child props)
 * on every re-render.
 *
 * @see docs/Code-Audit/CODE-AUDIT-05.md Task 6
 */

import { describe, it, expect, beforeAll } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('HeatmapCalendar - Date memoization', () => {
  const componentPath = path.resolve(__dirname, '../HeatmapCalendar.tsx');
  let source: string;

  beforeAll(() => {
    source = fs.readFileSync(componentPath, 'utf-8');
  });

  it('should import useMemo from react', () => {
    expect(source).toMatch(/import\s*\{[^}]*useMemo[^}]*\}\s*from\s*'react'/);
  });

  it('should memoize today = new Date() with useMemo', () => {
    expect(source).toMatch(/today\s*=\s*useMemo\(\s*\(\)\s*=>\s*new Date\(\)/);
  });

  it('should use empty dependency array for today memoization', () => {
    // Extract the useMemo call for today and verify empty deps
    const useMemoMatch = source.match(
      /today\s*=\s*useMemo\(\s*\(\)\s*=>\s*new Date\(\),\s*\[]/
    );
    expect(useMemoMatch).not.toBeNull();
  });

  it('should NOT have bare new Date() outside of useMemo', () => {
    // Remove the useMemo-wrapped Date call, then check no bare new Date() remains
    const withoutMemoized = source.replace(
      /useMemo\(\s*\(\)\s*=>\s*new Date\(\),\s*\[]\)/,
      ''
    );
    expect(withoutMemoized).not.toMatch(/new Date\(\)/);
  });
});
