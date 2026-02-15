/**
 * useDeepLinking Hook Tests
 */

import { renderHook, waitFor } from '@testing-library/react-native';
import * as Linking from 'expo-linking';
import { useDeepLinking } from '../useDeepLinking';

// Mock expo-linking
jest.mock('expo-linking', () => ({
  getInitialURL: jest.fn(),
  addEventListener: jest.fn(),
  parse: jest.fn(),
}));

describe('useDeepLinking', () => {
  const mockHandlers = {
    onOpenHabit: jest.fn(),
    onOpenCreate: jest.fn(),
    onOpenSettings: jest.fn(),
    onOpenTemplates: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (Linking.getInitialURL as jest.Mock).mockResolvedValue(null);
    (Linking.addEventListener as jest.Mock).mockReturnValue({
      remove: jest.fn(),
    });
  });

  it('should handle initial URL on mount', async () => {
    const habitId = 'kg2ar5xj8h7p9q6r5s4t3u2v1w0x';
    (Linking.getInitialURL as jest.Mock).mockResolvedValue(
      `habit-tracker://habit/${habitId}`
    );
    (Linking.parse as jest.Mock).mockReturnValue({
      hostname: 'habit',
      path: `/${habitId}`,
      queryParams: {},
    });

    renderHook(() => useDeepLinking(mockHandlers));

    await waitFor(() => {
      expect(mockHandlers.onOpenHabit).toHaveBeenCalledWith(habitId);
    });
  });

  it('should handle create habit URL', async () => {
    (Linking.getInitialURL as jest.Mock).mockResolvedValue(
      'habit-tracker://create'
    );
    (Linking.parse as jest.Mock).mockReturnValue({
      hostname: 'create',
      path: '',
      queryParams: {},
    });

    renderHook(() => useDeepLinking(mockHandlers));

    await waitFor(() => {
      expect(mockHandlers.onOpenCreate).toHaveBeenCalled();
    });
  });

  it('should handle settings URL', async () => {
    (Linking.getInitialURL as jest.Mock).mockResolvedValue(
      'habit-tracker://settings'
    );
    (Linking.parse as jest.Mock).mockReturnValue({
      hostname: 'settings',
      path: '',
      queryParams: {},
    });

    renderHook(() => useDeepLinking(mockHandlers));

    await waitFor(() => {
      expect(mockHandlers.onOpenSettings).toHaveBeenCalled();
    });
  });

  it('should handle templates URL', async () => {
    (Linking.getInitialURL as jest.Mock).mockResolvedValue(
      'habit-tracker://templates'
    );
    (Linking.parse as jest.Mock).mockReturnValue({
      hostname: 'templates',
      path: '',
      queryParams: {},
    });

    renderHook(() => useDeepLinking(mockHandlers));

    await waitFor(() => {
      expect(mockHandlers.onOpenTemplates).toHaveBeenCalled();
    });
  });

  it('should not crash with null initial URL', async () => {
    (Linking.getInitialURL as jest.Mock).mockResolvedValue(null);

    renderHook(() => useDeepLinking(mockHandlers));

    await waitFor(() => {
      expect(mockHandlers.onOpenHabit).not.toHaveBeenCalled();
      expect(mockHandlers.onOpenCreate).not.toHaveBeenCalled();
    });
  });

  it('should handle unknown routes gracefully', async () => {
    (Linking.getInitialURL as jest.Mock).mockResolvedValue(
      'habit-tracker://unknown'
    );
    (Linking.parse as jest.Mock).mockReturnValue({
      hostname: 'unknown',
      path: '',
      queryParams: {},
    });

    const { result } = renderHook(() => useDeepLinking(mockHandlers));

    await waitFor(() => {
      expect(mockHandlers.onOpenHabit).not.toHaveBeenCalled();
      expect(mockHandlers.onOpenCreate).not.toHaveBeenCalled();
      expect(mockHandlers.onOpenSettings).not.toHaveBeenCalled();
      expect(mockHandlers.onOpenTemplates).not.toHaveBeenCalled();
    });
  });

  it('should register URL event listener', () => {
    renderHook(() => useDeepLinking(mockHandlers));

    expect(Linking.addEventListener).toHaveBeenCalledWith(
      'url',
      expect.any(Function)
    );
  });

  it('should clean up event listener on unmount', () => {
    const mockRemove = jest.fn();
    (Linking.addEventListener as jest.Mock).mockReturnValue({
      remove: mockRemove,
    });

    const { unmount } = renderHook(() => useDeepLinking(mockHandlers));

    unmount();

    expect(mockRemove).toHaveBeenCalled();
  });

  it('should handle habit URL with leading slash in path', async () => {
    const habitId = 'kg2ar5xj8h7p9q6r5s4t3u2v1w0x';
    (Linking.getInitialURL as jest.Mock).mockResolvedValue(
      `habit-tracker://habit/${habitId}`
    );
    (Linking.parse as jest.Mock).mockReturnValue({
      hostname: 'habit',
      path: `/${habitId}`,
      queryParams: {},
    });

    renderHook(() => useDeepLinking(mockHandlers));

    await waitFor(() => {
      expect(mockHandlers.onOpenHabit).toHaveBeenCalledWith(habitId);
    });
  });

  it('should not call handlers if not provided', async () => {
    (Linking.getInitialURL as jest.Mock).mockResolvedValue(
      'habit-tracker://create'
    );
    (Linking.parse as jest.Mock).mockReturnValue({
      hostname: 'create',
      path: '',
      queryParams: {},
    });

    // Render hook without onOpenCreate handler
    renderHook(() =>
      useDeepLinking({
        onOpenHabit: mockHandlers.onOpenHabit,
        // onOpenCreate not provided
        onOpenSettings: mockHandlers.onOpenSettings,
        onOpenTemplates: mockHandlers.onOpenTemplates,
      })
    );

    await waitFor(() => {
      // Should not throw error
      expect(mockHandlers.onOpenCreate).not.toHaveBeenCalled();
    });
  });
});
