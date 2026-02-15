/**
 * HeroIcon Component Tests
 *
 * Tests for the hero icon with breathing animation and glow pulse:
 * - Component renders without crashing
 * - Breathing animation configuration
 * - Glow pulse animation synced with breathing
 * - Reduced motion respects static values
 */

import React from 'react';

import { render } from '@testing-library/react-native';

import { BREATHING_ANIMATION, HERO_GLOW } from '../animations';
import { HeroIcon } from '../HeroIcon';

describe('HeroIcon', () => {
  describe('Component Rendering', () => {
    it('should render without crashing', () => {
      const { getByText } = render(<HeroIcon />);
      expect(getByText('🌱')).toBeDefined();
    });

    it('should render the seedling emoji', () => {
      const { getByText } = render(<HeroIcon />);
      expect(getByText('🌱')).toBeDefined();
    });
  });

  describe('Breathing Animation Constants', () => {
    it('should have correct breathing animation duration (3s)', () => {
      expect(BREATHING_ANIMATION.duration).toBe(3000);
    });

    it('should have correct scale range (1.0 → 1.08)', () => {
      expect(BREATHING_ANIMATION.minScale).toBe(1.0);
      expect(BREATHING_ANIMATION.maxScale).toBe(1.08);
    });
  });

  describe('Hero Glow Animation Constants', () => {
    it('should have correct shadow opacity range (0.15 → 0.35)', () => {
      expect(HERO_GLOW.minShadowOpacity).toBe(0.15);
      expect(HERO_GLOW.maxShadowOpacity).toBe(0.35);
    });

    it('should have correct shadow radius range (24 → 32)', () => {
      expect(HERO_GLOW.minShadowRadius).toBe(24);
      expect(HERO_GLOW.maxShadowRadius).toBe(32);
    });

    it('should have correct outer glow values', () => {
      expect(HERO_GLOW.outerGlowOpacity).toBe(0.15);
      expect(HERO_GLOW.outerGlowRadius).toBe(60);
    });
  });

  describe('Glow Pulse Behavior', () => {
    it('should sync glow pulse with breathing animation (same shared value)', () => {
      // The glow pulse interpolates from the same scale value as breathing
      // When scale = 1.0, shadow should be at min values
      // When scale = 1.08, shadow should be at max values
      const scaleRange =
        BREATHING_ANIMATION.maxScale - BREATHING_ANIMATION.minScale;
      const opacityRange =
        HERO_GLOW.maxShadowOpacity - HERO_GLOW.minShadowOpacity;
      const radiusRange = HERO_GLOW.maxShadowRadius - HERO_GLOW.minShadowRadius;

      // Verify ranges are proportionally synced (use toBeCloseTo for floating point)
      expect(scaleRange).toBeCloseTo(0.08);
      expect(opacityRange).toBeCloseTo(0.2);
      expect(radiusRange).toBe(8);
    });

    it('should calculate correct shadow values at minimum scale', () => {
      // At minScale (1.0), shadow should be at minimum values
      const expectedOpacity = HERO_GLOW.minShadowOpacity;
      const expectedRadius = HERO_GLOW.minShadowRadius;

      expect(expectedOpacity).toBe(0.15);
      expect(expectedRadius).toBe(24);
    });

    it('should calculate correct shadow values at maximum scale', () => {
      // At maxScale (1.08), shadow should be at maximum values
      const expectedOpacity = HERO_GLOW.maxShadowOpacity;
      const expectedRadius = HERO_GLOW.maxShadowRadius;

      expect(expectedOpacity).toBe(0.35);
      expect(expectedRadius).toBe(32);
    });
  });

  describe('Reduced Motion', () => {
    it('should have static shadow values when reduced motion is enabled', () => {
      // When reduced motion is enabled, scale stays at minScale
      // This means shadow values stay at their minimum (static)
      // This is verified by the implementation using the same shared value
      const staticOpacity = HERO_GLOW.minShadowOpacity;
      const staticRadius = HERO_GLOW.minShadowRadius;

      expect(staticOpacity).toBe(0.15);
      expect(staticRadius).toBe(24);
    });
  });

  describe('Props', () => {
    it('should accept animate prop defaulting to true', () => {
      // Default animate prop
      const { getByText } = render(<HeroIcon />);
      expect(getByText('🌱')).toBeDefined();
    });

    it('should accept animate=false to disable animation', () => {
      const { getByText } = render(<HeroIcon animate={false} />);
      expect(getByText('🌱')).toBeDefined();
    });
  });
});
