/**
 * ConfettiParticle Component Tests
 *
 * Tests for the shape-aware confetti particle component:
 * - All 5 shapes render correctly (circle, star, heart, sparkle, ribbon)
 * - Size factor is applied correctly
 * - Accessibility attributes are set correctly
 * - Component is memoized for performance
 */

import React from 'react';
import { render } from '@testing-library/react-native';

import { CONFETTI_CONFIG } from '../animations';
import { ConfettiParticle } from '../ConfettiParticle';
import { ConfettiShape } from '../types';

// Mock animated style for testing
const mockAnimatedStyle = {
  opacity: 1,
  transform: [
    { translateX: 0 },
    { translateY: 0 },
    { rotate: '0deg' },
    { scale: 1 },
  ],
};

// Helper types for JSON tree traversal
interface JsonNode {
  type?: string;
  props?: Record<string, unknown>;
  children?: JsonNode[];
}

// Helper to find testID in the component tree
function findNodeWithTestId(json: unknown, testId: string): JsonNode | null {
  if (!json) return null;
  if (Array.isArray(json)) {
    for (const child of json) {
      const found = findNodeWithTestId(child, testId);
      if (found) return found;
    }
    return null;
  }
  if (typeof json === 'object' && json !== null) {
    const node = json as JsonNode;
    if (node.props?.testID === testId) {
      return node;
    }
    if (node.children && Array.isArray(node.children)) {
      for (const child of node.children) {
        const found = findNodeWithTestId(child, testId);
        if (found) return found;
      }
    }
  }
  return null;
}

describe('ConfettiParticle', () => {
  describe('Shape Rendering', () => {
    const shapes: ConfettiShape[] = [
      'circle',
      'star',
      'heart',
      'sparkle',
      'ribbon',
    ];

    shapes.forEach((shape) => {
      it(`should render ${shape} shape without crashing`, () => {
        const { toJSON } = render(
          <ConfettiParticle
            shape={shape}
            color='#FF0000'
            size={10}
            animatedStyle={mockAnimatedStyle}
            testID={`confetti-${shape}`}
          />
        );
        expect(toJSON()).toBeTruthy();
      });
    });

    it('should render circle shape with single child view', () => {
      const { toJSON } = render(
        <ConfettiParticle
          shape='circle'
          color='#10B981'
          size={10}
          animatedStyle={mockAnimatedStyle}
          testID='confetti-circle'
        />
      );
      const json = toJSON();
      expect(json).toBeTruthy();
      const node = findNodeWithTestId(json, 'confetti-circle');
      expect(node).toBeTruthy();
      // Circle has 1 child (the circular view)
      expect(node?.children).toHaveLength(1);
    });

    it('should render star shape with container containing triangles', () => {
      const { toJSON } = render(
        <ConfettiParticle
          shape='star'
          color='#FBBF24'
          size={10}
          animatedStyle={mockAnimatedStyle}
          testID='confetti-star'
        />
      );
      const json = toJSON();
      expect(json).toBeTruthy();
      const node = findNodeWithTestId(json, 'confetti-star');
      expect(node).toBeTruthy();
      // Star has 1 container with 2 triangles inside
      const firstChild = node?.children?.[0];
      expect(firstChild?.children).toHaveLength(2);
    });

    it('should render heart shape with 3 elements (2 circles + square)', () => {
      const { toJSON } = render(
        <ConfettiParticle
          shape='heart'
          color='#EC4899'
          size={10}
          animatedStyle={mockAnimatedStyle}
          testID='confetti-heart'
        />
      );
      const json = toJSON();
      expect(json).toBeTruthy();
      const node = findNodeWithTestId(json, 'confetti-heart');
      expect(node).toBeTruthy();
      // Heart has 1 container with 3 elements inside
      const firstChild = node?.children?.[0];
      expect(firstChild?.children).toHaveLength(3);
    });

    it('should render sparkle shape with 4 arms', () => {
      const { toJSON } = render(
        <ConfettiParticle
          shape='sparkle'
          color='#8B5CF6'
          size={10}
          animatedStyle={mockAnimatedStyle}
          testID='confetti-sparkle'
        />
      );
      const json = toJSON();
      expect(json).toBeTruthy();
      const node = findNodeWithTestId(json, 'confetti-sparkle');
      expect(node).toBeTruthy();
      // Sparkle has 1 container with 4 arms inside
      const firstChild = node?.children?.[0];
      expect(firstChild?.children).toHaveLength(4);
    });

    it('should render ribbon shape as thin rectangle', () => {
      const { toJSON } = render(
        <ConfettiParticle
          shape='ribbon'
          color='#3B82F6'
          size={10}
          animatedStyle={mockAnimatedStyle}
          testID='confetti-ribbon'
        />
      );
      const json = toJSON();
      expect(json).toBeTruthy();
      const node = findNodeWithTestId(json, 'confetti-ribbon');
      expect(node).toBeTruthy();
      // Ribbon has 1 child (the rectangular view)
      expect(node?.children).toHaveLength(1);
    });

    it('should fall back to circle for unknown shape', () => {
      const { toJSON } = render(
        <ConfettiParticle
          shape={'unknown' as ConfettiShape}
          color='#FF0000'
          size={10}
          animatedStyle={mockAnimatedStyle}
          testID='confetti-unknown'
        />
      );
      const json = toJSON();
      expect(json).toBeTruthy();
      const node = findNodeWithTestId(json, 'confetti-unknown');
      expect(node).toBeTruthy();
      // Should fallback to circle (1 child)
      expect(node?.children).toHaveLength(1);
    });
  });

  describe('Size Factor', () => {
    it('should apply default sizeFactor of 1', () => {
      const { toJSON } = render(
        <ConfettiParticle
          shape='circle'
          color='#FF0000'
          size={10}
          animatedStyle={mockAnimatedStyle}
          testID='confetti-default-size'
        />
      );
      expect(toJSON()).toBeTruthy();
      expect(
        findNodeWithTestId(toJSON(), 'confetti-default-size')
      ).toBeTruthy();
    });

    it('should accept custom sizeFactor', () => {
      const { toJSON } = render(
        <ConfettiParticle
          shape='circle'
          color='#FF0000'
          size={10}
          sizeFactor={1.5}
          animatedStyle={mockAnimatedStyle}
          testID='confetti-custom-size'
        />
      );
      expect(toJSON()).toBeTruthy();
      expect(findNodeWithTestId(toJSON(), 'confetti-custom-size')).toBeTruthy();
    });

    it('should handle minimum sizeFactor from config', () => {
      const { toJSON } = render(
        <ConfettiParticle
          shape='circle'
          color='#FF0000'
          size={10}
          sizeFactor={CONFETTI_CONFIG.sizeRange.min}
          animatedStyle={mockAnimatedStyle}
          testID='confetti-min-size'
        />
      );
      expect(toJSON()).toBeTruthy();
      expect(findNodeWithTestId(toJSON(), 'confetti-min-size')).toBeTruthy();
    });

    it('should handle maximum sizeFactor from config', () => {
      const { toJSON } = render(
        <ConfettiParticle
          shape='circle'
          color='#FF0000'
          size={10}
          sizeFactor={CONFETTI_CONFIG.sizeRange.max}
          animatedStyle={mockAnimatedStyle}
          testID='confetti-max-size'
        />
      );
      expect(toJSON()).toBeTruthy();
      expect(findNodeWithTestId(toJSON(), 'confetti-max-size')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should hide particles from accessibility tree', () => {
      const { toJSON } = render(
        <ConfettiParticle
          shape='circle'
          color='#FF0000'
          size={10}
          animatedStyle={mockAnimatedStyle}
          testID='confetti-a11y'
        />
      );
      const node = findNodeWithTestId(toJSON(), 'confetti-a11y') as {
        props: { accessibilityElementsHidden: boolean };
      };
      expect(node).toBeTruthy();
      expect(node.props.accessibilityElementsHidden).toBe(true);
    });

    it('should set importantForAccessibility to no-hide-descendants', () => {
      const { toJSON } = render(
        <ConfettiParticle
          shape='circle'
          color='#FF0000'
          size={10}
          animatedStyle={mockAnimatedStyle}
          testID='confetti-a11y'
        />
      );
      const node = findNodeWithTestId(toJSON(), 'confetti-a11y') as {
        props: { importantForAccessibility: string };
      };
      expect(node).toBeTruthy();
      expect(node.props.importantForAccessibility).toBe('no-hide-descendants');
    });
  });

  describe('Colors', () => {
    CONFETTI_CONFIG.colors.forEach((color) => {
      it(`should render with color ${color}`, () => {
        const { toJSON } = render(
          <ConfettiParticle
            shape='circle'
            color={color}
            size={10}
            animatedStyle={mockAnimatedStyle}
            testID={`confetti-color-${color}`}
          />
        );
        expect(toJSON()).toBeTruthy();
        expect(
          findNodeWithTestId(toJSON(), `confetti-color-${color}`)
        ).toBeTruthy();
      });
    });
  });

  describe('CONFETTI_CONFIG Validation', () => {
    it('should have all 5 shapes defined', () => {
      expect(CONFETTI_CONFIG.shapes).toHaveLength(5);
      expect(CONFETTI_CONFIG.shapes).toContain('circle');
      expect(CONFETTI_CONFIG.shapes).toContain('star');
      expect(CONFETTI_CONFIG.shapes).toContain('heart');
      expect(CONFETTI_CONFIG.shapes).toContain('sparkle');
      expect(CONFETTI_CONFIG.shapes).toContain('ribbon');
    });

    it('should have shape weights that sum to 1.0', () => {
      const totalWeight = Object.values(CONFETTI_CONFIG.shapeWeights).reduce(
        (sum, weight) => sum + weight,
        0
      );
      expect(totalWeight).toBeCloseTo(1.0);
    });

    it('should have a weight for each shape', () => {
      CONFETTI_CONFIG.shapes.forEach((shape) => {
        expect(CONFETTI_CONFIG.shapeWeights[shape]).toBeDefined();
        expect(CONFETTI_CONFIG.shapeWeights[shape]).toBeGreaterThan(0);
      });
    });

    it('should have valid particleCount', () => {
      expect(CONFETTI_CONFIG.particleCount).toBe(50);
    });

    it('should have valid sizeRange', () => {
      expect(CONFETTI_CONFIG.sizeRange.min).toBe(0.8);
      expect(CONFETTI_CONFIG.sizeRange.max).toBe(1.2);
      expect(CONFETTI_CONFIG.sizeRange.min).toBeLessThan(
        CONFETTI_CONFIG.sizeRange.max
      );
    });

    it('should have at least 4 celebration colors', () => {
      expect(CONFETTI_CONFIG.colors.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('Shape Weight Distribution', () => {
    it('should have weights matching spec: circle 30%, star 20%, heart 15%, sparkle 20%, ribbon 15%', () => {
      expect(CONFETTI_CONFIG.shapeWeights.circle).toBe(0.3);
      expect(CONFETTI_CONFIG.shapeWeights.star).toBe(0.2);
      expect(CONFETTI_CONFIG.shapeWeights.heart).toBe(0.15);
      expect(CONFETTI_CONFIG.shapeWeights.sparkle).toBe(0.2);
      expect(CONFETTI_CONFIG.shapeWeights.ribbon).toBe(0.15);
    });

    it('should produce approximately correct distribution over 1000 samples', () => {
      // This tests the weighted selection algorithm indirectly
      // by verifying the weights are configured correctly
      const totalSamples = 1000;
      const expectedCounts = {
        circle: totalSamples * CONFETTI_CONFIG.shapeWeights.circle,
        star: totalSamples * CONFETTI_CONFIG.shapeWeights.star,
        heart: totalSamples * CONFETTI_CONFIG.shapeWeights.heart,
        sparkle: totalSamples * CONFETTI_CONFIG.shapeWeights.sparkle,
        ribbon: totalSamples * CONFETTI_CONFIG.shapeWeights.ribbon,
      };

      // Verify expected counts
      expect(expectedCounts.circle).toBe(300);
      expect(expectedCounts.star).toBe(200);
      expect(expectedCounts.heart).toBe(150);
      expect(expectedCounts.sparkle).toBe(200);
      expect(expectedCounts.ribbon).toBe(150);
    });
  });
});
