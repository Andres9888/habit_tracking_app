import { act, renderHook } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { useMutation } from 'convex/react';

import { useHabitDelete } from '../useHabitDelete';
import { useHabitsArchive } from '../useHabitsArchive';
import { useSelectionActions } from '../useSelectionMode/useSelectionActions';
import {
  cancelHabitReminder,
  rescheduleHabitReminderFromSettings,
} from '@/utils/notifications';

jest.mock('convex/react', () => ({ useMutation: jest.fn() }));
jest.mock('@/utils/notifications', () => ({
  cancelHabitReminder: jest.fn(async () => undefined),
  rescheduleHabitReminderFromSettings: jest.fn(async () => true),
}));
jest.mock('@/utils/haptics', () => ({ triggerHaptic: jest.fn() }));
jest.mock('@/lib/optimistic', () => ({
  optimisticStore: {
    addArchive: jest.fn(() => 'op-id'),
    confirm: jest.fn(),
    fail: jest.fn(),
  },
}));
jest.mock('../../../../lib/analytics/interactions', () => ({
  logInteraction: jest.fn(),
}));
jest.mock('../../../../utils/errorAlerts', () => ({ showGenericError: jest.fn() }));

const mockUseMutation = jest.mocked(useMutation);
const mockCancelHabitReminder = jest.mocked(cancelHabitReminder);
const mockReschedule = jest.mocked(rescheduleHabitReminderFromSettings);
const habit = {
  _id: 'habit-1',
  name: 'Read',
  reminderTime: '06:45',
  remindersEnabled: true,
};

describe('habit reminder lifecycle flows', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockCancelHabitReminder.mockResolvedValue(undefined);
    mockReschedule.mockResolvedValue(true);
  });

  it('archives before cancelling the scheduled reminder', async () => {
    const order: string[] = [];
    const archive = jest.fn(async () => order.push('archive'));
    mockCancelHabitReminder.mockImplementation(async () => {
      order.push('cancel');
    });
    mockUseMutation.mockReturnValue(archive);

    const { result } = renderHook(() => useHabitsArchive([habit] as never));

    await act(async () => {
      await result.current.handleArchive('habit-1' as never);
    });

    expect(archive).toHaveBeenCalledWith({ habitId: 'habit-1' });
    expect(order).toEqual(['archive', 'cancel']);
  });

  it('does not cancel when archive fails', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    mockUseMutation.mockReturnValue(jest.fn(async () => Promise.reject(new Error('no'))));

    const { result } = renderHook(() => useHabitsArchive([habit] as never));

    await act(async () => {
      await result.current.handleArchive('habit-1' as never);
    });

    expect(mockCancelHabitReminder).not.toHaveBeenCalled();
  });

  it('deletes before cancelling the scheduled reminder', async () => {
    const order: string[] = [];
    mockUseMutation.mockReturnValue(jest.fn(async () => order.push('delete')));
    mockCancelHabitReminder.mockImplementation(async () => {
      order.push('cancel');
    });
    jest.spyOn(Alert, 'alert').mockImplementation((title, message, buttons) => {
      void title;
      void message;
      buttons?.[1]?.onPress?.();
    });

    const { result } = renderHook(() => useHabitDelete([habit] as never));

    await act(async () => {
      result.current.handleDelete('habit-1' as never);
      await Promise.resolve();
    });

    expect(order).toEqual(['delete', 'cancel']);
  });

  it('batch archive undo unarchives before rescheduling snapshot reminders', async () => {
    const order: string[] = [];
    const mutations = [
      jest.fn(async () => undefined),
      jest.fn(async () => order.push('unarchive')),
      jest.fn(async () => undefined),
    ];
    let mutationIndex = 0;
    mockUseMutation.mockImplementation(() => mutations[mutationIndex++ % 3]);
    mockReschedule.mockImplementation(async () => {
      order.push('reschedule');
      return true;
    });

    const { result } = renderHook(() =>
      useSelectionActions({
        exitSelectionMode: jest.fn(),
        habits: [habit] as never,
        selectedIds: new Set(['habit-1']) as never,
      })
    );

    await act(async () => {
      await result.current.handleBatchArchive();
    });
    await act(async () => {
      await result.current.handleBatchArchiveUndo();
    });

    expect(order).toEqual(['unarchive', 'reschedule']);
    expect(mockReschedule).toHaveBeenCalledWith(habit);
  });
});
