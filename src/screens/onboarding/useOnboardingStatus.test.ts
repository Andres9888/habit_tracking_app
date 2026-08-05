import AsyncStorage from '@react-native-async-storage/async-storage';
import { renderHook, waitFor } from '@testing-library/react-native';

import { ONBOARDING_KEY } from './onboarding.data';
import { useOnboardingStatus } from './useOnboardingStatus';

jest.mock('@react-native-async-storage/async-storage');

describe('useOnboardingStatus', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('uses the shared onboarding storage key for reads and writes', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    const { result } = renderHook(() => useOnboardingStatus(true));

    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(ONBOARDING_KEY);
    });

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(ONBOARDING_KEY, 'true');
    });

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
