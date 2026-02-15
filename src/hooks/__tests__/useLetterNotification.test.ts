/**
 * useLetterNotification Hook Tests
 * Tests letter notification scheduling for Letters to Self feature
 *
 * Part of T11.5: Unlock notification for Letters to Self
 */

import { renderHook, act, waitFor } from '@testing-library/react-native';

import * as notifications from '../../utils/notifications';
import { useLetterNotification } from '../useLetterNotification';

// Mock Convex
const mockCreateLetter = jest.fn();
jest.mock('convex/react', () => ({
  useMutation: jest.fn(() => mockCreateLetter),
}));

// Mock notification utils
jest.mock('../../utils/notifications', () => ({
  scheduleLetterUnlockNotification: jest.fn(),
  cancelLetterUnlockNotification: jest.fn(),
}));

describe('useLetterNotification', () => {
  const mockHabitId = 'habit123' as unknown;
  const mockLetterId = 'letter456' as unknown;
  const mockOnSuccess = jest.fn();
  const mockOnError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'warn').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('initialization', () => {
    it('returns expected API methods', () => {
      const { result } = renderHook(() =>
        useLetterNotification({
          habitId: mockHabitId,
        })
      );

      expect(result.current.createLetterWithNotification).toBeInstanceOf(
        Function
      );
      expect(result.current.cancelNotification).toBeInstanceOf(Function);
      expect(result.current.isCreating).toBe(false);
    });

    it('does not create letter on mount', () => {
      renderHook(() =>
        useLetterNotification({
          habitId: mockHabitId,
        })
      );

      expect(mockCreateLetter).not.toHaveBeenCalled();
    });
  });

  describe('createLetterWithNotification', () => {
    it('creates letter and schedules notification successfully', async () => {
      mockCreateLetter.mockResolvedValue(mockLetterId);
      (
        notifications.scheduleLetterUnlockNotification as jest.Mock
      ).mockResolvedValue('notification123');

      const { result } = renderHook(() =>
        useLetterNotification({
          habitId: mockHabitId,
          onSuccess: mockOnSuccess,
        })
      );

      let letterId: unknown;
      await act(async () => {
        letterId = await result.current.createLetterWithNotification({
          content: 'Dear future me...',
          unlockDays: 7,
          title: 'Keep Going',
        });
      });

      expect(mockCreateLetter).toHaveBeenCalledWith({
        content: 'Dear future me...',
        habitId: mockHabitId,
        title: 'Keep Going',
        unlockDays: 7,
      });

      expect(
        notifications.scheduleLetterUnlockNotification
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          habitId: mockHabitId.toString(),
          letterId: mockLetterId.toString(),
          letterTitle: 'Keep Going',
          unlockAt: expect.any(Number),
        })
      );

      expect(letterId).toBe(mockLetterId);
      expect(mockOnSuccess).toHaveBeenCalledWith(mockLetterId);
    });

    it('calculates correct unlock timestamp', async () => {
      mockCreateLetter.mockResolvedValue(mockLetterId);
      (
        notifications.scheduleLetterUnlockNotification as jest.Mock
      ).mockResolvedValue('notification123');

      const { result } = renderHook(() =>
        useLetterNotification({
          habitId: mockHabitId,
        })
      );

      const beforeTime = Date.now();
      await act(async () => {
        await result.current.createLetterWithNotification({
          content: 'Test',
          unlockDays: 7,
        });
      });
      const afterTime = Date.now();

      const scheduleCall = (
        notifications.scheduleLetterUnlockNotification as jest.Mock
      ).mock.calls[0][0];
      const unlockAt = scheduleCall.unlockAt;

      // Unlock should be 7 days from now
      const expectedUnlock = 7 * 24 * 60 * 60 * 1000;
      expect(unlockAt).toBeGreaterThanOrEqual(beforeTime + expectedUnlock);
      expect(unlockAt).toBeLessThanOrEqual(afterTime + expectedUnlock);
    });

    it('uses default title when not provided', async () => {
      mockCreateLetter.mockResolvedValue(mockLetterId);
      (
        notifications.scheduleLetterUnlockNotification as jest.Mock
      ).mockResolvedValue('notification123');

      const { result } = renderHook(() =>
        useLetterNotification({
          habitId: mockHabitId,
        })
      );

      await act(async () => {
        await result.current.createLetterWithNotification({
          content: 'Test content',
          unlockDays: 3,
        });
      });

      expect(
        notifications.scheduleLetterUnlockNotification
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          letterTitle: 'Letter to Self',
        })
      );
    });

    it('handles notification scheduling failure gracefully', async () => {
      mockCreateLetter.mockResolvedValue(mockLetterId);
      (
        notifications.scheduleLetterUnlockNotification as jest.Mock
      ).mockResolvedValue(null);

      const { result } = renderHook(() =>
        useLetterNotification({
          habitId: mockHabitId,
          onSuccess: mockOnSuccess,
        })
      );

      let letterId: unknown;
      await act(async () => {
        letterId = await result.current.createLetterWithNotification({
          content: 'Test',
          unlockDays: 5,
        });
      });

      // Letter creation should still succeed
      expect(letterId).toBe(mockLetterId);
      expect(mockOnSuccess).toHaveBeenCalledWith(mockLetterId);
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('notification scheduling failed'),
        mockLetterId
      );
    });

    it('handles letter creation failure', async () => {
      const error = new Error('Database error');
      mockCreateLetter.mockRejectedValue(error);

      const { result } = renderHook(() =>
        useLetterNotification({
          habitId: mockHabitId,
          onError: mockOnError,
        })
      );

      let letterId: unknown;
      await act(async () => {
        letterId = await result.current.createLetterWithNotification({
          content: 'Test',
          unlockDays: 7,
        });
      });

      expect(letterId).toBeNull();
      expect(mockOnError).toHaveBeenCalledWith(error);
      expect(
        notifications.scheduleLetterUnlockNotification
      ).not.toHaveBeenCalled();
    });

    it('converts non-Error rejections to Error', async () => {
      mockCreateLetter.mockRejectedValue('String error');

      const { result } = renderHook(() =>
        useLetterNotification({
          habitId: mockHabitId,
          onError: mockOnError,
        })
      );

      await act(async () => {
        await result.current.createLetterWithNotification({
          content: 'Test',
          unlockDays: 7,
        });
      });

      expect(mockOnError).toHaveBeenCalledWith(expect.any(Error));
      const errorArg = mockOnError.mock.calls[0][0];
      expect(errorArg.message).toBe('String error');
    });

    it('logs notification scheduling success', async () => {
      const notificationId = 'notification123';
      mockCreateLetter.mockResolvedValue(mockLetterId);
      (
        notifications.scheduleLetterUnlockNotification as jest.Mock
      ).mockResolvedValue(notificationId);

      const { result } = renderHook(() =>
        useLetterNotification({
          habitId: mockHabitId,
        })
      );

      await act(async () => {
        await result.current.createLetterWithNotification({
          content: 'Test',
          unlockDays: 7,
          title: 'My Letter',
        });
      });

      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Letter created with notification'),
        expect.objectContaining({
          letterId: mockLetterId,
          notificationId,
          unlockAt: expect.any(String),
        })
      );
    });
  });

  describe('cancelNotification', () => {
    it('calls cancelLetterUnlockNotification with letterId', async () => {
      const { result } = renderHook(() =>
        useLetterNotification({
          habitId: mockHabitId,
        })
      );

      await act(async () => {
        await result.current.cancelNotification('letter789');
      });

      expect(notifications.cancelLetterUnlockNotification).toHaveBeenCalledWith(
        'letter789'
      );
    });

    it('handles cancellation errors gracefully', async () => {
      (
        notifications.cancelLetterUnlockNotification as jest.Mock
      ).mockRejectedValue(new Error('Cancellation failed'));

      const { result } = renderHook(() =>
        useLetterNotification({
          habitId: mockHabitId,
        })
      );

      // Should not throw
      await act(async () => {
        await result.current.cancelNotification('letter789');
      });
    });
  });

  describe('callback stability', () => {
    it('maintains stable callback references', () => {
      const { result, rerender } = renderHook(() =>
        useLetterNotification({
          habitId: mockHabitId,
        })
      );

      const firstCreate = result.current.createLetterWithNotification;
      const firstCancel = result.current.cancelNotification;

      rerender();

      expect(result.current.createLetterWithNotification).toBe(firstCreate);
      expect(result.current.cancelNotification).toBe(firstCancel);
    });

    it('updates callbacks when dependencies change', () => {
      const { result, rerender } = renderHook(
        ({ habitId, onSuccess }) =>
          useLetterNotification({ habitId, onSuccess }),
        {
          initialProps: {
            habitId: mockHabitId,
            onSuccess: mockOnSuccess,
          },
        }
      );

      const firstCreate = result.current.createLetterWithNotification;

      const newOnSuccess = jest.fn();
      rerender({
        habitId: mockHabitId,
        onSuccess: newOnSuccess,
      });

      expect(result.current.createLetterWithNotification).not.toBe(firstCreate);
    });
  });

  describe('edge cases', () => {
    it('handles zero unlockDays', async () => {
      mockCreateLetter.mockResolvedValue(mockLetterId);
      (
        notifications.scheduleLetterUnlockNotification as jest.Mock
      ).mockResolvedValue('notification123');

      const { result } = renderHook(() =>
        useLetterNotification({
          habitId: mockHabitId,
        })
      );

      await act(async () => {
        await result.current.createLetterWithNotification({
          content: 'Immediate letter',
          unlockDays: 0,
        });
      });

      const scheduleCall = (
        notifications.scheduleLetterUnlockNotification as jest.Mock
      ).mock.calls[0][0];

      // Should schedule for approximately now
      expect(scheduleCall.unlockAt).toBeLessThanOrEqual(Date.now() + 1000);
    });

    it('handles very long unlock periods', async () => {
      mockCreateLetter.mockResolvedValue(mockLetterId);
      (
        notifications.scheduleLetterUnlockNotification as jest.Mock
      ).mockResolvedValue('notification123');

      const { result } = renderHook(() =>
        useLetterNotification({
          habitId: mockHabitId,
        })
      );

      const unlockDays = 365; // 1 year
      await act(async () => {
        await result.current.createLetterWithNotification({
          content: 'Future letter',
          unlockDays,
        });
      });

      const scheduleCall = (
        notifications.scheduleLetterUnlockNotification as jest.Mock
      ).mock.calls[0][0];

      const expectedUnlock = unlockDays * 24 * 60 * 60 * 1000;
      const tolerance = 1000; // 1 second tolerance
      expect(scheduleCall.unlockAt).toBeGreaterThanOrEqual(
        Date.now() + expectedUnlock - tolerance
      );
    });

    it('handles empty content', async () => {
      mockCreateLetter.mockResolvedValue(mockLetterId);
      (
        notifications.scheduleLetterUnlockNotification as jest.Mock
      ).mockResolvedValue('notification123');

      const { result } = renderHook(() =>
        useLetterNotification({
          habitId: mockHabitId,
        })
      );

      await act(async () => {
        await result.current.createLetterWithNotification({
          content: '',
          unlockDays: 7,
        });
      });

      expect(mockCreateLetter).toHaveBeenCalledWith(
        expect.objectContaining({
          content: '',
        })
      );
    });

    it('handles very long content', async () => {
      mockCreateLetter.mockResolvedValue(mockLetterId);
      (
        notifications.scheduleLetterUnlockNotification as jest.Mock
      ).mockResolvedValue('notification123');

      const { result } = renderHook(() =>
        useLetterNotification({
          habitId: mockHabitId,
        })
      );

      const longContent = 'A'.repeat(10000);
      await act(async () => {
        await result.current.createLetterWithNotification({
          content: longContent,
          unlockDays: 7,
        });
      });

      expect(mockCreateLetter).toHaveBeenCalledWith(
        expect.objectContaining({
          content: longContent,
        })
      );
    });
  });
});
