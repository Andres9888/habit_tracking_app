/**
 * tapGesture - Source verification tests for runOnJS fix and setTimeout cleanup
 *
 * Verifies that:
 * - Anonymous async function is replaced with named handleToggleCompletion
 * - Haptic functions are named module-level functions (not anonymous)
 * - isMountedRef is accepted and checked before setIsToggling in setTimeout
 * - runOnJS is called with named function references
 * - useHabitCardValues creates and returns isMountedRef
 * - Gesture types include isMountedRef
 * - toggleTimeoutRef is threaded through for setTimeout cleanup
 */

import { describe, it, expect, beforeAll } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

const TAP_GESTURE_PATH = path.resolve(__dirname, '../tapGesture.ts');
const VALUES_HOOK_PATH = path.resolve(
  __dirname,
  '../../useHabitCardValues.ts'
);
const GESTURE_TYPES_PATH = path.resolve(__dirname, '../types.ts');
const GESTURES_HOOK_PATH = path.resolve(
  __dirname,
  '../../useHabitCardGestures.ts'
);

let tapSource: string;
let valuesSource: string;
let typesSource: string;
let gesturesHookSource: string;

beforeAll(() => {
  tapSource = fs.readFileSync(TAP_GESTURE_PATH, 'utf-8');
  valuesSource = fs.readFileSync(VALUES_HOOK_PATH, 'utf-8');
  typesSource = fs.readFileSync(GESTURE_TYPES_PATH, 'utf-8');
  gesturesHookSource = fs.readFileSync(GESTURES_HOOK_PATH, 'utf-8');
});

describe('tapGesture - named function extraction', () => {
  it('should define handleToggleCompletion as a named function', () => {
    expect(tapSource).toContain('function handleToggleCompletion()');
  });

  it('should NOT contain anonymous async function passed to runOnJS', () => {
    expect(tapSource).not.toMatch(/runOnJS\(async\s*\(/);
  });

  it('should call runOnJS with handleToggleCompletion', () => {
    expect(tapSource).toContain('runOnJS(handleToggleCompletion)()');
  });

  it('should define fireHapticLight as a named function', () => {
    expect(tapSource).toContain('function fireHapticLight()');
  });

  it('should define fireHapticMedium as a named function', () => {
    expect(tapSource).toContain('function fireHapticMedium()');
  });

  it('should call runOnJS with named haptic functions', () => {
    expect(tapSource).toContain('runOnJS(fireHapticLight)()');
    expect(tapSource).toContain('runOnJS(fireHapticMedium)()');
  });

  it('should NOT have anonymous arrow functions inside runOnJS', () => {
    // Match runOnJS(() => ...) pattern — should no longer exist
    expect(tapSource).not.toMatch(/runOnJS\(\(\)\s*=>/);
  });
});

describe('tapGesture - isMountedRef guard', () => {
  it('should accept isMountedRef in TapGestureOptions', () => {
    expect(tapSource).toContain('isMountedRef: MutableRefObject<boolean>');
  });

  it('should import MutableRefObject type', () => {
    expect(tapSource).toMatch(/import.*MutableRefObject.*from 'react'/);
  });

  it('should check isMountedRef.current before setIsToggling', () => {
    expect(tapSource).toContain('if (isMountedRef.current)');
  });

  it('should call setIsToggling(false) only when mounted', () => {
    // Verify the guard is before setIsToggling(false)
    const guardIndex = tapSource.indexOf('isMountedRef.current');
    const setTogglingIndex = tapSource.indexOf(
      'setIsToggling(false)',
      guardIndex
    );
    expect(guardIndex).toBeGreaterThan(-1);
    expect(setTogglingIndex).toBeGreaterThan(guardIndex);
  });
});

describe('tapGesture - error handling preserved', () => {
  it('should still catch toggle completion errors', () => {
    expect(tapSource).toContain('.catch(');
    expect(tapSource).toContain('Toggle completion failed:');
  });

  it('should guard error logging with __DEV__', () => {
    expect(tapSource).toContain(
      "if (__DEV__) console.error('Toggle completion failed:'"
    );
  });
});

describe('useHabitCardValues - isMountedRef creation', () => {
  it('should create isMountedRef with useRef(true)', () => {
    expect(valuesSource).toContain('useRef(true)');
  });

  it('should set isMountedRef to false on unmount via useEffect', () => {
    expect(valuesSource).toContain('isMountedRef.current = false');
  });

  it('should include isMountedRef in HabitCardValues interface', () => {
    expect(valuesSource).toContain(
      'isMountedRef: MutableRefObject<boolean>'
    );
  });

  it('should return isMountedRef from the hook', () => {
    // Check the return object contains isMountedRef
    const returnMatch = valuesSource.match(/return \{[\s\S]*?\};/);
    expect(returnMatch).not.toBeNull();
    expect(returnMatch![0]).toContain('isMountedRef');
  });
});

describe('UseHabitCardGesturesOptions - isMountedRef type', () => {
  it('should include isMountedRef in gesture options type', () => {
    expect(typesSource).toContain(
      'isMountedRef: MutableRefObject<boolean>'
    );
  });

  it('should import MutableRefObject in types', () => {
    expect(typesSource).toMatch(/import.*MutableRefObject.*from 'react'/);
  });
});

describe('useHabitCardGestures - isMountedRef threading', () => {
  it('should pass isMountedRef to createTapGesture', () => {
    expect(gesturesHookSource).toContain(
      'isMountedRef: options.isMountedRef'
    );
  });
});

describe('tapGesture - toggleTimeoutRef for setTimeout cleanup', () => {
  it('should accept toggleTimeoutRef in TapGestureOptions', () => {
    expect(tapSource).toContain(
      'toggleTimeoutRef: MutableRefObject<ReturnType<typeof setTimeout> | null>'
    );
  });

  it('should destructure toggleTimeoutRef from options', () => {
    expect(tapSource).toMatch(/toggleTimeoutRef,?\s*\n/);
  });

  it('should store setTimeout ID in toggleTimeoutRef.current', () => {
    expect(tapSource).toContain('toggleTimeoutRef.current = setTimeout');
  });

  it('should NOT have bare setTimeout without ref storage', () => {
    // All setTimeout() calls (not type refs) should assign to a ref
    const lines = tapSource.split('\n');
    const setTimeoutCallLines = lines.filter(
      (l) => l.includes('setTimeout(') && !l.trim().startsWith('//')
    );
    expect(setTimeoutCallLines.length).toBeGreaterThan(0);
    for (const line of setTimeoutCallLines) {
      expect(line).toContain('toggleTimeoutRef.current');
    }
  });
});

describe('useHabitCardValues - toggleTimeoutRef creation', () => {
  it('should create toggleTimeoutRef with useRef', () => {
    expect(valuesSource).toContain('const toggleTimeoutRef = useRef');
  });

  it('should include toggleTimeoutRef in HabitCardValues interface', () => {
    expect(valuesSource).toContain('toggleTimeoutRef: MutableRefObject');
  });

  it('should clear toggleTimeoutRef on unmount', () => {
    expect(valuesSource).toContain('clearTimeout(toggleTimeoutRef.current)');
  });

  it('should return toggleTimeoutRef from the hook', () => {
    const returnMatch = valuesSource.match(/return \{[\s\S]*?\};/);
    expect(returnMatch).not.toBeNull();
    expect(returnMatch![0]).toContain('toggleTimeoutRef');
  });
});

describe('UseHabitCardGesturesOptions - toggleTimeoutRef type', () => {
  it('should include toggleTimeoutRef in gesture options type', () => {
    expect(typesSource).toContain(
      'toggleTimeoutRef: MutableRefObject<ReturnType<typeof setTimeout> | null>'
    );
  });
});

describe('useHabitCardGestures - toggleTimeoutRef threading', () => {
  it('should pass toggleTimeoutRef to createTapGesture', () => {
    expect(gesturesHookSource).toContain(
      'toggleTimeoutRef: options.toggleTimeoutRef'
    );
  });
});
