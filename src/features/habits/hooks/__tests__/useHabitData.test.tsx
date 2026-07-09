import { renderHook } from '@testing-library/react-native';

import { useCachedQuery } from '../../../../lib/queryCache';
import { useHabitData } from '../useHabitData';

jest.mock('../../../../lib/queryCache', () => ({
  useCachedQuery: jest.fn(),
}));

describe('useHabitData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useCachedQuery as jest.Mock).mockReturnValue(undefined);
  });

  it('skips tracking when the date list is empty', () => {
    renderHook(() => useHabitData([]));

    expect(useCachedQuery).toHaveBeenNthCalledWith(
      3,
      expect.anything(),
      'skip',
      { entryName: 'habits.getTracking', fallbackToLatest: false }
    );
  });

  it('orders range endpoints before querying tracking', () => {
    renderHook(() => useHabitData(['2026-07-07', '2026-07-01']));

    expect(useCachedQuery).toHaveBeenNthCalledWith(
      3,
      expect.anything(),
      { endDate: '2026-07-07', startDate: '2026-07-01' },
      { entryName: 'habits.getTracking', fallbackToLatest: false }
    );
  });
});
