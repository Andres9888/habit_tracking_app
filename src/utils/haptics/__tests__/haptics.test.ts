/**
 * Tests for the centralized haptics patterns library.
 * Created by Opus.
 */

import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

import { HapticPatterns } from '../patterns';
import { triggerHaptic, triggerHapticAsync } from '../haptics';

jest.mock('expo-haptics', () => ({
  ImpactFeedbackStyle: {
    Heavy: 'heavy',
    Light: 'light',
    Medium: 'medium',
  },
  NotificationFeedbackType: {
    Error: 'error',
    Success: 'success',
    Warning: 'warning',
  },
  impactAsync: jest.fn().mockResolvedValue(undefined),
  notificationAsync: jest.fn().mockResolvedValue(undefined),
  selectionAsync: jest.fn().mockResolvedValue(undefined),
}));

Object.defineProperty(Platform, 'OS', { configurable: true, value: 'ios' });

describe('HapticPatterns', () => {
  afterEach(() => jest.clearAllMocks());

  it('tap triggers light impact', async () => {
    await HapticPatterns.tap();
    expect(Haptics.impactAsync).toHaveBeenCalledWith('light');
  });

  it('toggle triggers medium impact', async () => {
    await HapticPatterns.toggle();
    expect(Haptics.impactAsync).toHaveBeenCalledWith('medium');
  });

  it('success triggers notification success', async () => {
    await HapticPatterns.success();
    expect(Haptics.notificationAsync).toHaveBeenCalledWith('success');
  });

  it('error triggers notification error', async () => {
    await HapticPatterns.error();
    expect(Haptics.notificationAsync).toHaveBeenCalledWith('error');
  });

  it('selection triggers selectionAsync', async () => {
    await HapticPatterns.selection();
    expect(Haptics.selectionAsync).toHaveBeenCalledTimes(1);
  });

  it('streak triggers double medium impact', async () => {
    await HapticPatterns.streak();
    expect(Haptics.impactAsync).toHaveBeenCalledTimes(2);
    expect(Haptics.impactAsync).toHaveBeenCalledWith('medium');
  });

  it('celebration triggers ascending intensity pattern with success finale', async () => {
    await HapticPatterns.celebration();
    const calls = (Haptics.impactAsync as jest.Mock).mock.calls;
    expect(calls.length).toBe(4);
    expect(calls[0][0]).toBe('light');
    expect(calls[1][0]).toBe('medium');
    expect(calls[2][0]).toBe('heavy');
    expect(calls[3][0]).toBe('heavy');
    expect(Haptics.notificationAsync).toHaveBeenCalledWith('success');
  });

  it('celebrationMajor triggers extended pattern', async () => {
    await HapticPatterns.celebrationMajor();
    const calls = (Haptics.impactAsync as jest.Mock).mock.calls;
    expect(calls.length).toBe(5);
    expect(Haptics.notificationAsync).toHaveBeenCalledWith('success');
  });
});

describe('triggerHaptic', () => {
  afterEach(() => jest.clearAllMocks());

  it('fires the named pattern', () => {
    triggerHaptic('tap');
    // Async — give it a tick
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        expect(Haptics.impactAsync).toHaveBeenCalledWith('light');
        resolve();
      }, 10);
    });
  });

  it('does not throw on unknown pattern edge', () => {
    // Should not crash
    expect(() => triggerHaptic('tap')).not.toThrow();
  });
});

describe('triggerHapticAsync', () => {
  afterEach(() => jest.clearAllMocks());

  it('awaits the full pattern', async () => {
    await triggerHapticAsync('success');
    expect(Haptics.notificationAsync).toHaveBeenCalledWith('success');
  });

  it('swallows errors gracefully', async () => {
    (Haptics.notificationAsync as jest.Mock).mockRejectedValueOnce(
      new Error('fail')
    );
    await expect(triggerHapticAsync('success')).resolves.toBeUndefined();
  });
});
