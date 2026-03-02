/**
 * Tests for ReminderOptionButton useButtonAnimations hook
 * Verifies reanimated migration: shared values, spring animations, reduced motion
 */

import { renderHook, act } from '@testing-library/react-native';
import { useButtonAnimations } from '../ReminderSelector/useButtonAnimations';
import { CARD_PRESS_SCALE } from '../../../../utils/animations/cardPressAnimation';

describe('useButtonAnimations', () => {
  it('should initialize with default scale=1 and slide=0', () => {
    const { result } = renderHook(() => useButtonAnimations(false));

    expect(result.current.scale.value).toBe(1);
    expect(result.current.slide.value).toBe(0);
  });

  it('should animate scale on press in', () => {
    const { result } = renderHook(() => useButtonAnimations(false));

    act(() => {
      result.current.handlePressIn();
    });

    // Mock withSpring returns the target value directly
    expect(result.current.scale.value).toBe(CARD_PRESS_SCALE);
  });

  it('should animate scale back and slide on press out', () => {
    const { result } = renderHook(() => useButtonAnimations(false));

    act(() => {
      result.current.handlePressIn();
    });

    act(() => {
      result.current.handlePressOut();
    });

    // Mock: withSpring(1) returns 1, withSequence returns last value (0)
    expect(result.current.scale.value).toBe(1);
    expect(result.current.slide.value).toBe(0);
  });

  describe('reduced motion', () => {
    it('should not animate on press in when reduceMotion is true', () => {
      const { result } = renderHook(() => useButtonAnimations(true));

      act(() => {
        result.current.handlePressIn();
      });

      expect(result.current.scale.value).toBe(1);
    });

    it('should reset values directly on press out when reduceMotion is true', () => {
      const { result } = renderHook(() => useButtonAnimations(true));

      act(() => {
        result.current.handlePressOut();
      });

      expect(result.current.scale.value).toBe(1);
      expect(result.current.slide.value).toBe(0);
    });
  });

  it('should return handlers as functions', () => {
    const { result } = renderHook(() => useButtonAnimations(false));

    expect(typeof result.current.handlePressIn).toBe('function');
    expect(typeof result.current.handlePressOut).toBe('function');
  });
});
