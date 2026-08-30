/**
 * The recovery path for rows outside the virtualization window: the first
 * failure for a target makes one estimated jump (average row length x
 * index), then every later failure for the same target is an exact ladder
 * rung -- a scroll to the highest measured row -- until the target itself is
 * measured and the precise scroll succeeds.
 */

import {
  createScrollToIndexFallback,
  FALLBACK_MAX_RETRIES,
  FALLBACK_RETRY_MS,
  FOCUS_VIEW_POSITION,
} from '../scrollToIndexFallback';

function makeRef() {
  const scrollToIndex = jest.fn();
  const scrollToOffset = jest.fn();
  const listRef = { current: { scrollToIndex, scrollToOffset } };
  return { listRef, scrollToIndex, scrollToOffset };
}

describe('createScrollToIndexFallback', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('makes one estimated jump on the first failure for a target, then retries the exact index', () => {
    const { listRef, scrollToIndex, scrollToOffset } = makeRef();

    createScrollToIndexFallback(listRef as never)({
      averageItemLength: 90,
      highestMeasuredFrameIndex: -1,
      index: 12,
    });

    expect(scrollToOffset).toHaveBeenCalledWith({
      animated: false,
      offset: 90 * 12,
    });
    expect(scrollToIndex).not.toHaveBeenCalled();

    jest.advanceTimersByTime(FALLBACK_RETRY_MS);

    expect(scrollToIndex).toHaveBeenCalledWith({
      animated: false,
      index: 12,
      viewPosition: FOCUS_VIEW_POSITION,
    });
  });

  it('estimates offset 0 when nothing has been measured yet', () => {
    const { listRef, scrollToOffset } = makeRef();

    createScrollToIndexFallback(listRef as never)({
      averageItemLength: 0,
      highestMeasuredFrameIndex: -1,
      index: 7,
    });

    expect(scrollToOffset).toHaveBeenCalledWith({ animated: false, offset: 0 });
  });

  it('climbs via scrollToIndex at the rung once per distinct rung, and skips the jump when the rung repeats', () => {
    const { listRef, scrollToIndex, scrollToOffset } = makeRef();
    const fallback = createScrollToIndexFallback(listRef as never);

    // First failure for this target: one estimated jump, no rung yet.
    fallback({ averageItemLength: 90, highestMeasuredFrameIndex: -1, index: 50 });
    expect(scrollToOffset).toHaveBeenCalledTimes(1);
    expect(scrollToIndex).not.toHaveBeenCalled();

    // Second failure, same target: climbed to rung 9.
    fallback({ averageItemLength: 90, highestMeasuredFrameIndex: 9, index: 50 });
    expect(scrollToIndex).toHaveBeenCalledTimes(1);
    expect(scrollToIndex).toHaveBeenLastCalledWith({
      animated: false,
      index: 9,
      viewPosition: 0,
    });

    // Same rung again (measurement didn't advance): no repeat jump.
    fallback({ averageItemLength: 90, highestMeasuredFrameIndex: 9, index: 50 });
    expect(scrollToIndex).toHaveBeenCalledTimes(1);

    // Climbed further to rung 20: new jump.
    fallback({ averageItemLength: 90, highestMeasuredFrameIndex: 20, index: 50 });
    expect(scrollToIndex).toHaveBeenCalledTimes(2);
    expect(scrollToIndex).toHaveBeenLastCalledWith({
      animated: false,
      index: 20,
      viewPosition: 0,
    });

    expect(scrollToOffset).toHaveBeenCalledTimes(1);
  });

  it('never climbs past the target index', () => {
    const { listRef, scrollToIndex, scrollToOffset } = makeRef();
    const fallback = createScrollToIndexFallback(listRef as never);

    // First failure: estimated jump only, rung logic hasn't run yet.
    fallback({ averageItemLength: 90, highestMeasuredFrameIndex: 100, index: 5 });
    expect(scrollToOffset).toHaveBeenCalledTimes(1);
    expect(scrollToIndex).not.toHaveBeenCalled();

    // Second failure, same target: the measured frame (100) is past the
    // target (5), so the rung clamps to the target instead of overshooting.
    fallback({ averageItemLength: 90, highestMeasuredFrameIndex: 100, index: 5 });
    expect(scrollToIndex).toHaveBeenCalledWith({
      animated: false,
      index: 5,
      viewPosition: 0,
    });
  });

  it('stops scheduling retries after the cap', () => {
    const { listRef, scrollToIndex, scrollToOffset } = makeRef();
    const fallback = createScrollToIndexFallback(listRef as never);

    for (let i = 0; i < FALLBACK_MAX_RETRIES + 5; i++) {
      fallback({ averageItemLength: 90, highestMeasuredFrameIndex: -1, index: 12 });
      jest.advanceTimersByTime(FALLBACK_RETRY_MS);
    }

    // Call 0 is the estimated jump (retries === 0); every later call before
    // the cap is a rung. highestMeasuredFrameIndex never advances, so the
    // rung (0) only produces a new jump once (call 1, from lastRung -1 -> 0);
    // every rung after that repeats and is skipped.
    expect(scrollToOffset).toHaveBeenCalledTimes(1);
    // The 120ms retry-to-target fires for every call up to and including
    // retries === FALLBACK_MAX_RETRIES (FALLBACK_MAX_RETRIES + 1 calls: 0.28),
    // then the cap-triggering call returns before scheduling it. Add the one
    // extra rung jump from call 1.
    expect(scrollToIndex).toHaveBeenCalledTimes(FALLBACK_MAX_RETRIES + 2);
  });

  it('resets the ladder when the target index changes', () => {
    const { listRef, scrollToIndex, scrollToOffset } = makeRef();
    const fallback = createScrollToIndexFallback(listRef as never);

    fallback({ averageItemLength: 90, highestMeasuredFrameIndex: -1, index: 12 });
    fallback({ averageItemLength: 90, highestMeasuredFrameIndex: 5, index: 12 });
    expect(scrollToOffset).toHaveBeenCalledTimes(1);
    expect(scrollToIndex).toHaveBeenCalledTimes(1);

    // A different target starts the ladder over: retries resets to 0, so the
    // fresh-start estimated jump fires again instead of a rung.
    fallback({ averageItemLength: 90, highestMeasuredFrameIndex: -1, index: 40 });

    expect(scrollToOffset).toHaveBeenCalledTimes(2);
    expect(scrollToOffset).toHaveBeenLastCalledWith({
      animated: false,
      offset: 90 * 40,
    });
    // No new scrollToIndex rung jump on this reset call (retries === 0).
    expect(scrollToIndex).toHaveBeenCalledTimes(1);
  });

  it('calls onFallback every time, including on the cap-triggering call', () => {
    const { listRef } = makeRef();
    const onFallback = jest.fn();
    const fallback = createScrollToIndexFallback(listRef as never, onFallback);

    for (let i = 0; i < FALLBACK_MAX_RETRIES + 3; i++) {
      fallback({ averageItemLength: 90, highestMeasuredFrameIndex: -1, index: 12 });
    }

    expect(onFallback).toHaveBeenCalledTimes(FALLBACK_MAX_RETRIES + 3);
  });

  it('does nothing when the list is gone', () => {
    const listRef = { current: null };
    expect(() =>
      createScrollToIndexFallback(listRef as never)({
        averageItemLength: 90,
        highestMeasuredFrameIndex: -1,
        index: 3,
      })
    ).not.toThrow();
  });

  it('swallows a retry that still cannot resolve the index', () => {
    const { listRef, scrollToIndex } = makeRef();
    scrollToIndex.mockImplementation(() => {
      throw new Error('scrollToIndex out of range');
    });

    createScrollToIndexFallback(listRef as never)({
      averageItemLength: 90,
      highestMeasuredFrameIndex: 5,
      index: 12,
    });

    expect(() => jest.advanceTimersByTime(FALLBACK_RETRY_MS)).not.toThrow();
  });
});
