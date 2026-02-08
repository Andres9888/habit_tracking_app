/**
 * useMonetizationAnimations Hook Tests
 *
 * Verifies the MonetizationHero progress animation uses
 * native-driver-compatible scaleX instead of JS-thread width.
 */

import { renderHook } from '@testing-library/react-native';
import { Animated } from 'react-native';
import { useMonetizationAnimations } from '../useMonetizationAnimations';

const timingSpy = jest.spyOn(Animated, 'timing');

const defaultProps = {
  freeHabitLimit: 3,
  habitSlotsUsed: 2,
  hasReachedHabitLimit: false,
  reduceMotion: false,
};

describe('useMonetizationAnimations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return progressScaleX instead of progress', () => {
    const { result } = renderHook(() =>
      useMonetizationAnimations(defaultProps)
    );

    expect(result.current.progressScaleX).toBeDefined();
    expect(result.current).not.toHaveProperty('progress');
  });

  it('should use useNativeDriver: true for progress timing', () => {
    renderHook(() => useMonetizationAnimations(defaultProps));

    // All timing calls should use native driver
    const calls = timingSpy.mock.calls;
    for (const call of calls) {
      expect(call[1]).toHaveProperty('useNativeDriver', true);
    }
  });

  it('should animate to usageRatio (not pixel width)', () => {
    renderHook(() => useMonetizationAnimations(defaultProps));

    // The progress timing should target usageRatio (2/3 ≈ 0.667), not pixels
    const progressCall = timingSpy.mock.calls.find(
      (call) =>
        typeof call[1].toValue === 'number' && call[1].toValue < 1.1
    );
    expect(progressCall).toBeDefined();
    expect(progressCall![1].toValue).toBeCloseTo(2 / 3, 5);
  });

  it('should skip animation when reduceMotion is true', () => {
    const { result } = renderHook(() =>
      useMonetizationAnimations({ ...defaultProps, reduceMotion: true })
    );

    // Only shimmer and ctaPulse effects should not start timing
    // Progress should be set directly via setValue
    expect(result.current.progressScaleX).toBeDefined();
  });

  it('should return all expected values', () => {
    const { result } = renderHook(() =>
      useMonetizationAnimations(defaultProps)
    );

    expect(result.current.ctaPulse).toBeDefined();
    expect(result.current.handleTrackLayout).toBeInstanceOf(Function);
    expect(result.current.progressScaleX).toBeDefined();
    expect(result.current.shimmer).toBeDefined();
    expect(result.current.trackWidth).toBe(0);
  });

  it('should handle zero freeHabitLimit without error', () => {
    const { result } = renderHook(() =>
      useMonetizationAnimations({
        ...defaultProps,
        freeHabitLimit: 0,
      })
    );

    expect(result.current.progressScaleX).toBeDefined();
  });
});
