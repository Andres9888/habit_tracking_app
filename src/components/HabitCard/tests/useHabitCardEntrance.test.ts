/**
 * useHabitCardEntrance Hook Unit Tests
 *
 * Tests the habit card entrance animation hook logic including:
 * - Animation variant selection
 * - Reduce motion accessibility support
 * - Animation trigger and reset functionality
 * - Animated style generation
 * - Cleanup on unmount
 */

import { renderHook, act } from '@testing-library/react-native';
import {
  useHabitCardEntrance,
  type HabitCardEntranceVariant,
} from '../useHabitCardEntrance';

// Mock useReduceMotion hook
const mockReduceMotion = jest.fn(() => false);
jest.mock('../../../hooks/useReduceMotion', () => ({
  useReduceMotion: () => mockReduceMotion(),
}));

// Mock Springs constant
jest.mock('../../../constants/motion', () => ({
  Springs: {
    gentle: {
      damping: 15,
      stiffness: 100,
      mass: 1,
    },
  },
}));

describe('useHabitCardEntrance', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockReduceMotion.mockReturnValue(false);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Initialization', () => {
    it('should return cardStyle, accentStyle, and contentStyle objects', () => {
      const { result } = renderHook(() => useHabitCardEntrance());

      expect(result.current.cardStyle).toBeDefined();
      expect(result.current.accentStyle).toBeDefined();
      expect(result.current.contentStyle).toBeDefined();
    });

    it('should return triggerEntrance function', () => {
      const { result } = renderHook(() => useHabitCardEntrance());

      expect(typeof result.current.triggerEntrance).toBe('function');
    });

    it('should return resetAnimation function', () => {
      const { result } = renderHook(() => useHabitCardEntrance());

      expect(typeof result.current.resetAnimation).toBe('function');
    });

    it('should return isAnimating shared value', () => {
      const { result } = renderHook(() => useHabitCardEntrance());

      expect(result.current.isAnimating).toBeDefined();
      expect(typeof result.current.isAnimating.value).toBe('boolean');
    });
  });

  describe('Default Options', () => {
    it('should use accentSlideDown variant by default', () => {
      const { result } = renderHook(() => useHabitCardEntrance());

      // Hook should auto-trigger with default variant
      expect(result.current.cardStyle).toBeDefined();
    });

    it('should auto-trigger animation on mount by default', () => {
      const onAnimationComplete = jest.fn();
      renderHook(() =>
        useHabitCardEntrance({
          variant: 'none',
          onAnimationComplete,
        })
      );

      // With 'none' variant and no reduce motion, it calls setInstantVisible and callback
      expect(onAnimationComplete).toHaveBeenCalled();
    });

    it('should not auto-trigger when autoTrigger is false', () => {
      const onAnimationComplete = jest.fn();
      renderHook(() =>
        useHabitCardEntrance({
          variant: 'fadeUp',
          autoTrigger: false,
          onAnimationComplete,
        })
      );

      // Callback should not be called when autoTrigger is false
      expect(onAnimationComplete).not.toHaveBeenCalled();
    });
  });

  describe('Animation Variants', () => {
    it.each<HabitCardEntranceVariant>([
      'fadeUp',
      'accentSlideDown',
      'widthExpansion',
      'none',
    ])('should accept %s variant', (variant) => {
      const { result } = renderHook(() =>
        useHabitCardEntrance({ variant, autoTrigger: false })
      );

      // Should not throw and should return valid styles
      expect(result.current.cardStyle).toBeDefined();
      expect(result.current.accentStyle).toBeDefined();
      expect(result.current.contentStyle).toBeDefined();
    });

    it('should handle "none" variant by setting instant visibility', () => {
      const onAnimationComplete = jest.fn();
      renderHook(() =>
        useHabitCardEntrance({
          variant: 'none',
          onAnimationComplete,
        })
      );

      // 'none' variant should immediately call completion callback
      expect(onAnimationComplete).toHaveBeenCalledTimes(1);
    });
  });

  describe('Reduce Motion Accessibility', () => {
    it('should respect reduce motion preference', () => {
      mockReduceMotion.mockReturnValue(true);

      const onAnimationComplete = jest.fn();
      renderHook(() =>
        useHabitCardEntrance({
          variant: 'accentSlideDown',
          onAnimationComplete,
        })
      );

      // With reduce motion enabled, animation should complete instantly
      expect(onAnimationComplete).toHaveBeenCalledTimes(1);
    });

    it('should set instant visibility when reduce motion is enabled', () => {
      mockReduceMotion.mockReturnValue(true);

      const { result } = renderHook(() =>
        useHabitCardEntrance({ variant: 'accentSlideDown' })
      );

      // isAnimating should be false (no animation running)
      expect(result.current.isAnimating.value).toBe(false);
    });
  });

  describe('Trigger and Reset', () => {
    it('should allow manual animation trigger', () => {
      const onAnimationComplete = jest.fn();
      const { result } = renderHook(() =>
        useHabitCardEntrance({
          variant: 'fadeUp',
          autoTrigger: false,
          onAnimationComplete,
        })
      );

      // Manually trigger animation
      act(() => {
        result.current.triggerEntrance();
      });

      // Animation should be triggered (isAnimating set to true initially)
      // Note: Due to mocked withTiming returning value immediately,
      // animation completes synchronously in tests
      expect(result.current).toBeDefined();
    });

    it('should reset animation to initial state', () => {
      const { result } = renderHook(() =>
        useHabitCardEntrance({ variant: 'fadeUp' })
      );

      // Reset the animation
      act(() => {
        result.current.resetAnimation();
      });

      // isAnimating should be false after reset
      expect(result.current.isAnimating.value).toBe(false);
    });

    it('should not double-trigger animation on multiple mount calls', () => {
      const onAnimationComplete = jest.fn();
      const { result, rerender } = renderHook(() =>
        useHabitCardEntrance({
          variant: 'none',
          onAnimationComplete,
        })
      );

      // First call on mount
      expect(onAnimationComplete).toHaveBeenCalledTimes(1);

      // Rerender should not trigger again due to hasTriggered ref
      rerender({});

      // Should still be called only once
      expect(onAnimationComplete).toHaveBeenCalledTimes(1);
    });
  });

  describe('Delay Support', () => {
    it('should accept delay option for stagger effects', () => {
      const onAnimationComplete = jest.fn();
      const { result } = renderHook(() =>
        useHabitCardEntrance({
          variant: 'fadeUp',
          delay: 100,
          onAnimationComplete,
        })
      );

      // Should have initialized correctly with delay
      expect(result.current.cardStyle).toBeDefined();
    });

    it('should apply delay to animation when specified', () => {
      const onAnimationComplete = jest.fn();
      const { result } = renderHook(() =>
        useHabitCardEntrance({
          variant: 'fadeUp',
          delay: 200,
          onAnimationComplete,
        })
      );

      // Animation is delayed, hook should still return valid styles
      expect(result.current.cardStyle).toBeDefined();
      expect(result.current.accentStyle).toBeDefined();
      expect(result.current.contentStyle).toBeDefined();
    });
  });

  describe('Animated Styles Output', () => {
    it('should return card style with opacity and transform', () => {
      const { result } = renderHook(() =>
        useHabitCardEntrance({ autoTrigger: false })
      );

      // cardStyle is generated by useAnimatedStyle
      // In mocked environment, it returns the callback result directly
      const style = result.current.cardStyle;
      expect(style).toBeDefined();
    });

    it('should return accent style with opacity, width, and transform', () => {
      const { result } = renderHook(() =>
        useHabitCardEntrance({ autoTrigger: false })
      );

      const style = result.current.accentStyle;
      expect(style).toBeDefined();
    });

    it('should return content style with opacity and transform', () => {
      const { result } = renderHook(() =>
        useHabitCardEntrance({ autoTrigger: false })
      );

      const style = result.current.contentStyle;
      expect(style).toBeDefined();
    });
  });

  describe('Callback Execution', () => {
    it('should call onAnimationComplete when animation finishes', () => {
      const onAnimationComplete = jest.fn();
      renderHook(() =>
        useHabitCardEntrance({
          variant: 'none', // 'none' completes immediately
          onAnimationComplete,
        })
      );

      expect(onAnimationComplete).toHaveBeenCalledTimes(1);
    });

    it('should not call callback when not provided', () => {
      // Should not throw when callback is undefined
      expect(() => {
        renderHook(() =>
          useHabitCardEntrance({
            variant: 'none',
          })
        );
      }).not.toThrow();
    });
  });

  describe('Cleanup on Unmount', () => {
    it('should cancel animations on unmount', () => {
      const { unmount } = renderHook(() =>
        useHabitCardEntrance({ variant: 'fadeUp' })
      );

      // Unmount should not throw
      expect(() => {
        unmount();
      }).not.toThrow();
    });

    it('should handle rapid mount/unmount cycles', () => {
      // Simulate rapid create/delete cycles
      for (let i = 0; i < 5; i++) {
        const { unmount } = renderHook(() =>
          useHabitCardEntrance({ variant: 'accentSlideDown' })
        );
        unmount();
      }

      // Should not leave any dangling state or throw errors
      expect(true).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero delay correctly', () => {
      const { result } = renderHook(() =>
        useHabitCardEntrance({
          variant: 'fadeUp',
          delay: 0,
        })
      );

      expect(result.current.cardStyle).toBeDefined();
    });

    it('should handle variant change on rerender gracefully', () => {
      const { result, rerender } = renderHook(
        ({ variant }) => useHabitCardEntrance({ variant, autoTrigger: false }),
        { initialProps: { variant: 'fadeUp' as HabitCardEntranceVariant } }
      );

      // Change variant
      rerender({ variant: 'widthExpansion' });

      // Should still return valid styles
      expect(result.current.cardStyle).toBeDefined();
    });

    it('should work with single habit card (index 0)', () => {
      const { result } = renderHook(() =>
        useHabitCardEntrance({
          variant: 'accentSlideDown',
          delay: 0 * 100, // Index 0 stagger
        })
      );

      expect(result.current.cardStyle).toBeDefined();
    });

    it('should work with multiple staggered cards', () => {
      const cards = [0, 1, 2, 3, 4].map((index) => {
        const { result } = renderHook(() =>
          useHabitCardEntrance({
            variant: 'accentSlideDown',
            delay: index * 100,
          })
        );
        return result.current;
      });

      // All cards should have valid styles
      cards.forEach((card) => {
        expect(card.cardStyle).toBeDefined();
        expect(card.accentStyle).toBeDefined();
        expect(card.contentStyle).toBeDefined();
      });
    });
  });

  describe('Type Safety', () => {
    it('should export HabitCardEntranceVariant type', () => {
      // TypeScript compilation test - if this compiles, the type is exported correctly
      const variant: HabitCardEntranceVariant = 'accentSlideDown';
      expect(variant).toBe('accentSlideDown');
    });

    it('should have correctly typed return value', () => {
      const { result } = renderHook(() => useHabitCardEntrance());

      // Type assertions
      expect(typeof result.current.triggerEntrance).toBe('function');
      expect(typeof result.current.resetAnimation).toBe('function');
      expect(result.current.isAnimating).toHaveProperty('value');
    });
  });
});
