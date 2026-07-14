import { renderHook } from '@testing-library/react-native';

import { useCachedQuery } from '../../../../lib/queryCache';
import type { HabitTrackingEntry } from '../../types';
import { useHabitsTracking } from '../useHabitsTracking';

jest.mock('../../../../lib/queryCache', () => ({
  useCachedQuery: jest.fn(),
}));

jest.mock('../../../../lib/optimistic', () => ({
  usePendingToggles: () => new Map(),
}));

const mockCachedQuery = jest.mocked(useCachedQuery);
const fallbackTracking = [
  { marker: 'home-window' },
] as unknown as HabitTrackingEntry[];
const extendedTracking = [
  { marker: 'extended-window' },
] as unknown as HabitTrackingEntry[];

describe('useHabitsTracking subscription control', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCachedQuery.mockReturnValue(undefined);
  });

  it('skips the query and surfaces home tracking while disabled', () => {
    const { result } = renderHook(() =>
      useHabitsTracking([], new Date(2026, 6, 13), {
        enabled: false,
        fallbackToLatest: false,
        fallbackTracking,
        windowBufferDays: 0,
      })
    );

    expect(mockCachedQuery).toHaveBeenLastCalledWith(
      expect.anything(),
      'skip',
      { entryName: 'habits.getTracking', fallbackToLatest: false }
    );
    expect(result.current.tracking).toBe(fallbackTracking);
  });

  it('requests the exact extended range and replaces the fallback when ready', () => {
    const dates = ['2026-07-13', '2025-07-14'];
    const { result, rerender } = renderHook(() =>
      useHabitsTracking(dates, new Date(2026, 6, 13), {
        fallbackToLatest: false,
        fallbackTracking,
        windowBufferDays: 0,
      })
    );

    expect(mockCachedQuery).toHaveBeenLastCalledWith(
      expect.anything(),
      { endDate: '2026-07-13', startDate: '2025-07-14' },
      { entryName: 'habits.getTracking', fallbackToLatest: false }
    );
    expect(result.current.tracking).toBe(fallbackTracking);

    mockCachedQuery.mockReturnValue(extendedTracking);
    rerender({});

    expect(result.current.tracking).toBe(extendedTracking);
  });
});
