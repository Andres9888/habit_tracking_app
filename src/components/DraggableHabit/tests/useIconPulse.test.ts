/**
 * useIconPulse Hook Tests
 *
 * Verifies the icon pulse loop starts when week is complete,
 * stops on cleanup, and respects reduce-motion preference.
 */

import { renderHook, act } from '@testing-library/react-native';
import { Animated } from 'react-native';
import { useIconPulse } from '../useIconPulse';

const loopSpy = jest.spyOn(Animated, 'loop');

describe('useIconPulse', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should start pulse loop when week is complete', () => {
    const iconPulse = new Animated.Value(1);
    renderHook(() => useIconPulse(true, false, iconPulse));

    expect(loopSpy).toHaveBeenCalledTimes(1);
  });

  it('should not start pulse loop when week is incomplete', () => {
    const iconPulse = new Animated.Value(1);
    renderHook(() => useIconPulse(false, false, iconPulse));

    expect(loopSpy).not.toHaveBeenCalled();
  });

  it('should not start pulse loop when reduce motion is enabled', () => {
    const iconPulse = new Animated.Value(1);
    renderHook(() => useIconPulse(true, true, iconPulse));

    expect(loopSpy).not.toHaveBeenCalled();
  });

  it('should reset value to 1 when week is not complete', () => {
    const iconPulse = new Animated.Value(1.05);
    const setValueSpy = jest.spyOn(iconPulse, 'setValue');

    renderHook(() => useIconPulse(false, false, iconPulse));

    expect(setValueSpy).toHaveBeenCalledWith(1);
  });

  it('should stop loop on unmount', () => {
    const iconPulse = new Animated.Value(1);
    const mockStop = jest.fn();

    // Intercept the loop return to inject our spy
    loopSpy.mockImplementationOnce((...args) => {
      const result = Animated.loop.call(Animated, ...args);
      result.stop = mockStop;
      return result;
    });

    // Need to re-spy after mockImplementationOnce since it consumed the spy
    // Actually loopSpy.mockImplementationOnce wraps the original, so let's
    // use a different approach: spy on the returned CompositeAnimation
    loopSpy.mockRestore();
    const freshLoopSpy = jest.spyOn(Animated, 'loop');
    freshLoopSpy.mockReturnValueOnce({
      start: jest.fn(),
      stop: mockStop,
      reset: jest.fn(),
    } as unknown as Animated.CompositeAnimation);

    const { unmount } = renderHook(() => useIconPulse(true, false, iconPulse));

    unmount();

    expect(mockStop).toHaveBeenCalledTimes(1);
    freshLoopSpy.mockRestore();
  });

  it('should stop loop when isWeekComplete changes to false', () => {
    const iconPulse = new Animated.Value(1);
    const mockStop = jest.fn();

    const freshLoopSpy = jest.spyOn(Animated, 'loop');
    freshLoopSpy.mockReturnValueOnce({
      start: jest.fn(),
      stop: mockStop,
      reset: jest.fn(),
    } as unknown as Animated.CompositeAnimation);

    const { rerender } = renderHook(
      ({ isComplete }) => useIconPulse(isComplete, false, iconPulse),
      { initialProps: { isComplete: true } }
    );

    act(() => {
      rerender({ isComplete: false });
    });

    expect(mockStop).toHaveBeenCalledTimes(1);
    freshLoopSpy.mockRestore();
  });
});
