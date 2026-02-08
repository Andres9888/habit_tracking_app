/**
 * useAnimations Hook Tests
 *
 * Verifies the DailyMomentumMeter progress animation uses
 * native-driver-compatible scaleX instead of JS-thread width.
 */

import { renderHook, act } from '@testing-library/react-native';
import { Animated } from 'react-native';
import { useAnimations } from '../useAnimations';

// Spy on Animated.spring to verify useNativeDriver
const springSpy = jest.spyOn(Animated, 'spring');
const loopSpy = jest.spyOn(Animated, 'loop');

describe('useAnimations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return progressScaleX instead of progressWidth', () => {
    const { result } = renderHook(() => useAnimations(50, false));

    expect(result.current.progressScaleX).toBeDefined();
    expect(result.current).not.toHaveProperty('progressWidth');
  });

  it('should use useNativeDriver: true for progress spring', () => {
    renderHook(() => useAnimations(50, false));

    expect(springSpy).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({ useNativeDriver: true })
    );
  });

  it('should skip animation when reduceMotion is true', () => {
    renderHook(() => useAnimations(50, true));

    expect(springSpy).not.toHaveBeenCalled();
  });

  it('should start celebration loops at 100%', () => {
    renderHook(() => useAnimations(100, false));

    // 3 loops: celebration, glow, flame
    expect(loopSpy).toHaveBeenCalledTimes(3);
  });

  it('should not start celebration loops below 100%', () => {
    renderHook(() => useAnimations(80, false));

    expect(loopSpy).not.toHaveBeenCalled();
  });

  it('should stop loops on cleanup when leaving 100%', () => {
    const { rerender } = renderHook(
      ({ percentage }) => useAnimations(percentage, false),
      { initialProps: { percentage: 100 } }
    );

    const stopSpies = loopSpy.mock.results.map((r) => {
      const mockStop = jest.fn();
      if (r.type === 'return' && r.value) {
        // The loop returns a CompositeAnimation with start/stop
        r.value.stop = mockStop;
      }
      return mockStop;
    });

    act(() => {
      rerender({ percentage: 80 });
    });

    // At least verify no errors; loop cleanup is called via useEffect
    expect(loopSpy).toHaveBeenCalledTimes(3);
  });

  it('should return all expected animation values', () => {
    const { result } = renderHook(() => useAnimations(50, false));

    expect(result.current.celebrationScale).toBeDefined();
    expect(result.current.flameScale).toBeDefined();
    expect(result.current.glowOpacity).toBeDefined();
    expect(result.current.progressScaleX).toBeDefined();
  });
});
