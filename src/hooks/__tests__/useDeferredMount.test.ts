/**
 * useDeferredMount Hook Tests
 */

import { renderHook, act } from '@testing-library/react-native';
import { InteractionManager } from 'react-native';
import {
  resetDeferredMountLatches,
  useDeferredMount,
} from '../useDeferredMount';

/**
 * Runs the queued InteractionManager callback and the rAF that chases it.
 * They land on separate timer ticks, so a single flush is not enough.
 */
function settleInteractions() {
  act(() => {
    jest.runOnlyPendingTimers();
  });
  act(() => {
    jest.runOnlyPendingTimers();
  });
}

describe('useDeferredMount', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    resetDeferredMountLatches();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('starts false and flips true after interactions settle', () => {
    const { result } = renderHook(() => useDeferredMount());

    expect(result.current).toBe(false);

    settleInteractions();

    expect(result.current).toBe(true);
  });

  it('replays the deferral on remount when no latchKey is given', () => {
    const first = renderHook(() => useDeferredMount());
    settleInteractions();
    expect(first.result.current).toBe(true);
    first.unmount();

    const second = renderHook(() => useDeferredMount());

    expect(second.result.current).toBe(false);
  });

  it('returns true on the first render of a remount once the key is latched', () => {
    const first = renderHook(() =>
      useDeferredMount({ latchKey: 'SettingsModal' })
    );
    expect(first.result.current).toBe(false);
    settleInteractions();
    expect(first.result.current).toBe(true);
    first.unmount();

    const spy = jest.spyOn(InteractionManager, 'runAfterInteractions');
    const second = renderHook(() =>
      useDeferredMount({ latchKey: 'SettingsModal' })
    );

    expect(second.result.current).toBe(true);
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('keeps latches separate per key', () => {
    const settings = renderHook(() =>
      useDeferredMount({ latchKey: 'SettingsModal' })
    );
    settleInteractions();
    settings.unmount();

    const other = renderHook(() => useDeferredMount({ latchKey: 'Templates' }));

    expect(other.result.current).toBe(false);
  });

  it('does not latch when the deferral is cancelled before it resolves', () => {
    const first = renderHook(() =>
      useDeferredMount({ latchKey: 'SettingsModal' })
    );
    first.unmount();

    const second = renderHook(() =>
      useDeferredMount({ latchKey: 'SettingsModal' })
    );

    expect(second.result.current).toBe(false);
  });
});
