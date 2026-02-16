/**
 * ParticleBurst Component Tests
 *
 * Tests for the radial particle explosion effect:
 * - Renders 8 particles in radial pattern
 * - Each particle has correct color from the cycle
 * - Component is pointer-events: none
 * - Respects reduced motion preference (no particles rendered)
 */

import React from 'react';
import { render } from '@testing-library/react-native';

import { PARTICLE_BURST } from '../animations';
import { ParticleBurst } from '../ParticleBurst';

// Mock react-native-reanimated


describe('ParticleBurst', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset useReducedMotion to return false (normal motion)
    const Reanimated = require('react-native-reanimated');
    Reanimated.useReducedMotion.mockReturnValue(false);
  });

  describe('Component Rendering', () => {
    it('should render without crashing', () => {
      const { toJSON } = render(<ParticleBurst />);
      expect(toJSON()).toBeTruthy();
    });

    it('should render 8 particles', () => {
      const { toJSON } = render(<ParticleBurst />);
      const tree = toJSON();

      // The container should have 8 children (particles)
      expect(tree).not.toBeNull();
      if (tree && 'children' in tree && tree.children) {
        expect(tree.children.length).toBe(PARTICLE_BURST.count);
      }
    });

    it('should render container with pointer-events none', () => {
      const { toJSON } = render(<ParticleBurst />);
      const tree = toJSON();

      expect(tree).not.toBeNull();
      if (tree && 'props' in tree) {
        expect(tree.props.pointerEvents).toBe('none');
      }
    });

    it('should render container with absolute positioning', () => {
      const { toJSON } = render(<ParticleBurst />);
      const tree = toJSON();

      expect(tree).not.toBeNull();
      if (tree && 'props' in tree && tree.props.style) {
        const flatStyle = Array.isArray(tree.props.style)
          ? Object.assign({}, ...tree.props.style)
          : tree.props.style;
        expect(flatStyle.position).toBe('absolute');
      }
    });
  });

  describe('Particle Properties', () => {
    it('should have particles with circular shape (equal width/height/borderRadius)', () => {
      const { toJSON } = render(<ParticleBurst />);
      const tree = toJSON();

      expect(tree).not.toBeNull();
      if (tree && 'children' in tree && tree.children) {
        tree.children.forEach((child: unknown) => {
          if (child && typeof child === 'object' && 'props' in child) {
            const particleNode = child as { props: { style?: unknown } };
            if (particleNode.props.style) {
              const style = Array.isArray(particleNode.props.style)
                ? Object.assign({}, ...particleNode.props.style)
                : particleNode.props.style;
              // Check that width equals height and borderRadius is half of width
              expect(style.width).toBe(style.height);
              expect(style.borderRadius).toBe(style.width / 2);
            }
          }
        });
      }
    });

    it('should use colors from PARTICLE_BURST config', () => {
      const { toJSON } = render(<ParticleBurst />);
      const tree = toJSON();

      expect(tree).not.toBeNull();
      if (tree && 'children' in tree && tree.children) {
        const backgroundColors: string[] = [];

        tree.children.forEach((child: unknown) => {
          if (child && typeof child === 'object' && 'props' in child) {
            const particleNode = child as { props: { style?: unknown } };
            if (particleNode.props.style) {
              const style = Array.isArray(particleNode.props.style)
                ? Object.assign({}, ...particleNode.props.style)
                : particleNode.props.style;
              if (style.backgroundColor) {
                backgroundColors.push(style.backgroundColor);
              }
            }
          }
        });

        // Verify all colors are from the PARTICLE_BURST config
        backgroundColors.forEach((color) => {
          expect(PARTICLE_BURST.colors).toContain(color);
        });

        // Should have 8 particles with colors
        expect(backgroundColors.length).toBe(PARTICLE_BURST.count);
      }
    });
  });

  describe('Reduced Motion', () => {
    it('should render nothing when reduced motion is preferred', () => {
      const Reanimated = require('react-native-reanimated');
      Reanimated.useReducedMotion.mockReturnValue(true);

      const { toJSON } = render(<ParticleBurst />);

      // Should return null (no particles rendered)
      expect(toJSON()).toBeNull();
    });

    it('should render particles when reduced motion is not preferred', () => {
      const Reanimated = require('react-native-reanimated');
      Reanimated.useReducedMotion.mockReturnValue(false);

      const { toJSON } = render(<ParticleBurst />);

      // Should render the container with particles
      expect(toJSON()).not.toBeNull();
    });
  });

  describe('Props', () => {
    it('should accept custom duration prop', () => {
      const { toJSON } = render(<ParticleBurst duration={1000} />);
      expect(toJSON()).toBeTruthy();
    });

    it('should accept custom distance prop', () => {
      const { toJSON } = render(<ParticleBurst distance={80} />);
      expect(toJSON()).toBeTruthy();
    });

    it('should accept both custom props together', () => {
      const { toJSON } = render(
        <ParticleBurst duration={1000} distance={80} />
      );
      expect(toJSON()).toBeTruthy();
    });
  });

  describe('Animation Constants', () => {
    it('should have correct default count', () => {
      expect(PARTICLE_BURST.count).toBe(8);
    });

    it('should have correct default duration', () => {
      expect(PARTICLE_BURST.duration).toBe(800);
    });

    it('should have correct default distance', () => {
      expect(PARTICLE_BURST.distance).toBe(60);
    });

    it('should have correct stagger delay', () => {
      expect(PARTICLE_BURST.staggerDelay).toBe(25);
    });

    it('should have 5 colors defined', () => {
      expect(PARTICLE_BURST.colors).toHaveLength(5);
    });

    it('should have correct colors', () => {
      expect(PARTICLE_BURST.colors).toEqual([
        '#10B981', // emerald
        '#FBBF24', // amber
        '#8B5CF6', // violet
        '#EC4899', // pink
        '#3B82F6', // blue
      ]);
    });
  });
});
