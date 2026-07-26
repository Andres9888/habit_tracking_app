import { act, render } from '@testing-library/react-native';
import React, { useEffect } from 'react';

import { useHapticFeedback } from '../useHapticFeedback';

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

describe('useHapticFeedback', () => {
  const hapticsMock = jest.requireMock('expo-haptics');

  afterEach(() => {
    jest.clearAllMocks();
  });

  const Harness = ({
    isEnabled,
    preference,
  }: {
    isEnabled?: boolean;
    preference?: boolean;
  }) => {
    const haptics = useHapticFeedback({ isEnabled, preference });

    useEffect(() => {
      void haptics.triggerSuccess();
      void haptics.triggerWarning();
      void haptics.triggerSelection();
    }, [haptics]);

    return null;
  };

  it('calls expo haptics utilities when enabled', async () => {
    render(<Harness isEnabled preference={false} />);

    await act(async () => {
      await Promise.resolve();
    });

    expect(hapticsMock.notificationAsync).toHaveBeenCalledWith('success');
    expect(hapticsMock.notificationAsync).toHaveBeenCalledWith('warning');
    expect(hapticsMock.selectionAsync).toHaveBeenCalledTimes(1);
  });

  it('returns no-op handlers when disabled by preference', async () => {
    render(<Harness isEnabled preference />);

    await act(async () => {
      await Promise.resolve();
    });

    expect(hapticsMock.notificationAsync).not.toHaveBeenCalled();
    expect(hapticsMock.selectionAsync).not.toHaveBeenCalled();
  });
});
