/**
 * useNotificationResponse Hook Tests
 * T7.8: Trigger from notification tap
 *
 * Tests:
 * - Notification response listener setup and cleanup
 * - Habit notification data extraction
 * - Handler callback invocation
 * - Edge cases (missing data, invalid habitId)
 * - Initial notification check on mount
 */

import { renderHook, act, waitFor } from '@testing-library/react-native';

// Mock expo-notifications
const mockAddNotificationResponseReceivedListener = jest.fn();
const mockGetLastNotificationResponseAsync = jest.fn();
const mockRemove = jest.fn();

jest.mock('expo-notifications', () => ({
  addNotificationResponseReceivedListener: (handler: any) => {
    mockAddNotificationResponseReceivedListener(handler);
    return { remove: mockRemove };
  },
  getLastNotificationResponseAsync: () => mockGetLastNotificationResponseAsync(),
}));

import { useNotificationResponse } from '../useNotificationResponse';
import type { NotificationResponse } from 'expo-notifications';

describe('useNotificationResponse', () => {
  const mockOnHabitNotificationTap = jest.fn();

  const mockHandlers = {
    onHabitNotificationTap: mockOnHabitNotificationTap,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetLastNotificationResponseAsync.mockResolvedValue(null);
  });

  describe('Listener setup and cleanup', () => {
    it('sets up notification response listener on mount', () => {
      renderHook(() => useNotificationResponse(mockHandlers));

      expect(mockAddNotificationResponseReceivedListener).toHaveBeenCalledTimes(1);
      expect(mockAddNotificationResponseReceivedListener).toHaveBeenCalledWith(
        expect.any(Function)
      );
    });

    it('removes listener on unmount', () => {
      const { unmount } = renderHook(() => useNotificationResponse(mockHandlers));

      unmount();

      expect(mockRemove).toHaveBeenCalledTimes(1);
    });

    it('checks for initial notification response on mount', async () => {
      renderHook(() => useNotificationResponse(mockHandlers));

      await waitFor(() => {
        expect(mockGetLastNotificationResponseAsync).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Habit notification handling', () => {
    it('calls onHabitNotificationTap when habit notification is tapped', () => {
      const { result } = renderHook(() => useNotificationResponse(mockHandlers));

      const mockResponse: NotificationResponse = {
        notification: {
          request: {
            content: {
              data: { habitId: 'habit-123' },
              title: 'Time for your habit!',
              body: 'Morning Exercise',
              sound: 'default',
              badge: null,
              subtitle: null,
              launchImageName: null,
              attachments: [],
              summaryArgument: null,
              summaryArgumentCount: 0,
              categoryIdentifier: null,
              threadIdentifier: null,
              targetContentIdentifier: null,
            },
            identifier: 'notification-1',
            trigger: {
              type: 'push',
              payload: {},
            } as any,
          },
          date: Date.now(),
        },
        actionIdentifier: 'expo.modules.notifications.actions.DEFAULT',
      };

      act(() => {
        result.current._triggerResponse(mockResponse);
      });

      expect(mockOnHabitNotificationTap).toHaveBeenCalledTimes(1);
      expect(mockOnHabitNotificationTap).toHaveBeenCalledWith('habit-123');
    });

    it('handles initial notification response on cold start', async () => {
      const mockResponse: NotificationResponse = {
        notification: {
          request: {
            content: {
              data: { habitId: 'habit-cold-start' },
              title: 'Time for your habit!',
              body: 'Morning Exercise',
              sound: 'default',
              badge: null,
              subtitle: null,
              launchImageName: null,
              attachments: [],
              summaryArgument: null,
              summaryArgumentCount: 0,
              categoryIdentifier: null,
              threadIdentifier: null,
              targetContentIdentifier: null,
            },
            identifier: 'notification-1',
            trigger: {
              type: 'push',
              payload: {},
            } as any,
          },
          date: Date.now(),
        },
        actionIdentifier: 'expo.modules.notifications.actions.DEFAULT',
      };

      mockGetLastNotificationResponseAsync.mockResolvedValue(mockResponse);

      renderHook(() => useNotificationResponse(mockHandlers));

      await waitFor(() => {
        expect(mockOnHabitNotificationTap).toHaveBeenCalledWith('habit-cold-start');
      });
    });
  });

  describe('Edge cases', () => {
    it('ignores notifications without data', () => {
      const { result } = renderHook(() => useNotificationResponse(mockHandlers));

      const mockResponse: NotificationResponse = {
        notification: {
          request: {
            content: {
              data: undefined as any,
              title: 'Generic notification',
              body: null,
              sound: 'default',
              badge: null,
              subtitle: null,
              launchImageName: null,
              attachments: [],
              summaryArgument: null,
              summaryArgumentCount: 0,
              categoryIdentifier: null,
              threadIdentifier: null,
              targetContentIdentifier: null,
            },
            identifier: 'notification-1',
            trigger: {
              type: 'push',
              payload: {},
            } as any,
          },
          date: Date.now(),
        },
        actionIdentifier: 'expo.modules.notifications.actions.DEFAULT',
      };

      act(() => {
        result.current._triggerResponse(mockResponse);
      });

      expect(mockOnHabitNotificationTap).not.toHaveBeenCalled();
    });

    it('ignores notifications without habitId', () => {
      const { result } = renderHook(() => useNotificationResponse(mockHandlers));

      const mockResponse: NotificationResponse = {
        notification: {
          request: {
            content: {
              data: { someOtherKey: 'value' },
              title: 'Generic notification',
              body: null,
              sound: 'default',
              badge: null,
              subtitle: null,
              launchImageName: null,
              attachments: [],
              summaryArgument: null,
              summaryArgumentCount: 0,
              categoryIdentifier: null,
              threadIdentifier: null,
              targetContentIdentifier: null,
            },
            identifier: 'notification-1',
            trigger: {
              type: 'push',
              payload: {},
            } as any,
          },
          date: Date.now(),
        },
        actionIdentifier: 'expo.modules.notifications.actions.DEFAULT',
      };

      act(() => {
        result.current._triggerResponse(mockResponse);
      });

      expect(mockOnHabitNotificationTap).not.toHaveBeenCalled();
    });

    it('ignores notifications with empty habitId', () => {
      const { result } = renderHook(() => useNotificationResponse(mockHandlers));

      const mockResponse: NotificationResponse = {
        notification: {
          request: {
            content: {
              data: { habitId: '' },
              title: 'Time for your habit!',
              body: null,
              sound: 'default',
              badge: null,
              subtitle: null,
              launchImageName: null,
              attachments: [],
              summaryArgument: null,
              summaryArgumentCount: 0,
              categoryIdentifier: null,
              threadIdentifier: null,
              targetContentIdentifier: null,
            },
            identifier: 'notification-1',
            trigger: {
              type: 'push',
              payload: {},
            } as any,
          },
          date: Date.now(),
        },
        actionIdentifier: 'expo.modules.notifications.actions.DEFAULT',
      };

      act(() => {
        result.current._triggerResponse(mockResponse);
      });

      expect(mockOnHabitNotificationTap).not.toHaveBeenCalled();
    });

    it('ignores notifications with non-string habitId', () => {
      const { result } = renderHook(() => useNotificationResponse(mockHandlers));

      const mockResponse: NotificationResponse = {
        notification: {
          request: {
            content: {
              data: { habitId: 123 },
              title: 'Time for your habit!',
              body: null,
              sound: 'default',
              badge: null,
              subtitle: null,
              launchImageName: null,
              attachments: [],
              summaryArgument: null,
              summaryArgumentCount: 0,
              categoryIdentifier: null,
              threadIdentifier: null,
              targetContentIdentifier: null,
            },
            identifier: 'notification-1',
            trigger: {
              type: 'push',
              payload: {},
            } as any,
          },
          date: Date.now(),
        },
        actionIdentifier: 'expo.modules.notifications.actions.DEFAULT',
      };

      act(() => {
        result.current._triggerResponse(mockResponse);
      });

      expect(mockOnHabitNotificationTap).not.toHaveBeenCalled();
    });
  });

  describe('Handler updates', () => {
    it('uses the latest handler reference without re-subscribing', () => {
      const initialHandler = jest.fn();
      const updatedHandler = jest.fn();

      const { result, rerender } = renderHook(
        ({ handler }) => useNotificationResponse({ onHabitNotificationTap: handler }),
        { initialProps: { handler: initialHandler } }
      );

      // Should only subscribe once
      expect(mockAddNotificationResponseReceivedListener).toHaveBeenCalledTimes(1);

      // Update handler
      rerender({ handler: updatedHandler });

      // Should not re-subscribe
      expect(mockAddNotificationResponseReceivedListener).toHaveBeenCalledTimes(1);

      // Trigger notification
      const mockResponse: NotificationResponse = {
        notification: {
          request: {
            content: {
              data: { habitId: 'habit-456' },
              title: null,
              body: null,
              sound: 'default',
              badge: null,
              subtitle: null,
              launchImageName: null,
              attachments: [],
              summaryArgument: null,
              summaryArgumentCount: 0,
              categoryIdentifier: null,
              threadIdentifier: null,
              targetContentIdentifier: null,
            },
            identifier: 'notification-1',
            trigger: {
              type: 'push',
              payload: {},
            } as any,
          },
          date: Date.now(),
        },
        actionIdentifier: 'expo.modules.notifications.actions.DEFAULT',
      };

      act(() => {
        result.current._triggerResponse(mockResponse);
      });

      // Should call the updated handler, not the initial one
      expect(initialHandler).not.toHaveBeenCalled();
      expect(updatedHandler).toHaveBeenCalledWith('habit-456');
    });
  });
});
