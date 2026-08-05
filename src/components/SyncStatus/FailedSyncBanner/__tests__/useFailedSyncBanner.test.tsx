import { Alert } from 'react-native';
import { renderHook, act } from '@testing-library/react-native';

import { useFailedSyncBanner } from '../useFailedSyncBanner';
import { useSyncStatus } from '../../../../contexts/SyncStatusContext';

jest.mock('../../../../contexts/SyncStatusContext', () => ({
  useSyncStatus: jest.fn(),
}));

const retryFailed = jest.fn();
const discardFailed = jest.fn();

function setStatus(failedCount: number, isSyncing = false) {
  (useSyncStatus as jest.Mock).mockReturnValue({
    status: { failedCount, isSyncing },
    retryFailed,
    discardFailed,
  });
}

describe('useFailedSyncBanner', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    retryFailed.mockResolvedValue(undefined);
  });

  it('is visible only when there are failures and sync is idle', () => {
    setStatus(2, false);
    expect(renderHook(() => useFailedSyncBanner()).result.current.visible).toBe(
      true
    );

    setStatus(2, true);
    expect(renderHook(() => useFailedSyncBanner()).result.current.visible).toBe(
      false
    );

    setStatus(0, false);
    expect(renderHook(() => useFailedSyncBanner()).result.current.visible).toBe(
      false
    );
  });

  it('guards against double-tap retry', async () => {
    setStatus(2);
    let resolve!: () => void;
    retryFailed.mockReturnValue(new Promise<void>((r) => (resolve = r)));

    const { result } = renderHook(() => useFailedSyncBanner());
    act(() => {
      result.current.handleRetry();
      result.current.handleRetry();
    });

    expect(retryFailed).toHaveBeenCalledTimes(1);
    expect(result.current.isRetrying).toBe(true);

    await act(async () => {
      resolve();
    });
    expect(result.current.isRetrying).toBe(false);
  });

  it('confirms via Alert before discarding', () => {
    setStatus(2);
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

    const { result } = renderHook(() => useFailedSyncBanner());
    act(() => result.current.handleDiscard());

    expect(alertSpy).toHaveBeenCalled();
    // Simulate pressing the destructive "Discard" action
    const buttons = alertSpy.mock.calls[0][2] as Array<{
      text: string;
      onPress?: () => void;
    }>;
    const discardButton = buttons.find((b) => b.text === 'Discard');
    discardButton?.onPress?.();
    expect(discardFailed).toHaveBeenCalled();
  });
});
