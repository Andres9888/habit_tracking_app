import { renderHook } from '@testing-library/react-native';

import type { HabitTrackingEntry } from '../../types';
import { useHabitsTracking } from '../useHabitsTracking';
import { useModalTracking } from '../useModalTracking';

jest.mock('../useHabitsTracking', () => ({
  useHabitsTracking: jest.fn(() => ({})),
}));

const mockUseHabitsTracking = jest.mocked(useHabitsTracking);
const fallbackTracking = [
  { marker: 'home-window' },
] as unknown as HabitTrackingEntry[];

describe('useModalTracking', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not request extended history before a detail view opens', () => {
    renderHook(() =>
      useModalTracking({
        fallbackTracking,
        isExtendedViewVisible: false,
      })
    );

    expect(mockUseHabitsTracking).toHaveBeenLastCalledWith(
      [],
      expect.any(Date),
      {
        enabled: false,
        fallbackToLatest: false,
        fallbackTracking,
        windowBufferDays: 0,
      }
    );
  });

  it('loads a year on first open and retains it after close', () => {
    const { rerender } = renderHook(
      ({ visible }) =>
        useModalTracking({
          fallbackTracking,
          isExtendedViewVisible: visible,
        }),
      { initialProps: { visible: false } }
    );

    rerender({ visible: true });
    expect(mockUseHabitsTracking.mock.lastCall?.[0]).toHaveLength(365);
    expect(mockUseHabitsTracking.mock.lastCall?.[2]?.enabled).toBe(true);

    rerender({ visible: false });
    expect(mockUseHabitsTracking.mock.lastCall?.[0]).toHaveLength(365);
    expect(mockUseHabitsTracking.mock.lastCall?.[2]?.enabled).toBe(true);
  });
});
