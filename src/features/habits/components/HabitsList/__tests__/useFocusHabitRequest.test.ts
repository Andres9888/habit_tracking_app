/**
 * The home-side half of "Go to Today and complete <habit>": place the target
 * while the library covers the list, wait for its neighborhood to lay out,
 * pre-paint the highlight, then reveal the stable list.
 */

import { act, renderHook } from '@testing-library/react-native';
import { AccessibilityInfo } from 'react-native';
import type { Habit } from '../../../types';
import {
  FALLBACK_MAX_RETRIES,
  FALLBACK_RETRY_MS,
  FALLBACK_SETTLE_MS,
  FOCUS_VIEW_POSITION,
} from '../scrollToIndexFallback';
import {
  HIGHLIGHT_PREPAINT_MS,
  MAX_HIDDEN_WAIT_MS,
  RENDER_WINDOW_NUDGE_PX,
  SETTLE_POLL_MS,
  useFocusHabitRequest,
} from '../useFocusHabitRequest';

const TARGET = 'habit-7';
const INSTANT = {
  animated: false,
  index: 7,
  viewPosition: FOCUS_VIEW_POSITION,
};
const CONVERGE_MS = SETTLE_POLL_MS * 2;

function makeHabits(includeTarget: boolean) {
  const habits = Array.from({ length: 12 }, (_, i) => ({
    _id: `habit-${i}`,
    name: `Habit ${i}`,
  })) as unknown as Habit[];
  return includeTarget ? habits : habits.filter((h) => h._id !== TARGET);
}

function setup(overrides: Record<string, unknown> = {}) {
  const scrollToIndex = jest.fn();
  const scrollToOffset = jest.fn();
  const setJustCreatedHabitId = jest.fn();
  const clearPendingFocusHabit = jest.fn();
  const closeLibrary = jest.fn();
  const onFocusReady = jest.fn();
  const options = {
    autoClose: true,
    clearPendingFocusHabit,
    closeLibrary,
    focusReady: false,
    habits: makeHabits(true),
    isFocusNeighborhoodReady: jest.fn(() => true),
    isLibraryOpen: true,
    listRef: {
      current: {
        recordInteraction: jest.fn(),
        scrollToIndex,
        scrollToOffset,
      },
    },
    pendingFocusHabitId: TARGET,
    onFocusReady,
    reduceMotion: false,
    setJustCreatedHabitId,
    ...overrides,
  };
  const view = renderHook(
    (p: typeof options) => useFocusHabitRequest(p as never),
    { initialProps: options }
  );
  return {
    clearPendingFocusHabit,
    closeLibrary,
    onFocusReady,
    options,
    scrollToIndex,
    scrollToOffset,
    setJustCreatedHabitId,
    view,
  };
}

describe('useFocusHabitRequest', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest
      .spyOn(AccessibilityInfo, 'announceForAccessibility')
      .mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('stops fallback retries before the hidden-travel cap expires', () => {
    const fallbackDuration =
      FALLBACK_RETRY_MS * (FALLBACK_MAX_RETRIES + 1);

    expect(fallbackDuration).toBeLessThanOrEqual(MAX_HIDDEN_WAIT_MS);
  });

  it('does nothing without a request', () => {
    const { closeLibrary, scrollToIndex } = setup({
      pendingFocusHabitId: null,
    });

    act(() => jest.advanceTimersByTime(5000));
    expect(scrollToIndex).not.toHaveBeenCalled();
    expect(closeLibrary).not.toHaveBeenCalled();
  });

  it('pre-paints the instant highlight before revealing a stable target', () => {
    const {
      clearPendingFocusHabit,
      closeLibrary,
      scrollToIndex,
      setJustCreatedHabitId,
    } = setup();

    expect(scrollToIndex).toHaveBeenCalledTimes(1);
    expect(scrollToIndex).toHaveBeenLastCalledWith(INSTANT);

    act(() => jest.advanceTimersByTime(SETTLE_POLL_MS));
    expect(setJustCreatedHabitId).not.toHaveBeenCalled();
    expect(closeLibrary).not.toHaveBeenCalled();

    act(() => jest.advanceTimersByTime(SETTLE_POLL_MS));
    expect(setJustCreatedHabitId).toHaveBeenCalledWith(TARGET);
    expect(closeLibrary).not.toHaveBeenCalled();
    expect(scrollToIndex).toHaveBeenLastCalledWith(INSTANT);
    expect(scrollToIndex).not.toHaveBeenCalledWith(
      expect.objectContaining({ animated: true })
    );

    act(() => jest.advanceTimersByTime(HIGHLIGHT_PREPAINT_MS));
    expect(closeLibrary).toHaveBeenCalledTimes(1);
    expect(clearPendingFocusHabit).toHaveBeenCalledTimes(1);
    expect(setJustCreatedHabitId.mock.invocationCallOrder[0]).toBeLessThan(
      closeLibrary.mock.invocationCallOrder[0]
    );
    expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalledWith(
      'Habit 7 added. Showing it in your habits.'
    );
  });

  it('prepares and holds the target highlight without closing or clearing', () => {
    const {
      clearPendingFocusHabit,
      closeLibrary,
      onFocusReady,
      setJustCreatedHabitId,
    } = setup({ autoClose: false });

    act(() => jest.advanceTimersByTime(CONVERGE_MS));

    expect(onFocusReady).toHaveBeenCalledWith(TARGET);
    expect(setJustCreatedHabitId).toHaveBeenCalledWith(TARGET);
    expect(closeLibrary).not.toHaveBeenCalled();
    expect(clearPendingFocusHabit).not.toHaveBeenCalled();
  });

  it('commits a ready target without repeating hidden convergence', () => {
    const {
      clearPendingFocusHabit,
      closeLibrary,
      onFocusReady,
      options,
      scrollToIndex,
      setJustCreatedHabitId,
      view,
    } = setup({ autoClose: false });

    act(() => jest.advanceTimersByTime(CONVERGE_MS));
    expect(onFocusReady).toHaveBeenCalledWith(TARGET);
    const callsAtReady = scrollToIndex.mock.calls.length;

    view.rerender({ ...options, autoClose: true, focusReady: true });
    expect(setJustCreatedHabitId).toHaveBeenCalledWith(TARGET);
    expect(scrollToIndex.mock.calls.length).toBe(callsAtReady);

    act(() => jest.advanceTimersByTime(HIGHLIGHT_PREPAINT_MS));
    expect(closeLibrary).toHaveBeenCalledTimes(1);
    expect(clearPendingFocusHabit).toHaveBeenCalledTimes(1);
  });

  it('keeps the library covered until the focused row and its neighbors are laid out', () => {
    let neighborhoodReady = false;
    const isFocusNeighborhoodReady = jest.fn(() => neighborhoodReady);
    const {
      clearPendingFocusHabit,
      closeLibrary,
      scrollToOffset,
      setJustCreatedHabitId,
    } = setup({
      getScrollOffset: () => 700,
      isFocusNeighborhoodReady,
    });

    act(() => jest.advanceTimersByTime(CONVERGE_MS));
    expect(isFocusNeighborhoodReady).toHaveBeenCalledWith(7);
    expect(setJustCreatedHabitId).not.toHaveBeenCalled();
    expect(closeLibrary).not.toHaveBeenCalled();
    expect(scrollToOffset).toHaveBeenCalledWith({
      animated: false,
      offset: 700 - RENDER_WINDOW_NUDGE_PX,
    });

    neighborhoodReady = true;
    act(() => jest.advanceTimersByTime(SETTLE_POLL_MS));
    expect(setJustCreatedHabitId).toHaveBeenCalledWith(TARGET);
    expect(closeLibrary).not.toHaveBeenCalled();

    act(() => jest.advanceTimersByTime(HIGHLIGHT_PREPAINT_MS));
    expect(closeLibrary).toHaveBeenCalledTimes(1);
    expect(clearPendingFocusHabit).toHaveBeenCalledTimes(1);
  });

  it('does not close a library that is already closed', () => {
    const { closeLibrary, scrollToIndex, setJustCreatedHabitId } = setup({
      isLibraryOpen: false,
    });

    act(() =>
      jest.advanceTimersByTime(CONVERGE_MS + HIGHLIGHT_PREPAINT_MS)
    );
    expect(closeLibrary).not.toHaveBeenCalled();
    expect(setJustCreatedHabitId).toHaveBeenCalledWith(TARGET);
    expect(scrollToIndex).toHaveBeenLastCalledWith(INSTANT);
  });

  it('waits for a habit the subscription has not delivered yet', () => {
    const { closeLibrary, options, scrollToIndex, view } = setup({
      habits: makeHabits(false),
    });

    act(() => jest.advanceTimersByTime(5000));
    expect(scrollToIndex).not.toHaveBeenCalled();
    expect(closeLibrary).not.toHaveBeenCalled();

    view.rerender({ ...options, habits: makeHabits(true) });
    act(() =>
      jest.advanceTimersByTime(CONVERGE_MS + HIGHLIGHT_PREPAINT_MS)
    );
    expect(closeLibrary).toHaveBeenCalledTimes(1);
    expect(scrollToIndex).toHaveBeenLastCalledWith(INSTANT);
  });

  it('leaves the request alone when the habit never appears', () => {
    const { clearPendingFocusHabit, setJustCreatedHabitId } = setup({
      habits: makeHabits(false),
    });

    act(() => jest.advanceTimersByTime(10_000));
    expect(setJustCreatedHabitId).not.toHaveBeenCalled();
    expect(clearPendingFocusHabit).not.toHaveBeenCalled();
  });

  it('uses no visible list scroll under Reduce Motion', () => {
    const { closeLibrary, scrollToIndex, setJustCreatedHabitId } = setup({
      reduceMotion: true,
    });

    act(() =>
      jest.advanceTimersByTime(CONVERGE_MS + HIGHLIGHT_PREPAINT_MS)
    );
    expect(setJustCreatedHabitId).toHaveBeenCalledWith(TARGET);
    expect(closeLibrary).toHaveBeenCalledTimes(1);
    expect(scrollToIndex).not.toHaveBeenCalledWith(
      expect.objectContaining({ animated: true })
    );
  });

  it('still reveals and highlights when scrollToIndex throws', () => {
    const { closeLibrary, scrollToIndex, setJustCreatedHabitId } = setup();
    scrollToIndex.mockImplementation(() => {
      throw new Error('out of range');
    });

    act(() =>
      jest.advanceTimersByTime(CONVERGE_MS + HIGHLIGHT_PREPAINT_MS)
    );
    expect(closeLibrary).toHaveBeenCalledTimes(1);
    expect(setJustCreatedHabitId).toHaveBeenCalledWith(TARGET);
  });

  it('keeps the library covered while a fallback is still settling', () => {
    const fallbackAtRef = { current: 0 };
    const { closeLibrary, setJustCreatedHabitId } = setup({ fallbackAtRef });
    fallbackAtRef.current = Date.now();

    act(() =>
      jest.advanceTimersByTime(
        Math.ceil(FALLBACK_SETTLE_MS / SETTLE_POLL_MS) * SETTLE_POLL_MS
      )
    );
    expect(setJustCreatedHabitId).not.toHaveBeenCalled();
    expect(closeLibrary).not.toHaveBeenCalled();

    act(() => jest.advanceTimersByTime(SETTLE_POLL_MS));
    expect(setJustCreatedHabitId).toHaveBeenCalledWith(TARGET);
    expect(closeLibrary).not.toHaveBeenCalled();

    act(() => jest.advanceTimersByTime(HIGHLIGHT_PREPAINT_MS));
    expect(closeLibrary).toHaveBeenCalledTimes(1);
  });

  it('arms at the scroll cap but still pre-paints before revealing', () => {
    const fallbackAtRef = { current: 0 };
    const scrollToIndex = jest.fn(() => {
      fallbackAtRef.current = Date.now();
    });
    const { closeLibrary, setJustCreatedHabitId } = setup({
      fallbackAtRef,
      listRef: {
        current: {
          recordInteraction: jest.fn(),
          scrollToIndex,
          scrollToOffset: jest.fn(),
        },
      },
    });

    act(() => jest.advanceTimersByTime(MAX_HIDDEN_WAIT_MS));
    expect(setJustCreatedHabitId).toHaveBeenCalledWith(TARGET);
    expect(closeLibrary).not.toHaveBeenCalled();

    act(() => jest.advanceTimersByTime(HIGHLIGHT_PREPAINT_MS));
    expect(closeLibrary).toHaveBeenCalledTimes(1);
  });

  it('clamps a negative offset before the list is revealed', () => {
    const getScrollOffset = jest.fn(() => -40);
    const { closeLibrary, scrollToOffset } = setup({ getScrollOffset });

    act(() => jest.advanceTimersByTime(CONVERGE_MS));
    expect(scrollToOffset).toHaveBeenCalledWith({
      animated: false,
      offset: 0,
    });
    expect(closeLibrary).not.toHaveBeenCalled();

    act(() => jest.advanceTimersByTime(HIGHLIGHT_PREPAINT_MS));
    expect(closeLibrary).toHaveBeenCalledTimes(1);
  });

  it('does not restart an armed request on a habits rerender', () => {
    const {
      closeLibrary,
      options,
      scrollToIndex,
      setJustCreatedHabitId,
      view,
    } = setup();

    act(() => jest.advanceTimersByTime(CONVERGE_MS));
    expect(setJustCreatedHabitId).toHaveBeenCalledTimes(1);
    expect(closeLibrary).not.toHaveBeenCalled();

    view.rerender({ ...options, habits: makeHabits(true).slice() });
    act(() => jest.advanceTimersByTime(HIGHLIGHT_PREPAINT_MS));

    expect(setJustCreatedHabitId).toHaveBeenCalledTimes(1);
    expect(closeLibrary).toHaveBeenCalledTimes(1);
    expect(
      scrollToIndex.mock.calls.filter(([args]) => args.animated === true)
    ).toHaveLength(0);
  });
});
