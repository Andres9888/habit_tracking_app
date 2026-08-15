import { act, renderHook } from '@testing-library/react-native';

import { EXIT_DURATIONS } from './Modal.constants';
import { useModalRenderState } from './useModalRenderState';

describe('useModalRenderState', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('does not fire onHidden on the initial hidden mount', () => {
    const onHidden = jest.fn();
    renderHook(() =>
      useModalRenderState({
        onHidden,
        reduceMotion: false,
        variant: 'fullScreen',
        visible: false,
      })
    );

    expect(onHidden).not.toHaveBeenCalled();
  });

  it('unmounts only after the exit duration, then fires onHidden once', () => {
    const onHidden = jest.fn();
    const { result, rerender } = renderHook(
      ({ visible }: { visible: boolean }) =>
        useModalRenderState({
          onHidden,
          reduceMotion: false,
          variant: 'fullScreen',
          visible,
        }),
      { initialProps: { visible: true } }
    );

    expect(result.current).toBe(true);

    rerender({ visible: false });
    expect(result.current).toBe(true);
    expect(onHidden).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(EXIT_DURATIONS.fullScreen - 1);
    });
    expect(result.current).toBe(true);
    expect(onHidden).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(result.current).toBe(false);
    expect(onHidden).toHaveBeenCalledTimes(1);
  });

  it('fires onHidden after reduce-motion unmount without waiting for the timer', () => {
    const onHidden = jest.fn();
    const { result, rerender } = renderHook(
      ({ visible }: { visible: boolean }) =>
        useModalRenderState({
          onHidden,
          reduceMotion: true,
          variant: 'fullScreen',
          visible,
        }),
      { initialProps: { visible: true } }
    );

    rerender({ visible: false });
    expect(result.current).toBe(false);
    expect(onHidden).toHaveBeenCalledTimes(1);
  });
});
