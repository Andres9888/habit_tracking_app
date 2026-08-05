/**
 * Hook for managing microphone permissions
 *
 * Story T10.2: Audio recording integration (expo-audio)
 */

import { useCallback } from 'react';
import { requestRecordingPermissionsAsync } from 'expo-audio';
import type { RecordingStatus } from './types';

type SetStatus = React.Dispatch<React.SetStateAction<RecordingStatus>>;

interface UseRecordingPermissionOptions {
  onError?: (error: Error) => void;
  onPermissionDenied?: (canAskAgain: boolean) => void;
}

export function useRecordingPermission(
  setStatus: SetStatus,
  options?: UseRecordingPermissionOptions
) {
  const { onError, onPermissionDenied } = options || {};

  /**
   * Request microphone permission
   * Returns true if granted, false otherwise
   * Updates status with permission state and canAskAgain flag
   */
  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      setStatus((prev) => ({
        ...prev,
        errorMessage: null,
        state: 'requesting-permission',
      }));

      const permissionResponse = await requestRecordingPermissionsAsync();
      const { granted, canAskAgain } = permissionResponse;

      setStatus((prev) => ({
        ...prev,
        canAskAgain: canAskAgain ?? true,
        errorMessage: granted
          ? null
          : canAskAgain
            ? 'Microphone permission denied. Please try again.'
            : 'Microphone permission denied. Please enable it in Settings.',
        hasPermission: granted,
        state: granted ? 'idle' : 'permission-denied',
      }));

      if (!granted) {
        onPermissionDenied?.(canAskAgain ?? true);
      }

      return granted;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to request permission';
      setStatus((prev) => ({
        ...prev,
        canAskAgain: true,
        errorMessage,
        hasPermission: false,
        state: 'error',
      }));
      onError?.(error instanceof Error ? error : new Error(errorMessage));
      return false;
    }
  }, [onError, onPermissionDenied, setStatus]);

  return { requestPermission };
}
