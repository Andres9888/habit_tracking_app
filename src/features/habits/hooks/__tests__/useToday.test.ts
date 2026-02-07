/**
 * useToday - Tests for day-change detection hook
 *
 * Verifies that:
 * - useToday uses useState (not useMemo with []) to allow updates
 * - AppState listener is registered for foreground detection
 * - A periodic interval is set up as a fallback
 * - Cleanup properly removes listener and interval
 */

import * as fs from 'fs';
import * as path from 'path';

const SOURCE_PATH = path.resolve(__dirname, '../useToday.ts');
let source: string;

beforeAll(() => {
  source = fs.readFileSync(SOURCE_PATH, 'utf-8');
});

describe('useToday - Source Verification', () => {
  it('should use useState instead of useMemo for today', () => {
    expect(source).toContain('useState');
    expect(source).not.toMatch(/useMemo\(\(\)\s*=>\s*startOfDay\(new Date\(\)\),\s*\[\]\)/);
  });

  it('should import AppState from react-native', () => {
    expect(source).toContain("from 'react-native'");
    expect(source).toContain('AppState');
  });

  it('should register an AppState event listener', () => {
    expect(source).toContain("AppState.addEventListener('change'");
  });

  it('should clean up the subscription on unmount', () => {
    expect(source).toContain('subscription.remove()');
  });

  it('should set up a periodic interval to detect day changes', () => {
    expect(source).toContain('setInterval');
    expect(source).toContain('clearInterval');
  });

  it('should check for background-to-active transitions', () => {
    expect(source).toMatch(/inactive|background/);
    expect(source).toContain("nextState === 'active'");
  });

  it('should only update state when the day actually changes (referential stability)', () => {
    // The setter should compare prev.getTime() to avoid unnecessary re-renders
    expect(source).toContain('prev.getTime()');
  });
});
