import { act, renderHook } from '@testing-library/react-native';

import { EXIT_DURATIONS } from '../../../../../components/Modal/Modal.constants';
import { useRetainedModalMount } from '../useRetainedModalMount';

describe('useRetainedModalMount', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('does not mount an inactive modal section', () => {
    const { result } = renderHook(() => useRetainedModalMount(false));
    expect(result.current).toBe(false);
  });

  it('mounts immediately and remains through the exit-animation window', () => {
    const { result, rerender } = renderHook(
      ({ active }) => useRetainedModalMount(active),
      { initialProps: { active: false } }
    );

    rerender({ active: true });
    expect(result.current).toBe(true);

    rerender({ active: false });
    expect(result.current).toBe(true);

    act(() => {
      jest.advanceTimersByTime(
        Math.max(EXIT_DURATIONS.bottomSheet, EXIT_DURATIONS.fullScreen)
      );
    });
    expect(result.current).toBe(false);
  });
});
