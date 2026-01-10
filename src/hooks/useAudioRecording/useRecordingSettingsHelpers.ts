/**
 * useRecordingSettingsHelpers Hook
 * Provides settings and permission alert helpers for audio recording
 */

import { useCallback } from 'react';
import {
  openMicrophoneSettings,
  showMicrophonePermissionAlert,
} from './permissionUtils';
import { INITIAL_RECORDING_STATUS } from './constants';
import type { RecordingStatus } from './types';

interface UseRecordingSettingsHelpersParams {
  setStatus: React.Dispatch<React.SetStateAction<RecordingStatus>>;
  resetRefs: () => void;
  onOpenSettings?: () => void;
}

export function useRecordingSettingsHelpers({
  setStatus,
  resetRefs,
  onOpenSettings,
}: UseRecordingSettingsHelpersParams) {
  const reset = useCallback(() => {
    setStatus((p) => ({
      ...INITIAL_RECORDING_STATUS,
      canAskAgain: p.canAskAgain,
      hasPermission: p.hasPermission,
    }));
    resetRefs();
  }, [setStatus, resetRefs]);

  const openSettings = useCallback(() => {
    openMicrophoneSettings();
    onOpenSettings?.();
  }, [onOpenSettings]);

  const showPermissionAlert = useCallback(() => {
    showMicrophonePermissionAlert({ onOpenSettings });
  }, [onOpenSettings]);

  return { openSettings, reset, showPermissionAlert };
}
