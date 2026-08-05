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

describe('New modal spring tokens in @/theme/animations', () => {
  it('bottomSheet: damping 26, stiffness 300', () => {
    expect(springs.bottomSheet).toEqual({ damping: 26, stiffness: 300 });
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
  it('BOTTOM_SHEET_SPRING_CONFIG uses springs.bottomSheet', () => {
    expect(BOTTOM_SHEET_SPRING_CONFIG).toBe(springs.bottomSheet);
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
  it('bottomSheet has higher damping than button for stable slide', () => {
    expect(springs.bottomSheet.damping).toBeGreaterThan(springs.button.damping);
  });

  it('exit has higher stiffness than bottomSheet for faster dismiss', () => {
    expect(springs.exit.stiffness).toBeGreaterThan(
      springs.bottomSheet.stiffness
    );
  });

  it('gesture has highest stiffness for instant direct-manipulation response', () => {
    expect(springs.gesture.stiffness).toBeGreaterThan(springs.exit.stiffness);
  });
});
