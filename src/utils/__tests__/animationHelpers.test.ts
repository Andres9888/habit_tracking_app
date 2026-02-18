/**
 * Animation Helpers Utility Tests
 * Tests for creating and managing animation sequences
 */

import {
  createFadeInAnimation,
  createFadeInUpAnimation,
  createFadeInScaleAnimation,
  generateStaggerSequence,
  defaultAnimationDuration,
  defaultStaggerDelay,
  defaultSpringConfig,
} from '../animationHelpers';

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => ({
  useSharedValue: jest.fn((initialValue) => ({ value: initialValue })),
  useAnimatedStyle: jest.fn((callback) => callback()),
  withDelay: jest.fn((delay, animation) => animation),
  withTiming: jest.fn((target, config) => target),
  withSpring: jest.fn((target, config) => target),
}));

describe('animationHelpers', () => {
  describe('createFadeInAnimation', () => {
    it('returns object with opacity, animatedStyle, and trigger', () => {
      const result = createFadeInAnimation();
      expect(result).toHaveProperty('opacity');
      expect(result).toHaveProperty('animatedStyle');
      expect(result).toHaveProperty('trigger');
    });

    it('accepts custom duration parameter', () => {
      const result = createFadeInAnimation(500);
      expect(result.opacity).toBeDefined();
    });

    it('accepts custom delay parameter', () => {
      const result = createFadeInAnimation(300, 100);
      expect(result.opacity).toBeDefined();
    });

    it('returns callable trigger function', () => {
      const result = createFadeInAnimation();
      expect(typeof result.trigger).toBe('function');
      expect(() => result.trigger()).not.toThrow();
    });

    it('creates animation with default duration', () => {
      const result = createFadeInAnimation();
      expect(result.animatedStyle).toBeDefined();
    });
  });

  describe('createFadeInUpAnimation', () => {
    it('returns object with opacity, translateY, animatedStyle, and trigger', () => {
      const result = createFadeInUpAnimation();
      expect(result).toHaveProperty('opacity');
      expect(result).toHaveProperty('translateY');
      expect(result).toHaveProperty('animatedStyle');
      expect(result).toHaveProperty('trigger');
    });

    it('accepts custom duration, delay, and translateDistance', () => {
      const result = createFadeInUpAnimation(400, 50, 40);
      expect(result.translateY).toBeDefined();
    });

    it('sets translateY to initial distance value', () => {
      const distance = 50;
      const result = createFadeInUpAnimation(300, 0, distance);
      expect(result.translateY.value).toBe(distance);
    });

    it('returns callable trigger function', () => {
      const result = createFadeInUpAnimation();
      expect(typeof result.trigger).toBe('function');
      expect(() => result.trigger()).not.toThrow();
    });

    it('uses default translateDistance when not specified', () => {
      const result = createFadeInUpAnimation(300, 0);
      expect(result.translateY.value).toBe(30);
    });
  });

  describe('createFadeInScaleAnimation', () => {
    it('returns object with opacity, scale, animatedStyle, and trigger', () => {
      const result = createFadeInScaleAnimation();
      expect(result).toHaveProperty('opacity');
      expect(result).toHaveProperty('scale');
      expect(result).toHaveProperty('animatedStyle');
      expect(result).toHaveProperty('trigger');
    });

    it('accepts custom duration, delay, and fromScale', () => {
      const result = createFadeInScaleAnimation(400, 50, 0.8);
      expect(result.scale).toBeDefined();
    });

    it('sets scale to custom fromScale value', () => {
      const fromScale = 0.7;
      const result = createFadeInScaleAnimation(300, 0, fromScale);
      expect(result.scale.value).toBe(fromScale);
    });

    it('uses default fromScale of 0.5 when not specified', () => {
      const result = createFadeInScaleAnimation();
      expect(result.scale.value).toBe(0.5);
    });

    it('returns callable trigger function', () => {
      const result = createFadeInScaleAnimation();
      expect(typeof result.trigger).toBe('function');
      expect(() => result.trigger()).not.toThrow();
    });
  });

  describe('generateStaggerSequence', () => {
    it('returns empty array for count of 0', () => {
      const result = generateStaggerSequence(0);
      expect(result).toEqual([]);
    });

    it('returns array with single element for count of 1', () => {
      const result = generateStaggerSequence(1);
      expect(result).toHaveLength(1);
      expect(result[0]).toBe(0);
    });

    it('generates correct stagger sequence with default params', () => {
      const result = generateStaggerSequence(3);
      expect(result).toHaveLength(3);
      expect(result[0]).toBe(0);
      expect(result[1]).toBeGreaterThan(result[0]);
      expect(result[2]).toBeGreaterThan(result[1]);
    });

    it('uses custom base delay', () => {
      const baseDelay = 100;
      const result = generateStaggerSequence(3, baseDelay);
      expect(result[0]).toBe(baseDelay);
    });

    it('uses custom stagger interval', () => {
      const stagger = 100;
      const result = generateStaggerSequence(3, 0, stagger);
      expect(result).toEqual([0, 100, 200]);
    });

    it('generates correct sequence with baseDelay and stagger', () => {
      const baseDelay = 50;
      const stagger = 75;
      const result = generateStaggerSequence(4, baseDelay, stagger);
      expect(result).toEqual([50, 125, 200, 275]);
    });

    it('handles large count values', () => {
      const result = generateStaggerSequence(100);
      expect(result).toHaveLength(100);
      expect(result[0]).toBe(0);
    });

    it('generates increasing sequence', () => {
      const result = generateStaggerSequence(5, 0, 50);
      for (let i = 1; i < result.length; i++) {
        expect(result[i]).toBeGreaterThan(result[i - 1]);
      }
    });
  });

  describe('default animation constants', () => {
    it('exports defaultAnimationDuration', () => {
      expect(defaultAnimationDuration).toBeDefined();
      expect(typeof defaultAnimationDuration).toBe('number');
    });

    it('exports defaultStaggerDelay', () => {
      expect(defaultStaggerDelay).toBeDefined();
      expect(typeof defaultStaggerDelay).toBe('number');
    });

    it('exports defaultSpringConfig', () => {
      expect(defaultSpringConfig).toBeDefined();
      expect(typeof defaultSpringConfig).toBe('object');
    });
  });
});
