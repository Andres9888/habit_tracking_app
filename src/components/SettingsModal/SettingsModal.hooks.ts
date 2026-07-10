import { useMutation } from 'convex/react';
import { useCallback, useEffect, useState } from 'react';
import { api } from '../../../convex/_generated/api';
import type { SettingsModalSettingsDocument } from './types';
import { DEFAULT_SETTINGS } from '../../../convex/settings/types';
import { sanitizeSettingsPayload } from '../../lib/settings/sanitizeSettingsPayload';
import { updateSettingsWithFallback } from '../../lib/settings/updateSettingsWithFallback';
import { createSettingsUpdaters } from './SettingsModal.settingsUpdaters';
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
  const settings = settingsDocument;
  const updateSettings = useMutation(api.settings.update);
  const localPrefs = useSettingsLocalPrefs(settings);

  useEffect(() => {
    if (visible) {
      setViewState('settings');
      setViewDirection('none');
    }
  }, [visible]);

  const setView = useCallback(
    (next: 'settings' | 'archived' | 'account' | 'calendar') => {
      setViewDirection(next === 'settings' ? 'back' : 'forward');
      setViewState(next);
    },
    []
  );

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const update = useCallback(
    async (patch: Record<string, unknown>) => {
      const baseSettings =
        settings == null
          ? (DEFAULT_SETTINGS as Record<string, unknown>)
          : (settings as Record<string, unknown>);

      await updateSettingsWithFallback(
        updateSettings,
        sanitizeSettingsPayload({ ...baseSettings, ...patch })
      );
    },
    [settings, updateSettings]
  );

  const updaters = createSettingsUpdaters(update, {
    setCompactViewState: localPrefs.setCompactViewState,
    setConnectorStyleState: localPrefs.setConnectorStyleState,
    setDarkModeState: localPrefs.setDarkModeState,
    setReduceMotionState: localPrefs.setReduceMotionState,
    setShowGradientFillState: localPrefs.setShowGradientFillState,
  });

  const habitSortMode = (settings?.habitSortMode as string) ?? 'manual';

  return {
    compactView: localPrefs.compactView,
    connectorStyle: localPrefs.connectorStyle,
    darkModePreference: localPrefs.darkModePreference,
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
