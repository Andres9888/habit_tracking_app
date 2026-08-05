/**
 * Animation Springs Consolidation Tests (Phase 6 Task 1)
 * Verifies canonical spring presets in @/theme/animations
 * and that constants/motion re-exports them correctly.
 */

import { springs } from '@/theme/animations';
import { Springs } from '@/constants/motion';

describe('Canonical spring presets in @/theme/animations', () => {
  it('has exactly 15 spring presets', () => {
    const keys = Object.keys(springs).sort();
    expect(keys).toEqual([
      'bottomSheet',
      'bouncy',
      'button',
      'celebration',
      'exit',
      'gentle',
      'gesture',
      'micro',
      'pop',
      'pulse',
      'responsive',
      'settle',
      'sheet',
      'snappy',
      'standard',
    ]);
  });

  it('button: damping 18, stiffness 150', () => {
    expect(springs.button).toEqual({ damping: 18, stiffness: 150 });
  });

  it('sheet: damping 20, stiffness 200', () => {
    expect(springs.sheet).toEqual({ damping: 20, stiffness: 200 });
  });

  it('gentle: damping 20, stiffness 100', () => {
    expect(springs.gentle).toEqual({ damping: 20, stiffness: 100 });
  });

  it('snappy: damping 18, stiffness 150', () => {
    expect(springs.snappy).toEqual({ damping: 18, stiffness: 150 });
  });

  it('bouncy: damping 10, stiffness 180', () => {
    expect(springs.bouncy).toEqual({ damping: 10, stiffness: 180 });
  });

  it('pulse: damping 12, stiffness 250', () => {
    expect(springs.pulse).toEqual({ damping: 12, stiffness: 250 });
  });

  it('micro: damping 18, stiffness 150', () => {
    expect(springs.micro).toEqual({ damping: 18, stiffness: 150 });
  });

  it('celebration: damping 12, stiffness 200', () => {
    expect(springs.celebration).toEqual({ damping: 12, stiffness: 200 });
  });

  it('pop: damping 8, stiffness 300', () => {
    expect(springs.pop).toEqual({ damping: 8, stiffness: 300 });
  });

  it('responsive: damping 15, stiffness 300', () => {
    expect(springs.responsive).toEqual({ damping: 15, stiffness: 300 });
  });

  it('settle: damping 28, mass 1, stiffness 180', () => {
    expect(springs.settle).toEqual({ damping: 28, mass: 1, stiffness: 180 });
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

describe('durations and easings still exported', () => {
  it('durations includes standard timing values', () => {
    const { durations } = require('@/theme/animations');
    expect(durations.standard).toBe(200);
    expect(durations.quick).toBe(150);
    expect(durations.instant).toBe(100);
  });

  it('easings includes standard presets', () => {
    const { easings } = require('@/theme/animations');
    expect(easings.standard).toEqual({ duration: 200 });
    expect(easings.quick).toEqual({ duration: 150 });
  });
});
