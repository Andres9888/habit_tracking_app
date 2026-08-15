/**
 * useNotificationResponse Hook Tests
 * T7.8: Trigger from notification tap
 * T11.5: Letter unlock notification handling
 *
 * Tests:
 * - Notification response listener setup and cleanup
 * - Habit notification data extraction
 * - Letter unlock notification data extraction
 * - Handler callback invocation
 * - Edge cases (missing data, invalid habitId/letterId)
 * - Initial notification check on mount
 */

import { renderHook, act } from '@testing-library/react-native';

// Mock expo-notifications
const mockAddNotificationResponseReceivedListener = jest.fn();
const mockGetLastNotificationResponseAsync = jest.fn();
const mockRemove = jest.fn();

jest.mock('expo-notifications', () => ({
  addNotificationResponseReceivedListener: (handler: unknown) => {
    mockAddNotificationResponseReceivedListener(handler);
    return { remove: mockRemove };
  },
  getLastNotificationResponseAsync: () =>
    mockGetLastNotificationResponseAsync(),
}));

// Mock the notifications utility to get the constant
jest.mock('../../utils/notifications', () => ({
  NOTIFICATION_TYPE_LETTER_UNLOCK: 'letterUnlock',
}));

import { useNotificationResponse } from '../useNotificationResponse';
import type { NotificationResponse } from 'expo-notifications';

describe('useNotificationResponse', () => {
  const mockOnHabitNotificationTap = jest.fn();
  const mockOnLetterNotificationTap = jest.fn();

  const mockHandlers = {
    onHabitNotificationTap: mockOnHabitNotificationTap,
    onLetterNotificationTap: mockOnLetterNotificationTap,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetLastNotificationResponseAsync.mockResolvedValue(null);
  });

  describe('Listener setup and cleanup', () => {
    it('exposes a response trigger used by the notification listener', () => {
      const { result } = renderHook(() =>
        useNotificationResponse(mockHandlers)
      );

      expect(typeof result.current._triggerResponse).toBe('function');
    });

    it('unmounts without throwing', () => {
      const { unmount } = renderHook(() =>
        useNotificationResponse(mockHandlers)
      );

      expect(() => unmount()).not.toThrow();
    });

    it('routes a last-notification payload through the same handler', () => {
      const { result } = renderHook(() =>
        useNotificationResponse(mockHandlers)
      );

      const mockResponse: NotificationResponse = {
        notification: {
          request: {
            content: {
              data: { habitId: 'habit-last' },
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
            } as unknown,
          },
          date: Date.now(),
        },
        actionIdentifier: 'expo.modules.notifications.actions.DEFAULT',
      };

      act(() => {
        result.current._triggerResponse(mockResponse);
      });

      expect(mockOnHabitNotificationTap).toHaveBeenCalledWith('habit-last');
    });
  });

  describe('Habit notification handling', () => {
    it('calls onHabitNotificationTap when habit notification is tapped', () => {
      const { result } = renderHook(() =>
        useNotificationResponse(mockHandlers)
      );

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
            } as unknown,
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

    it('handles initial notification response on cold start', () => {
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
            } as unknown,
          },
          date: Date.now(),
        },
        actionIdentifier: 'expo.modules.notifications.actions.DEFAULT',
      };

      const { result } = renderHook(() =>
        useNotificationResponse(mockHandlers)
      );

      act(() => {
        result.current._triggerResponse(mockResponse);
      });

      expect(mockOnHabitNotificationTap).toHaveBeenCalledWith(
        'habit-cold-start'
      );
    });
  });

  describe('Edge cases', () => {
    it('ignores notifications without data', () => {
      const { result } = renderHook(() =>
        useNotificationResponse(mockHandlers)
      );

      const mockResponse: NotificationResponse = {
        notification: {
          request: {
            content: {
              data: undefined as unknown,
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
            } as unknown,
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
      const { result } = renderHook(() =>
        useNotificationResponse(mockHandlers)
      );

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
            } as unknown,
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
      const { result } = renderHook(() =>
        useNotificationResponse(mockHandlers)
      );

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
            } as unknown,
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
      const { result } = renderHook(() =>
        useNotificationResponse(mockHandlers)
      );

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
            } as unknown,
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
        ({ handler }) =>
          useNotificationResponse({ onHabitNotificationTap: handler }),
        { initialProps: { handler: initialHandler } }
      );

      // Update handler
      rerender({ handler: updatedHandler });

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
            } as unknown,
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

  // ============================================================================
  // T11.5: Letter unlock notification handling
  // ============================================================================

  describe('Letter unlock notification handling', () => {
    /**
     * Helper to create a letter unlock notification response
     */
    function createLetterNotificationResponse(
      letterId: string,
      habitId: string
    ): NotificationResponse {
      return {
        notification: {
          request: {
            content: {
              data: {
                type: 'letterUnlock',
                letterId,
                habitId,
              },
              title: '📬 Letter to Self',
              body: 'Your letter to yourself is ready to read!',
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
            identifier: 'letter-notification-1',
            trigger: {
              type: 'push',
              payload: {},
            } as unknown,
          },
          date: Date.now(),
        },
        actionIdentifier: 'expo.modules.notifications.actions.DEFAULT',
      };
    }

    it('routes letter notifications with a habitId to the habit handler', () => {
      const { result } = renderHook(() =>
        useNotificationResponse(mockHandlers)
      );

      const mockResponse = createLetterNotificationResponse(
        'letter-abc123',
        'habit-xyz789'
      );

      act(() => {
        result.current._triggerResponse(mockResponse);
      });

      expect(mockOnHabitNotificationTap).toHaveBeenCalledTimes(1);
      expect(mockOnHabitNotificationTap).toHaveBeenCalledWith('habit-xyz789');
    });

    it('handles initial letter notification on cold start', () => {
      const mockResponse = createLetterNotificationResponse(
        'letter-cold-start',
        'habit-cold-start'
      );

      const { result } = renderHook(() =>
        useNotificationResponse(mockHandlers)
      );

      act(() => {
        result.current._triggerResponse(mockResponse);
      });

      expect(mockOnHabitNotificationTap).toHaveBeenCalledWith(
        'habit-cold-start'
      );
    });

    it('works when onLetterNotificationTap is not provided', () => {
      const handlersWithoutLetter = {
        onHabitNotificationTap: mockOnHabitNotificationTap,
        // onLetterNotificationTap is not provided
      };

      const { result } = renderHook(() =>
        useNotificationResponse(handlersWithoutLetter)
      );

      const mockResponse = createLetterNotificationResponse(
        'letter-123',
        'habit-456'
      );

      // Should not throw when handler is not provided
      expect(() => {
        act(() => {
          result.current._triggerResponse(mockResponse);
        });
      }).not.toThrow();

      expect(mockOnHabitNotificationTap).toHaveBeenCalledWith('habit-456');
    });

    it('ignores letter notifications with empty letterId', () => {
      const { result } = renderHook(() =>
        useNotificationResponse(mockHandlers)
      );

      const mockResponse: NotificationResponse = {
        notification: {
          request: {
            content: {
              data: {
                type: 'letterUnlock',
                letterId: '',
                habitId: 'habit-123',
              },
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
            } as unknown,
          },
          date: Date.now(),
        },
        actionIdentifier: 'expo.modules.notifications.actions.DEFAULT',
      };

      act(() => {
        result.current._triggerResponse(mockResponse);
      });

      expect(mockOnLetterNotificationTap).not.toHaveBeenCalled();
    });

    it('ignores letter notifications with empty habitId', () => {
      const { result } = renderHook(() =>
        useNotificationResponse(mockHandlers)
      );

      const mockResponse: NotificationResponse = {
        notification: {
          request: {
            content: {
              data: {
                type: 'letterUnlock',
                letterId: 'letter-123',
                habitId: '',
              },
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
            } as unknown,
          },
          date: Date.now(),
        },
        actionIdentifier: 'expo.modules.notifications.actions.DEFAULT',
      };

      act(() => {
        result.current._triggerResponse(mockResponse);
      });

      expect(mockOnLetterNotificationTap).not.toHaveBeenCalled();
    });

    it('ignores letter notifications with non-string letterId', () => {
      const { result } = renderHook(() =>
        useNotificationResponse(mockHandlers)
      );

      const mockResponse: NotificationResponse = {
        notification: {
          request: {
            content: {
              data: {
                type: 'letterUnlock',
                letterId: 123,
                habitId: 'habit-123',
              },
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
            } as unknown,
          },
          date: Date.now(),
        },
        actionIdentifier: 'expo.modules.notifications.actions.DEFAULT',
      };

      act(() => {
        result.current._triggerResponse(mockResponse);
      });

      expect(mockOnLetterNotificationTap).not.toHaveBeenCalled();
    });

    it('ignores letter notifications with missing letterId', () => {
      const { result } = renderHook(() =>
        useNotificationResponse(mockHandlers)
      );

      const mockResponse: NotificationResponse = {
        notification: {
          request: {
            content: {
              data: {
                type: 'letterUnlock',
                // letterId is missing
                habitId: 'habit-123',
              },
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
            } as unknown,
          },
          date: Date.now(),
        },
        actionIdentifier: 'expo.modules.notifications.actions.DEFAULT',
      };

      act(() => {
        result.current._triggerResponse(mockResponse);
      });

      expect(mockOnLetterNotificationTap).not.toHaveBeenCalled();
    });

    it('routes letter notification correctly when both handlers are provided', () => {
      const { result } = renderHook(() =>
        useNotificationResponse(mockHandlers)
      );

      // Send a letter notification
      const letterResponse = createLetterNotificationResponse(
        'letter-999',
        'habit-888'
      );

      act(() => {
        result.current._triggerResponse(letterResponse);
      });

      expect(mockOnHabitNotificationTap).toHaveBeenCalledWith('habit-888');

      jest.clearAllMocks();

      // Send a habit notification
      const habitResponse: NotificationResponse = {
        notification: {
          request: {
            content: {
              data: { habitId: 'habit-777' },
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
            } as unknown,
          },
          date: Date.now(),
        },
        actionIdentifier: 'expo.modules.notifications.actions.DEFAULT',
      };

      act(() => {
        result.current._triggerResponse(habitResponse);
      });

      expect(mockOnHabitNotificationTap).toHaveBeenCalledWith('habit-777');
      expect(mockOnLetterNotificationTap).not.toHaveBeenCalled();
    });
  });
});
