/**
 * useReduceMotion Hook Tests
 *
 * The hook is backed by a module-level store so the whole app shares one
 * `isReduceMotionEnabled()` read and one `reduceMotionChanged` listener.
 */

import { renderHook, act } from '@testing-library/react-native';
import { AccessibilityInfo } from 'react-native';

import {
  useReduceMotion,
  __resetReduceMotionStoreForTests,
} from '../useReduceMotion';

type ChangeHandler = (enabled: boolean | null) => void;

describe('useReduceMotion', () => {
  let changeHandlers: ChangeHandler[];
  let removeSpies: jest.Mock[];
  let isEnabledSpy: jest.SpyInstance;
  let addListenerSpy: jest.SpyInstance;

  beforeEach(() => {
    __resetReduceMotionStoreForTests();
    changeHandlers = [];
    removeSpies = [];
    isEnabledSpy = jest
      .spyOn(AccessibilityInfo, 'isReduceMotionEnabled')
      .mockResolvedValue(false);
    const addListenerImpl = (_event: string, handler: ChangeHandler) => {
      changeHandlers.push(handler);
      // A real `remove` — the store must actually call it, otherwise the next
      // initialize() double-subscribes.
      const remove = jest.fn();
      removeSpies.push(remove);
      return { remove };
    };
    addListenerSpy = jest
      .spyOn(AccessibilityInfo, 'addEventListener')
      .mockImplementation(addListenerImpl as never);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    __resetReduceMotionStoreForTests();
  });

  it('defaults to false and reflects the system value once it resolves', async () => {
    isEnabledSpy.mockResolvedValue(true);

    const { result } = renderHook(() => useReduceMotion());
    expect(result.current).toBe(false);

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current).toBe(true);
  });

  it('reads the system value once for many subscribers', async () => {
    __resetReduceMotionStoreForTests();
    isEnabledSpy.mockClear();
    addListenerSpy.mockClear();

    const subscribers = [
      renderHook(() => useReduceMotion()),
      renderHook(() => useReduceMotion()),
      renderHook(() => useReduceMotion()),
    ];

    await act(async () => {
      await Promise.resolve();
    });

    expect(isEnabledSpy).toHaveBeenCalledTimes(1);
    expect(addListenerSpy).toHaveBeenCalledTimes(1);
    for (const subscriber of subscribers) subscriber.unmount();
  });

  it('propagates reduceMotionChanged to every subscriber', async () => {
    const first = renderHook(() => useReduceMotion());
    const second = renderHook(() => useReduceMotion());

    await act(async () => {
      await Promise.resolve();
    });

    act(() => {
      for (const handler of changeHandlers) handler(true);
    });

    expect(first.result.current).toBe(true);
    expect(second.result.current).toBe(true);
  });

  it('lets an explicit preference override the system value', async () => {
    isEnabledSpy.mockResolvedValue(true);

    const { result } = renderHook(() => useReduceMotion({ preference: false }));

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current).toBe(false);
  });

  it('falls back to false when the system read rejects', async () => {
    isEnabledSpy.mockRejectedValue(new Error('unavailable'));

    const { result } = renderHook(() => useReduceMotion());

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current).toBe(false);
  });

  it('removes the reduceMotionChanged subscription on reset', async () => {
    // The spies outlive individual cases; count only this case's calls.
    addListenerSpy.mockClear();

    const { unmount } = renderHook(() => useReduceMotion());

    await act(async () => {
      await Promise.resolve();
    });

    expect(addListenerSpy).toHaveBeenCalledTimes(1);
    expect(removeSpies).toHaveLength(1);
    expect(removeSpies[0]).not.toHaveBeenCalled();

    unmount();
    __resetReduceMotionStoreForTests();

    expect(removeSpies[0]).toHaveBeenCalledTimes(1);

    // A fresh initialize() subscribes exactly once more, not twice.
    const next = renderHook(() => useReduceMotion());
    await act(async () => {
      await Promise.resolve();
    });
    expect(addListenerSpy).toHaveBeenCalledTimes(2);
    next.unmount();
  });

  it('ignores a system read that resolves after a reset', async () => {
    let resolveRead: (value: boolean) => void = () => undefined;
    isEnabledSpy.mockImplementation(
      () =>
        new Promise<boolean>((resolve) => {
          resolveRead = resolve;
        })
    );

    const stale = renderHook(() => useReduceMotion());
    stale.unmount();
    __resetReduceMotionStoreForTests();

    // The pre-reset read now settles as `true`. It belongs to the old
    // generation, so it must not publish into the fresh store.
    isEnabledSpy.mockResolvedValue(false);
    const { result } = renderHook(() => useReduceMotion());

    await act(async () => {
      resolveRead(true);
      await Promise.resolve();
    });

    expect(result.current).toBe(false);
  });
});
