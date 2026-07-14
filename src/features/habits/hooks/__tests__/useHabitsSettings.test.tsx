import { renderHook } from '@testing-library/react-native';
import { useQuery } from 'convex/react';

import { DEFAULT_SETTINGS } from '../../../../../convex/settings/types';
import type { HabitSettings } from '../../types';
import { useHabitsSettings } from '../useHabitsSettings';

jest.mock('convex/react', () => ({
  useQuery: jest.fn(),
}));

const mockUseQuery = jest.mocked(useQuery);
const settings = DEFAULT_SETTINGS as unknown as HabitSettings;

describe('useHabitsSettings', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseQuery.mockReturnValue(undefined);
  });

  it('reuses home settings and skips the archive count while closed', () => {
    const { result } = renderHook(() =>
      useHabitsSettings({
        settings,
        shouldLoadArchivedCount: false,
      })
    );

    expect(mockUseQuery).toHaveBeenLastCalledWith(expect.anything(), 'skip');
    expect(result.current.settings).toBe(settings);
    expect(result.current.archivedHabitsCount).toBe(0);
    expect(result.current.isSettingsModalLoading).toBe(false);
  });

  it('loads only the archived count when settings opens', () => {
    mockUseQuery.mockReturnValue(4);

    const { result } = renderHook(() =>
      useHabitsSettings({
        settings,
        shouldLoadArchivedCount: true,
      })
    );

    expect(mockUseQuery).toHaveBeenLastCalledWith(expect.anything(), {});
    expect(result.current.archivedHabitsCount).toBe(4);
    expect(result.current.isSettingsModalLoading).toBe(false);
  });

  it('keeps the Settings modal loading while the archived count is unresolved', () => {
    const { result } = renderHook(() =>
      useHabitsSettings({
        settings,
        shouldLoadArchivedCount: true,
      })
    );

    expect(mockUseQuery).toHaveBeenLastCalledWith(expect.anything(), {});
    expect(result.current.archivedHabitsCount).toBe(0);
    expect(result.current.isSettingsModalLoading).toBe(true);
  });

  it('keeps the Settings modal loading until home settings are available', () => {
    mockUseQuery.mockReturnValue(0);

    const { result } = renderHook(() =>
      useHabitsSettings({
        settings: undefined,
        shouldLoadArchivedCount: true,
      })
    );

    expect(result.current.isSettingsModalLoading).toBe(true);
  });
});
