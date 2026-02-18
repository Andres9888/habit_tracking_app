/**
 * Tests for useNotificationPermissionFlow hook
 */

import { act, renderHook } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { useNotificationPermissionFlow } from '../useNotificationPermissionFlow';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('expo-notifications', () => ({
  requestPermissionsAsync: jest.fn(),
  getPermissionsAsync: jest.fn(),
}));

jest.mock('../../../utils/notifications/channels', () => ({
  configureAndroidChannel: jest.fn().mockResolvedValue(undefined),
}));

const mockRequestPermissions = Notifications.requestPermissionsAsync as jest.Mock;

describe('useNotificationPermissionFlow', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
    // Default: permission granted
    mockRequestPermissions.mockResolvedValue({ granted: true, status: 'granted' });
  });

  it('starts with prePermissionVisible=false and status=not_asked', () => {
    const { result } = renderHook(() => useNotificationPermissionFlow());
    expect(result.current.prePermissionVisible).toBe(false);
    expect(result.current.permissionStatus).toBe('not_asked');
  });

  it('shows pre-permission modal after first-ever habit completion on native', async () => {
    // Simulate native platform
    const originalOS = Platform.OS;
    Object.defineProperty(Platform, 'OS', { value: 'ios', configurable: true });

    const { result } = renderHook(() => useNotificationPermissionFlow());

    await act(async () => {
      await result.current.onHabitCompleted('habit-123');
    });

    expect(result.current.prePermissionVisible).toBe(true);
    expect(result.current.permissionStatus).toBe('pre_screen_shown');

    Object.defineProperty(Platform, 'OS', { value: originalOS, configurable: true });
  });

  it('does NOT show modal on web platform', async () => {
    const originalOS = Platform.OS;
    Object.defineProperty(Platform, 'OS', { value: 'web', configurable: true });

    const { result } = renderHook(() => useNotificationPermissionFlow());

    await act(async () => {
      await result.current.onHabitCompleted('habit-123');
    });

    expect(result.current.prePermissionVisible).toBe(false);

    Object.defineProperty(Platform, 'OS', { value: originalOS, configurable: true });
  });

  it('does NOT show modal again after first completion on subsequent calls', async () => {
    const originalOS = Platform.OS;
    Object.defineProperty(Platform, 'OS', { value: 'ios', configurable: true });

    const { result } = renderHook(() => useNotificationPermissionFlow());

    // First completion — shows modal
    await act(async () => {
      await result.current.onHabitCompleted('habit-1');
    });
    expect(result.current.prePermissionVisible).toBe(true);

    // User skips
    act(() => {
      result.current.onSkipNotifications();
    });
    expect(result.current.prePermissionVisible).toBe(false);

    // Second habit completion — status is now 'skipped', no modal
    await act(async () => {
      await result.current.onHabitCompleted('habit-2');
    });
    expect(result.current.prePermissionVisible).toBe(false);

    Object.defineProperty(Platform, 'OS', { value: originalOS, configurable: true });
  });

  it('grants permission and hides modal when onEnableNotifications is called', async () => {
    const originalOS = Platform.OS;
    Object.defineProperty(Platform, 'OS', { value: 'ios', configurable: true });

    const { result } = renderHook(() => useNotificationPermissionFlow());

    await act(async () => {
      await result.current.onHabitCompleted('habit-123');
    });
    expect(result.current.prePermissionVisible).toBe(true);

    await act(async () => {
      await result.current.onEnableNotifications();
    });

    expect(result.current.prePermissionVisible).toBe(false);
    expect(result.current.permissionStatus).toBe('granted');
    expect(mockRequestPermissions).toHaveBeenCalledTimes(1);

    Object.defineProperty(Platform, 'OS', { value: originalOS, configurable: true });
  });

  it('sets status to "denied" when OS denies permission', async () => {
    const originalOS = Platform.OS;
    Object.defineProperty(Platform, 'OS', { value: 'ios', configurable: true });

    mockRequestPermissions.mockResolvedValue({ granted: false, status: 'denied' });

    const { result } = renderHook(() => useNotificationPermissionFlow());

    await act(async () => {
      await result.current.onHabitCompleted('habit-123');
    });

    await act(async () => {
      await result.current.onEnableNotifications();
    });

    expect(result.current.permissionStatus).toBe('denied');
    expect(result.current.prePermissionVisible).toBe(false);

    Object.defineProperty(Platform, 'OS', { value: originalOS, configurable: true });
  });

  it('sets status to "skipped" when onSkipNotifications is called', async () => {
    const originalOS = Platform.OS;
    Object.defineProperty(Platform, 'OS', { value: 'ios', configurable: true });

    const { result } = renderHook(() => useNotificationPermissionFlow());

    await act(async () => {
      await result.current.onHabitCompleted('habit-123');
    });

    act(() => {
      result.current.onSkipNotifications();
    });

    expect(result.current.prePermissionVisible).toBe(false);
    expect(result.current.permissionStatus).toBe('skipped');

    Object.defineProperty(Platform, 'OS', { value: originalOS, configurable: true });
  });
});
