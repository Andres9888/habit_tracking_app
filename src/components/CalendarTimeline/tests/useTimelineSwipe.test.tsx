import { renderHook } from '@testing-library/react-native';

import { useTimelineSwipe } from '../useTimelineSwipe';

type EndHandler = (event: { translationX: number; velocityX: number }) => void;

function getOnEndHandler(
  props: Parameters<typeof useTimelineSwipe>[0]
): EndHandler {
  const { result } = renderHook(() => useTimelineSwipe(props));
  return result.current.onEnd.mock.calls[0][0] as EndHandler;
}

describe('useTimelineSwipe', () => {
  it('navigates forward on a left swipe when forward navigation is enabled', () => {
    const onNextWeek = jest.fn();
    const onEnd = getOnEndHandler({ canNavigateForward: true, onNextWeek });

    onEnd({ translationX: -80, velocityX: 0 });

    expect(onNextWeek).toHaveBeenCalledTimes(1);
  });

  it('navigates forward on a fast left swipe', () => {
    const onNextWeek = jest.fn();
    const onEnd = getOnEndHandler({ canNavigateForward: true, onNextWeek });

    onEnd({ translationX: 0, velocityX: -600 });

    expect(onNextWeek).toHaveBeenCalledTimes(1);
  });

  it('does not navigate forward on a left swipe when forward navigation is disabled', () => {
    const onNextWeek = jest.fn();
    const onEnd = getOnEndHandler({ canNavigateForward: false, onNextWeek });

    onEnd({ translationX: -80, velocityX: 0 });

    expect(onNextWeek).not.toHaveBeenCalled();
  });

  it('navigates backward on a right swipe', () => {
    const onPreviousWeek = jest.fn();
    const onEnd = getOnEndHandler({
      canNavigateForward: false,
      onPreviousWeek,
    });

    onEnd({ translationX: 80, velocityX: 0 });

    expect(onPreviousWeek).toHaveBeenCalledTimes(1);
  });

  it('ignores movement below the swipe threshold', () => {
    const onNextWeek = jest.fn();
    const onPreviousWeek = jest.fn();
    const onEnd = getOnEndHandler({
      canNavigateForward: true,
      onNextWeek,
      onPreviousWeek,
    });

    onEnd({ translationX: 20, velocityX: 100 });

    expect(onNextWeek).not.toHaveBeenCalled();
    expect(onPreviousWeek).not.toHaveBeenCalled();
  });
});
