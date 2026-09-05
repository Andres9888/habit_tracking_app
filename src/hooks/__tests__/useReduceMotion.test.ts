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
  let isEnabledSpy: jest.SpyInstance;
  let addListenerSpy: jest.SpyInstance;

  beforeEach(() => {
    __resetReduceMotionStoreForTests();
    changeHandlers = [];
    isEnabledSpy = jest
      .spyOn(AccessibilityInfo, 'isReduceMotionEnabled')
      .mockResolvedValue(false);
    const addListenerImpl = (_event: string, handler: ChangeHandler) => {
      changeHandlers.push(handler);
      return { remove: () => undefined };
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
});
