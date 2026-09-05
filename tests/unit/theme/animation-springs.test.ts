/**
 * Animation Springs Consolidation Tests (Phase 6 Task 1)
 * Verifies canonical spring presets in @/theme/animations
 * and that constants/motion re-exports them correctly.
 */

import { springs } from '@/theme/animations';
import { Springs } from '@/constants/motion';

describe('Canonical spring presets in @/theme/animations', () => {
  it('has exactly 8 spring presets', () => {
    const keys = Object.keys(springs).sort();
    expect(keys).toEqual([
      'button',
      'celebration',
      'exit',
      'gentle',
      'gesture',
      'pop',
      'sheet',
      'standard',
    ]);
  });

  it('button is a documented alias of standard (same object)', () => {
    expect(springs.button).toBe(springs.standard);
  });

  it('standard/button: damping 18, stiffness 150', () => {
    expect(springs.standard).toEqual({ damping: 18, stiffness: 150 });
    expect(springs.button).toEqual({ damping: 18, stiffness: 150 });
  });

  it('sheet: damping 20, stiffness 200', () => {
    expect(springs.sheet).toEqual({ damping: 20, stiffness: 200 });
  });

  it('gentle: damping 20, stiffness 100', () => {
    expect(springs.gentle).toEqual({ damping: 20, stiffness: 100 });
  });

  it('celebration: damping 12, stiffness 200', () => {
    expect(springs.celebration).toEqual({ damping: 12, stiffness: 200 });
  });

  it('exit: damping 26, mass 1, stiffness 420 (stiffer than sheet)', () => {
    expect(springs.exit).toEqual({ damping: 26, mass: 1, stiffness: 420 });
    expect(springs.exit.stiffness).toBeGreaterThan(springs.sheet.stiffness);
  });

  it('gesture: damping 20, mass 1, stiffness 450', () => {
    expect(springs.gesture).toEqual({ damping: 20, mass: 1, stiffness: 450 });
  });

  it('pop: damping 8, stiffness 300', () => {
    expect(springs.pop).toEqual({ damping: 8, stiffness: 300 });
  });
});

describe('constants/motion Springs re-exports from theme', () => {
  it('Springs has the same values as springs', () => {
    expect(Springs).toStrictEqual(springs);
  });

  it('Springs.button matches springs.button', () => {
    expect(Springs.button).toEqual(springs.button);
  });

  it('Springs.sheet matches springs.sheet', () => {
    expect(Springs.sheet).toEqual(springs.sheet);
  });

  it('Springs.gentle matches springs.gentle', () => {
    expect(Springs.gentle).toEqual(springs.gentle);
  });
});

describe('durations and easing curves still exported', () => {
  it('durations includes standard timing values', () => {
    const { durations } = require('@/theme/animations');
    expect(durations.standard).toBe(200);
    expect(durations.quick).toBe(150);
    expect(durations.instant).toBe(100);
  });

  it('durations includes sheet/backdrop pacing tokens', () => {
    const { durations } = require('@/theme/animations');
    expect(durations.sheet).toBe(300);
    expect(durations.backdrop).toBe(180);
  });

  it('exports sheetEasing and uiEaseOut curve functions', () => {
    const { sheetEasing, uiEaseOut } = require('@/theme/animations');
    expect(typeof sheetEasing).toBe('function');
    expect(typeof uiEaseOut).toBe('function');
  });
});
