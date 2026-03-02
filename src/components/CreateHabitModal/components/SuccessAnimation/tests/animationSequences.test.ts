/**
 * Tests for animationSequences (reanimated migration).
 * Validates runEntranceSequence and runExitSequence use correct reanimated APIs.
 */

import { runEntranceSequence, runExitSequence } from '../animationSequences';

import type { AnimatedValues } from '../animationSequences';

function createMockValues(): AnimatedValues {
  return {
    backdropOpacity: { value: 0 },
    buttonOpacity: { value: 0 },
    buttonTranslateY: { value: 20 },
    cardOpacity: { value: 0 },
    cardScale: { value: 0.5 },
    iconScale: { value: 0 },
    textOpacity: { value: 0 },
  } as AnimatedValues;
}

describe('animationSequences (reanimated)', () => {
  describe('runEntranceSequence', () => {
    it('sets backdrop opacity to 1', () => {
      const values = createMockValues();
      runEntranceSequence(values);
      expect(values.backdropOpacity.value).toBe(1);
    });

    it('sets card scale to 1', () => {
      const values = createMockValues();
      runEntranceSequence(values);
      expect(values.cardScale.value).toBe(1);
    });

    it('sets card opacity to 1', () => {
      const values = createMockValues();
      runEntranceSequence(values);
      expect(values.cardOpacity.value).toBe(1);
    });

    it('sets icon scale to 1', () => {
      const values = createMockValues();
      runEntranceSequence(values);
      expect(values.iconScale.value).toBe(1);
    });

    it('sets text opacity to 1', () => {
      const values = createMockValues();
      runEntranceSequence(values);
      expect(values.textOpacity.value).toBe(1);
    });

    it('sets button opacity to 1', () => {
      const values = createMockValues();
      runEntranceSequence(values);
      expect(values.buttonOpacity.value).toBe(1);
    });

    it('sets button translateY to 0', () => {
      const values = createMockValues();
      runEntranceSequence(values);
      expect(values.buttonTranslateY.value).toBe(0);
    });
  });

  describe('runExitSequence', () => {
    it('sets card scale to 0.9', () => {
      const values = createMockValues();
      runExitSequence(values);
      expect(values.cardScale.value).toBe(0.9);
    });

    it('sets card opacity to 0', () => {
      const values = createMockValues();
      runExitSequence(values);
      expect(values.cardOpacity.value).toBe(0);
    });

    it('sets backdrop opacity to 0', () => {
      const values = createMockValues();
      runExitSequence(values);
      expect(values.backdropOpacity.value).toBe(0);
    });

    it('does not throw without onComplete', () => {
      const values = createMockValues();
      expect(() => runExitSequence(values)).not.toThrow();
    });
  });

  describe('design system compliance', () => {
    it('entrance sequence runs without error', () => {
      const values = createMockValues();
      expect(() => runEntranceSequence(values)).not.toThrow();
    });

    it('exit sequence runs without error', () => {
      const values = createMockValues();
      expect(() => runExitSequence(values)).not.toThrow();
    });
  });
});
