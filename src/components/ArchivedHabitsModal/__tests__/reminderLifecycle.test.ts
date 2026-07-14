import { Alert } from 'react-native';

import { useArchiveDeleteActions } from '../useArchiveDeleteActions';
import { useBatchArchiveActions } from '../useBatchArchiveActions';
import {
  cancelHabitReminder,
  rescheduleHabitReminderFromSettings,
} from '@/utils/notifications';

jest.mock('@/utils/notifications', () => ({
  cancelHabitReminder: jest.fn(async () => undefined),
  rescheduleHabitReminderFromSettings: jest.fn(async () => true),
}));
jest.mock('@/utils/haptics', () => ({ triggerHaptic: jest.fn() }));

const mockCancelHabitReminder = jest.mocked(cancelHabitReminder);
const mockReschedule = jest.mocked(rescheduleHabitReminderFromSettings);
const archivedHabit = {
  _creationTime: 1,
  _id: 'habit-1',
  archivedAt: 1,
  name: 'Read',
  reminderTime: '06:45',
  remindersEnabled: true,
};

describe('archived habit reminder lifecycle flows', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockCancelHabitReminder.mockResolvedValue(undefined);
    mockReschedule.mockResolvedValue(true);
  });

  it('unarchives before rescheduling saved reminder settings', async () => {
    const order: string[] = [];
    const unarchive = jest.fn(async () => order.push('unarchive'));
    mockReschedule.mockImplementation(async () => {
      order.push('reschedule');
      return true;
    });

    const { handleBatchRestore } = useBatchArchiveActions(
      unarchive,
      jest.fn(),
      [archivedHabit] as never
    );

    await handleBatchRestore(new Set(['habit-1']) as never);

    expect(order).toEqual(['unarchive', 'reschedule']);
    expect(mockReschedule).toHaveBeenCalledWith(archivedHabit);
  });

  it('deletes archived habits before cancelling reminders', async () => {
    const order: string[] = [];
    const removeHabit = jest.fn(async () => order.push('delete'));
    mockCancelHabitReminder.mockImplementation(async () => {
      order.push('cancel');
    });
    jest.spyOn(Alert, 'alert').mockImplementation((title, message, buttons) => {
      void title;
      void message;
      buttons?.[1]?.onPress?.();
    });

    const { handlePermanentDelete } = useArchiveDeleteActions({
      archivedHabits: [archivedHabit] as never,
      deleteAllArchivedMutation: jest.fn(),
      removeHabit,
    });

    handlePermanentDelete('habit-1' as never, 'Read');
    await Promise.resolve();

    expect(order).toEqual(['delete', 'cancel']);
  });

  it('uses delete-all returned habit ids for reminder cancellation', async () => {
    const deleteAllArchivedMutation = jest.fn(async () => ({
      deletedCount: 1,
      habitIds: ['server-habit'],
    }));
    jest.spyOn(Alert, 'alert').mockImplementation((title, message, buttons) => {
      void title;
      void message;
      buttons?.[1]?.onPress?.();
    });

    const { handleDeleteAll } = useArchiveDeleteActions({
      archivedHabits: [archivedHabit] as never,
      deleteAllArchivedMutation,
      removeHabit: jest.fn(),
    });

    handleDeleteAll();
    await Promise.resolve();

    expect(deleteAllArchivedMutation).toHaveBeenCalledWith({});
    expect(mockCancelHabitReminder).toHaveBeenCalledWith('server-habit');
    expect(mockCancelHabitReminder).not.toHaveBeenCalledWith('habit-1');
  });
});
