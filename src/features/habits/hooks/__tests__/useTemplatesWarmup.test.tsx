import { act, renderHook } from '@testing-library/react-native';

jest.mock('../../../../contexts/NetworkStatusContext', () => ({
  useNetworkStatus: jest.fn(),
}));
jest.mock('../../../../lib/queryCache', () => ({
  useCachedQuery: jest.fn(),
  useCachedQuerySavedAt: jest.fn(),
}));
jest.mock('../../../../lib/timing/scheduleWhenIdle', () => ({
  scheduleWhenIdle: jest.fn(() => jest.fn()),
}));

import { useNetworkStatus } from '../../../../contexts/NetworkStatusContext';
import {
  useCachedQuery,
  useCachedQuerySavedAt,
} from '../../../../lib/queryCache';
import { scheduleWhenIdle } from '../../../../lib/timing/scheduleWhenIdle';
import {
  isTemplateCacheFresh,
  useTemplatesWarmup,
} from '../useTemplatesWarmup';

const mockNetworkStatus = jest.mocked(useNetworkStatus);
const mockCachedQuery = jest.mocked(useCachedQuery);
const mockSavedAt = jest.mocked(useCachedQuerySavedAt);
const mockScheduleWhenIdle = jest.mocked(scheduleWhenIdle);

function expectTemplateQueriesUseArgs(args: {} | 'skip'): void {
  expect(mockCachedQuery).toHaveBeenCalledTimes(2);
  expect(mockCachedQuery).toHaveBeenNthCalledWith(1, expect.anything(), args, {
    entryName: 'templates.list',
  });
  expect(mockCachedQuery).toHaveBeenNthCalledWith(2, expect.anything(), args, {
    entryName: 'templates.getImportedTemplateIds',
  });
}

function setNetwork(isOnline = true, isExpensive = false): void {
  mockNetworkStatus.mockReturnValue({
    isChecking: false,
    isOnline,
    status: { isExpensive },
  } as ReturnType<typeof useNetworkStatus>);
}

describe('useTemplatesWarmup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setNetwork();
    mockSavedAt.mockReturnValue(undefined);
  });

  it('waits for home readiness and an idle callback before subscribing', () => {
    const { rerender } = renderHook(
      ({ homeReady }) => useTemplatesWarmup({ homeReady }),
      { initialProps: { homeReady: false } }
    );
    expectTemplateQueriesUseArgs('skip');

    mockCachedQuery.mockClear();
    rerender({ homeReady: true });
    expect(mockScheduleWhenIdle).toHaveBeenCalledTimes(1);
    expectTemplateQueriesUseArgs('skip');

    mockCachedQuery.mockClear();
    const idleTask = mockScheduleWhenIdle.mock.calls[0]?.[0];
    act(() => idleTask?.());
    expectTemplateQueriesUseArgs({});
  });

  it('does not warm while checking, offline, on expensive connections, or with fresh cache', () => {
    mockNetworkStatus.mockReturnValue({
      isChecking: true,
      isOnline: true,
      status: { isExpensive: false },
    } as ReturnType<typeof useNetworkStatus>);
    const { rerender } = renderHook(
      ({ homeReady }) => useTemplatesWarmup({ homeReady }),
      { initialProps: { homeReady: true } }
    );
    expect(mockScheduleWhenIdle).not.toHaveBeenCalled();

    setNetwork(false);
    rerender({ homeReady: true });
    expect(mockScheduleWhenIdle).not.toHaveBeenCalled();

    setNetwork(true, true);
    rerender({ homeReady: true });
    expect(mockScheduleWhenIdle).not.toHaveBeenCalled();

    setNetwork();
    mockSavedAt.mockReturnValue(Date.now());
    rerender({ homeReady: true });
    expect(mockScheduleWhenIdle).not.toHaveBeenCalled();
  });

  it('warms when either required cache entry is stale', () => {
    const now = Date.now();
    mockSavedAt.mockReturnValueOnce(now).mockReturnValueOnce(undefined);

    renderHook(() => useTemplatesWarmup({ homeReady: true }));

    expect(mockSavedAt).toHaveBeenNthCalledWith(
      1,
      'templates.list',
      {},
      { fallbackToLatest: true }
    );
    expect(mockSavedAt).toHaveBeenNthCalledWith(
      2,
      'templates.getImportedTemplateIds',
      {},
      { fallbackToLatest: true }
    );
    expect(mockScheduleWhenIdle).toHaveBeenCalledTimes(1);
  });

  it('cancels scheduled warmup when readiness or connection cost changes before idle', () => {
    const cancelIdle = jest.fn();
    mockScheduleWhenIdle.mockReturnValueOnce(cancelIdle);

    const { rerender } = renderHook(
      ({ homeReady }) => useTemplatesWarmup({ homeReady }),
      { initialProps: { homeReady: true } }
    );
    expect(mockScheduleWhenIdle).toHaveBeenCalledTimes(1);

    rerender({ homeReady: false });
    expect(cancelIdle).toHaveBeenCalledTimes(1);

    const cancelExpensiveIdle = jest.fn();
    mockScheduleWhenIdle.mockReturnValueOnce(cancelExpensiveIdle);
    rerender({ homeReady: true });
    expect(mockScheduleWhenIdle).toHaveBeenCalledTimes(2);

    setNetwork(true, true);
    rerender({ homeReady: true });
    expect(cancelExpensiveIdle).toHaveBeenCalledTimes(1);
  });

  it('treats cache entries as fresh for six hours', () => {
    const now = 10 * 60 * 60 * 1000;
    expect(isTemplateCacheFresh(now - 5 * 60 * 60 * 1000, now)).toBe(true);
    expect(isTemplateCacheFresh(now - 7 * 60 * 60 * 1000, now)).toBe(false);
  });
});
