jest.mock('expo-constants', () => ({
  __esModule: true,
  default: { executionEnvironment: 'bare' },
  ExecutionEnvironment: { StoreClient: 'storeClient' },
}));
jest.mock('../../lib/timing/scheduleWhenIdle', () => ({
  scheduleWhenIdle: jest.fn(() => jest.fn()),
}));

import { scheduleWhenIdle } from '../../lib/timing/scheduleWhenIdle';
import { schedulePostLaunchAppPreload } from './postLaunchPreload';

const mockScheduleWhenIdle = jest.mocked(scheduleWhenIdle);

describe('schedulePostLaunchAppPreload', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('schedules frequent work first and secondary work after 2.5 seconds', () => {
    schedulePostLaunchAppPreload({ homeReady: true });

    expect(mockScheduleWhenIdle).toHaveBeenCalledTimes(1);
    expect(mockScheduleWhenIdle).toHaveBeenNthCalledWith(
      1,
      expect.any(Function),
      { fallbackDelayMs: 400, timeoutMs: 1500 }
    );

    jest.advanceTimersByTime(2499);
    expect(mockScheduleWhenIdle).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(1);
    expect(mockScheduleWhenIdle).toHaveBeenNthCalledWith(
      2,
      expect.any(Function),
      { fallbackDelayMs: 500, timeoutMs: 2000 }
    );
  });

  it('cancels both preload tiers', () => {
    const cancel = schedulePostLaunchAppPreload({ homeReady: true });
    const cancelFrequent = mockScheduleWhenIdle.mock.results[0]?.value;

    jest.advanceTimersByTime(2500);
    const cancelSecondary = mockScheduleWhenIdle.mock.results[1]?.value;
    cancel();

    expect(cancelFrequent).toHaveBeenCalledTimes(1);
    expect(cancelSecondary).toHaveBeenCalledTimes(1);
  });

  it('does not schedule work before home is ready', () => {
    const cancel = schedulePostLaunchAppPreload({ homeReady: false });

    expect(mockScheduleWhenIdle).not.toHaveBeenCalled();

    jest.advanceTimersByTime(2500);
    expect(mockScheduleWhenIdle).not.toHaveBeenCalled();

    expect(cancel).not.toThrow();
  });

  it('cancels before the secondary tier is scheduled', () => {
    const cancel = schedulePostLaunchAppPreload({ homeReady: true });
    const cancelFrequent = mockScheduleWhenIdle.mock.results[0]?.value;

    cancel();
    jest.advanceTimersByTime(2500);

    expect(cancelFrequent).toHaveBeenCalledTimes(1);
    expect(mockScheduleWhenIdle).toHaveBeenCalledTimes(1);
  });
});
