/**
 * Tests for useWhatsNew hook
 */

import { renderHook, act, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useWhatsNew } from '../useWhatsNew';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

const mockGetItem = AsyncStorage.getItem as jest.Mock;
const mockSetItem = AsyncStorage.setItem as jest.Mock;

describe('useWhatsNew', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetItem.mockResolvedValue(null);
    mockSetItem.mockResolvedValue(undefined);
  });

  it('shows modal when no version has been dismissed', async () => {
    const { result } = renderHook(() => useWhatsNew());

    await waitFor(() => {
      expect(result.current.visible).toBe(true);
    });
    expect(result.current.changelog).toBeDefined();
  });

  it('hides modal when current version was already dismissed', async () => {
    mockGetItem.mockResolvedValue('1.0.0');

    const { result } = renderHook(() => useWhatsNew());

    // Should stay false
    await waitFor(() => {
      expect(mockGetItem).toHaveBeenCalled();
    });
    expect(result.current.visible).toBe(false);
  });

  it('stores version in AsyncStorage on dismiss', async () => {
    const { result } = renderHook(() => useWhatsNew());

    await waitFor(() => {
      expect(result.current.visible).toBe(true);
    });

    await act(async () => {
      await result.current.dismiss();
    });

    expect(result.current.visible).toBe(false);
    expect(mockSetItem).toHaveBeenCalledWith(
      '@chainday/whats_new_dismissed_version',
      '1.0.0'
    );
  });
});
