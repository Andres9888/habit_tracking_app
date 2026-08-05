import { act, renderHook } from '@testing-library/react-native';

import { useWarmMountWindow } from './useWarmMountWindow';

describe('useWarmMountWindow', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('opens one idle warm window and closes it after four seconds', () => {
    const { result } = renderHook(() => useWarmMountWindow(false));

    expect(result.current).toBe(false);

    act(() => jest.advanceTimersByTime(120));
    expect(result.current).toBe(true);

    act(() => jest.advanceTimersByTime(3999));
    expect(result.current).toBe(true);

    act(() => jest.advanceTimersByTime(1));
    expect(result.current).toBe(false);
  });

  it('consumes the warm window when the real modal opens first', () => {
    const { result, rerender } = renderHook(
      ({ visible }) => useWarmMountWindow(visible),
      { initialProps: { visible: false } }
    );

    rerender({ visible: true });
    rerender({ visible: false });
    act(() => jest.advanceTimersByTime(5000));

    expect(result.current).toBe(false);
  });

  it('ends an active warm window immediately when the modal opens', () => {
    const { result, rerender } = renderHook(
      ({ visible }) => useWarmMountWindow(visible),
      { initialProps: { visible: false } }
    );

    act(() => jest.advanceTimersByTime(120));
    expect(result.current).toBe(true);

    rerender({ visible: true });
    expect(result.current).toBe(false);

    rerender({ visible: false });
    act(() => jest.advanceTimersByTime(5000));
    expect(result.current).toBe(false);
  });
});
