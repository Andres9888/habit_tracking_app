import { act, renderHook } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { useAccountDangerActions } from '../useAccountDangerActions';
import {
  clearAccountDeletionRecovery,
  markAppDataDeletedForAccount,
  needsIdentityDeletionRecovery,
} from '../accountDeletionRecovery';

const mockDeleteCurrentUserData = jest.fn();
const mockDeleteUser = jest.fn();
const mockAlert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

jest.mock('convex/react', () => ({
  useMutation: () => mockDeleteCurrentUserData,
}));

jest.mock('@clerk/clerk-expo', () => ({
  useClerk: () => ({ signOut: jest.fn() }),
  useUser: () => ({ user: { delete: mockDeleteUser, id: 'user_123' } }),
}));

jest.mock('../../../../convex/_generated/api', () => ({
  api: { users: { deleteCurrentUserData: 'deleteCurrentUserData' } },
}));

jest.mock('../accountDeletionRecovery', () => ({
  clearAccountDeletionRecovery: jest.fn(),
  markAppDataDeletedForAccount: jest.fn(),
  needsIdentityDeletionRecovery: jest.fn(),
}));

function deleteConfirmationHandler() {
  const buttons = mockAlert.mock.calls.at(-1)?.[2] as Array<{
    onPress?: () => void;
    text?: string;
  }>;
  const deleteButton = buttons.find((button) => button.text === 'Delete');
  if (!deleteButton?.onPress) throw new Error('Delete confirmation missing');
  return deleteButton.onPress;
}

async function confirmDeletion(handler: () => void): Promise<void> {
  await act(async () => {
    handler();
    await new Promise((resolve) => setImmediate(resolve));
  });
}

describe('useAccountDangerActions account deletion', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAlert.mockImplementation(() => {});
    mockDeleteCurrentUserData.mockResolvedValue({});
    mockDeleteUser.mockResolvedValue(undefined);
    (needsIdentityDeletionRecovery as jest.Mock).mockResolvedValue(false);
    (markAppDataDeletedForAccount as jest.Mock).mockResolvedValue(undefined);
    (clearAccountDeletionRecovery as jest.Mock).mockResolvedValue(undefined);
  });

  it('keeps a recovery marker when Clerk deletion fails after app data is deleted', async () => {
    mockDeleteUser.mockRejectedValueOnce(new Error('Clerk unavailable'));
    const { result } = renderHook(() => useAccountDangerActions());

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
    });
    act(() => result.current.handleDeleteAccount());
    await confirmDeletion(deleteConfirmationHandler());

    expect(mockDeleteCurrentUserData).toHaveBeenCalledWith({});
    expect(markAppDataDeletedForAccount).toHaveBeenCalledWith('user_123');
    expect(mockDeleteUser).toHaveBeenCalledTimes(1);
    expect(clearAccountDeletionRecovery).not.toHaveBeenCalled();
    expect(result.current.needsIdentityCleanup).toBe(true);
  });

  it('replays the idempotent app-data purge before a successful retry', async () => {
    mockDeleteUser
      .mockRejectedValueOnce(new Error('Clerk unavailable'))
      .mockResolvedValueOnce(undefined);
    const { result } = renderHook(() => useAccountDangerActions());

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
    });
    act(() => result.current.handleDeleteAccount());
    await confirmDeletion(deleteConfirmationHandler());
    act(() => result.current.handleDeleteAccount());
    await confirmDeletion(deleteConfirmationHandler());

    expect(mockDeleteCurrentUserData).toHaveBeenCalledTimes(2);
    expect(mockDeleteUser).toHaveBeenCalledTimes(2);
    expect(clearAccountDeletionRecovery).toHaveBeenCalledTimes(1);
    expect(result.current.needsIdentityCleanup).toBe(false);
  });

  it('does not call Clerk or write recovery state when app-data deletion fails', async () => {
    mockDeleteCurrentUserData.mockRejectedValueOnce(new Error('Convex unavailable'));
    const { result } = renderHook(() => useAccountDangerActions());

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
    });
    act(() => result.current.handleDeleteAccount());
    await confirmDeletion(deleteConfirmationHandler());

    expect(markAppDataDeletedForAccount).not.toHaveBeenCalled();
    expect(mockDeleteUser).not.toHaveBeenCalled();
  });

  it('does not call Clerk when persisting the recovery marker fails', async () => {
    (markAppDataDeletedForAccount as jest.Mock).mockRejectedValueOnce(
      new Error('Storage unavailable')
    );
    const { result } = renderHook(() => useAccountDangerActions());

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
    });
    act(() => result.current.handleDeleteAccount());
    await confirmDeletion(deleteConfirmationHandler());

    expect(mockDeleteCurrentUserData).toHaveBeenCalledWith({});
    expect(mockDeleteUser).not.toHaveBeenCalled();
  });
});
