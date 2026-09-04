import { act, renderHook } from '@testing-library/react-native';
import { useCreateHabitModal } from '../useCreateHabitModal';
import { showCreateError } from '../../../../utils/errorAlerts';

const mockCreate = jest.fn();
const mockEdit = jest.fn();
jest.mock('../useCreateHabitHandlers', () => ({
  useCreateHabitHandlers: () => ({
    handleCreate: mockCreate,
    handleEdit: mockEdit,
  }),
}));
jest.mock('../useHabitForm', () => ({
  useHabitForm: () => ({
    habitName: 'Read',
    fullHabitName: 'Read',
    remindersEnabled: false,
    closeColorPicker: jest.fn(),
    setShowTimePicker: jest.fn(),
    resetForm: jest.fn(),
  }),
}));
jest.mock('../../../../hooks/useHapticFeedback', () => ({
  __esModule: true,
  default: () => ({ triggerSuccess: jest.fn() }),
}));
jest.mock('../useHabitReminders', () => ({
  checkReminderPermissions: jest
    .fn()
    .mockResolvedValue({ hasReminders: false }),
}));
jest.mock('../../../../utils/errorAlerts', () => ({
  showCreateError: jest.fn(),
}));

describe('create habit retry keeps the focus request in sync', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    mockCreate.mockReset();
  });
  afterEach(() => jest.useRealTimers());

  it('re-keys the same optimistic id to the server id after a retried failure', async () => {
    mockCreate.mockRejectedValueOnce(new Error('Save failed'));
    mockCreate.mockResolvedValueOnce('server-created');
    const onHabitCreated = jest.fn();
    const onHabitCreateSynced = jest.fn();
    const { result } = renderHook(() =>
      useCreateHabitModal({
        visible: true,
        onClose: jest.fn(),
        onHabitCreated,
        onHabitCreateSynced,
      })
    );

    await act(async () => {
      await result.current.handleCreate();
    });
    // The focus request is raised as the form closes…
    expect(onHabitCreated).toHaveBeenCalledTimes(1);
    const tempId = onHabitCreated.mock.calls[0][0];
    expect(showCreateError).toHaveBeenCalledTimes(1);
    expect(onHabitCreateSynced).not.toHaveBeenCalled();

    const retry = jest.mocked(showCreateError).mock.calls[0][0]!;
    await act(async () => {
      retry();
    });

    expect(mockCreate.mock.calls[1][0].clientRequestId).toBe(
      mockCreate.mock.calls[0][0].clientRequestId
    );
    expect(onHabitCreateSynced).toHaveBeenCalledWith(tempId, 'server-created');
    // …and renewed by the retry with the same id, so a request that expired
    // while the alert was open comes back.
    expect(onHabitCreated).toHaveBeenCalledTimes(2);
    expect(onHabitCreated.mock.calls[1][0]).toBe(tempId);
  });
});
