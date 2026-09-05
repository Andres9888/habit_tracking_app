import { useMutation } from 'convex/react';
import { useCallback, useEffect, useState } from 'react';
import { api } from '../../../convex/_generated/api';
import type { SettingsModalSettingsDocument } from './types';
import { updateSettingsWithFallback } from '../../lib/settings/updateSettingsWithFallback';
import { createSettingsUpdaters } from './SettingsModal.settingsUpdaters';
import {
  parkSettingsView,
  settingsViewOffset,
} from './components/settingsViewTransition';
import { useSettingsLocalPrefs } from './useSettingsLocalPrefs';

interface UseSettingsModalLogicProps {
  visible: boolean;
  onClose: () => void;
  settingsDocument?: SettingsModalSettingsDocument;
}

export const useSettingsModalLogic = ({
  onClose,
  settingsDocument,
  visible,
}: UseSettingsModalLogicProps) => {
  const [view, setViewState] = useState<
    'settings' | 'archived' | 'account' | 'calendar'
  >('settings');
  const [viewDirection, setViewDirection] = useState<
    'forward' | 'back' | 'none'
  >('none');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const settings = settingsDocument;
  const updateSettings = useMutation(api.settings.update);
  const localPrefs = useSettingsLocalPrefs(settings);

  useEffect(() => {
    if (visible) {
      setViewState('settings');
      setViewDirection('none');
      settingsViewOffset.value = 0;
      setErrorMessage(null);
    }
  }, [visible]);

  const setView = useCallback(
    (next: 'settings' | 'archived' | 'account' | 'calendar') => {
      const direction = next === 'settings' ? 'back' : 'forward';
      // Park before the commit that mounts the page, so the shared value
      // reaches the UI runtime ahead of the new view's first frame.
      parkSettingsView(direction);
      setViewDirection(direction);
      setViewState(next);
    },
    []
  );

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const clearError = useCallback(() => setErrorMessage(null), []);

  // Single-key patch, not the whole settings document: `settings.update` is a
  // Convex `db.patch`, so sending every field made concurrent writes from the
  // two callers race and silently revert each other's changes.
  const update = useCallback(
    async (patch: Record<string, unknown>) => {
      await updateSettingsWithFallback(updateSettings, patch);
    },
    [updateSettings]
  );

  const updaters = createSettingsUpdaters(
    update,
    {
      setCompactViewState: localPrefs.setCompactViewState,
      setConnectorStyleState: localPrefs.setConnectorStyleState,
      setDarkModeState: localPrefs.setDarkModeState,
      setReduceMotionState: localPrefs.setReduceMotionState,
      setShowGradientFillState: localPrefs.setShowGradientFillState,
    },
    {
      compactView: localPrefs.compactView,
      connectorStyle: localPrefs.connectorStyle,
      darkModePreference: localPrefs.darkModePreference,
      reduceMotion: localPrefs.reduceMotion,
      showGradientFill: localPrefs.showGradientFill,
    },
    setErrorMessage
  );

  const habitSortMode = (settings?.habitSortMode as string) ?? 'manual';

  return {
    clearError,
    compactView: localPrefs.compactView,
    connectorStyle: localPrefs.connectorStyle,
    darkModePreference: localPrefs.darkModePreference,
    errorMessage,
    habitSortMode,
    handleClose,
    reduceMotion: localPrefs.reduceMotion,
    setCompactView: updaters.setCompactView,
    setConnectorStyle: updaters.setConnectorStyle,
    setDarkModePreference: updaters.setDarkModePreference,
    setHabitSortMode: updaters.setHabitSortMode,
    setReduceMotion: updaters.setReduceMotion,
    setShowGradientFill: updaters.setShowGradientFill,
    setView,
    showGradientFill: localPrefs.showGradientFill,
    view,
    viewDirection,
  };
};
