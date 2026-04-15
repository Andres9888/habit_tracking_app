import AsyncStorage from '@react-native-async-storage/async-storage';
import { renderHook, waitFor } from '@testing-library/react-native';

import { ONBOARDING_KEY } from './onboarding.data';
import { useOnboardingStatus } from './useOnboardingStatus';

jest.mock('@react-native-async-storage/async-storage');

describe('useOnboardingStatus', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('reads onboarding status from storage on sign-in', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    const { result } = renderHook(() => useOnboardingStatus(true));

    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(ONBOARDING_KEY);
    });

    // New user (no stored value) → not complete, shown onboarding
    await waitFor(() => {
      expect(result.current.complete).toBe(false);
    });
  });

  it('marks returning user as complete', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('true');

    const { result } = renderHook(() => useOnboardingStatus(true));

    await waitFor(() => {
      expect(result.current.complete).toBe(true);
    });
  });

  it('does not access storage when the user is signed out', () => {
    renderHook(() => useOnboardingStatus(false));

    expect(AsyncStorage.getItem).not.toHaveBeenCalled();
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });
});
