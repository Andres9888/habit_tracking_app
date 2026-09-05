/**
 * Modal Animation Springs Tests (Phase 6 Task 6)
 * Verifies Modal.constants.ts references theme spring tokens
 * instead of hardcoding spring values.
 */

import { springs } from '@/theme/animations';
import {
  BOTTOM_SHEET_SPRING_CONFIG,
  EXIT_SPRING_CONFIG,
  GESTURE_SPRING_CONFIG,
  FULLSCREEN_ORGANIC_SPRING,
} from '@/components/Modal/Modal.constants';

describe('Modal spring tokens in @/theme/animations', () => {
  it('sheet: damping 20, stiffness 200', () => {
    expect(springs.sheet).toEqual({ damping: 20, stiffness: 200 });
  });

  it('exit: damping 26, mass 1, stiffness 420', () => {
    expect(springs.exit).toEqual({ damping: 26, mass: 1, stiffness: 420 });
  });

  it('gesture: damping 20, mass 1, stiffness 450', () => {
    expect(springs.gesture).toEqual({
      damping: 20,
      mass: 1,
      stiffness: 450,
    });
  });
});

describe('Modal.constants references theme springs', () => {
  it('BOTTOM_SHEET_SPRING_CONFIG uses springs.sheet (legacy alias, kept for old refs)', () => {
    expect(BOTTOM_SHEET_SPRING_CONFIG).toBe(springs.sheet);
  });

  it('EXIT_SPRING_CONFIG uses springs.exit', () => {
    expect(EXIT_SPRING_CONFIG).toBe(springs.exit);
  });

  it('GESTURE_SPRING_CONFIG uses springs.gesture', () => {
    expect(GESTURE_SPRING_CONFIG).toBe(springs.gesture);
  });

  it('FULLSCREEN_ORGANIC_SPRING spreads springs.sheet', () => {
    expect(FULLSCREEN_ORGANIC_SPRING).toEqual({
      ...springs.sheet,
      overshootClamping: false,
    });
  });

  it('FULLSCREEN_ORGANIC_SPRING includes damping and stiffness from sheet', () => {
    expect(FULLSCREEN_ORGANIC_SPRING.damping).toBe(springs.sheet.damping);
    expect(FULLSCREEN_ORGANIC_SPRING.stiffness).toBe(springs.sheet.stiffness);
  });
});

describe('Modal spring values match expected animation feel', () => {
  it('sheet has higher damping than button/standard for a stable slide', () => {
    expect(springs.sheet.damping).toBeGreaterThan(springs.button.damping);
  });

  it('exit has higher stiffness than sheet for faster dismiss', () => {
    expect(springs.exit.stiffness).toBeGreaterThan(springs.sheet.stiffness);
  });

  it('gesture has the highest stiffness for instant direct-manipulation response', () => {
    expect(springs.gesture.stiffness).toBeGreaterThan(springs.exit.stiffness);
  });
});
