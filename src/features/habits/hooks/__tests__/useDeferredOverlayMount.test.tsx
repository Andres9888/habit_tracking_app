import { act, renderHook } from '@testing-library/react-native';

jest.mock('../../../../lib/timing/scheduleWhenIdle', () => ({
  scheduleWhenIdle: jest.fn(() => jest.fn()),
}));

import { scheduleWhenIdle } from '../../../../lib/timing/scheduleWhenIdle';
import { useDeferredOverlayMount } from '../useDeferredOverlayMount';

const mockScheduleWhenIdle = jest.mocked(scheduleWhenIdle);

describe('useDeferredOverlayMount', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('waits for home readiness and idle time', () => {
    const { result, rerender } = renderHook(
      (props) => useDeferredOverlayMount(props),
      { initialProps: { homeReady: false, requested: false } }
    );

    expect(result.current).toBe(false);
    expect(mockScheduleWhenIdle).not.toHaveBeenCalled();

    rerender({ homeReady: true, requested: false });
    expect(mockScheduleWhenIdle).toHaveBeenCalledTimes(1);
    expect(result.current).toBe(false);

    act(() => mockScheduleWhenIdle.mock.calls[0]?.[0]());
    expect(result.current).toBe(true);
  });

  it('mounts immediately on user intent and stays mounted', () => {
    const { result, rerender } = renderHook(
      (props) => useDeferredOverlayMount(props),
      { initialProps: { homeReady: false, requested: false } }
    );

    rerender({ homeReady: false, requested: true });
    expect(result.current).toBe(true);

    rerender({ homeReady: false, requested: false });
    expect(result.current).toBe(true);
  });
});
