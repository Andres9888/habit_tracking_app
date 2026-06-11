import { useMutation } from 'convex/react';
import { useCallback, useEffect, useState } from 'react';
import { api } from '../../../convex/_generated/api';
import type { SettingsModalSettingsDocument } from './types';
import { DEFAULT_SETTINGS } from '../../../convex/settings/types';
import { sanitizeSettingsPayload } from '../../lib/settings/sanitizeSettingsPayload';
import { updateSettingsWithFallback } from '../../lib/settings/updateSettingsWithFallback';
import {
  createSettingsUpdaters,
  normalizeDarkModePreference,
  type DarkModePreference,
} from './SettingsModal.settingsUpdaters';

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
  const [view, setView] = useState<'settings' | 'archived' | 'account'>(
    'settings'
  );
  const settings = settingsDocument;
  const updateSettings = useMutation(api.settings.update);

  const [darkModePreference, setDarkModeState] =
    useState<DarkModePreference>('system');
  const [reduceMotion, setReduceMotionState] = useState(false);
  const [highContrastMode, setHighContrastModeState] = useState(false);
  const [useDyslexicFont, setUseDyslexicFontState] = useState(false);
  const [compactView, setCompactViewState] = useState(false);
  const [showGradientFill, setShowGradientFillState] = useState(true);
  const [showStreakConnections, setShowStreakConnectionsState] = useState(true);

  useEffect(() => {
    if (settings) {
      setDarkModeState(normalizeDarkModePreference(settings.darkMode));
      setReduceMotionState(settings.reduceMotion);
      setHighContrastModeState(settings.highContrastMode);
      setUseDyslexicFontState(settings.useDyslexicFont);
      setCompactViewState(settings.compactView ?? false);
      setShowGradientFillState(settings.showGradientFill ?? true);
      setShowStreakConnectionsState(settings.showStreakConnections ?? true);
    }
  }, [settings]);

  useEffect(() => {
    if (visible) setView('settings');
  }, [visible]);

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
    setCompactViewState,
    setDarkModeState,
    setHighContrastModeState,
    setReduceMotionState,
    setShowGradientFillState,
    setShowStreakConnectionsState,
    setUseDyslexicFontState,
  });

  const habitSortMode = (settings?.habitSortMode as string) ?? 'manual';

  return {
    compactView,
    darkModePreference,
    habitSortMode,
    handleClose,
    highContrastMode,
    reduceMotion,
    setCompactView: updaters.setCompactView,
    setDarkModePreference: updaters.setDarkModePreference,
    setHabitSortMode: updaters.setHabitSortMode,
    setHighContrastMode: updaters.setHighContrastMode,
    setReduceMotion: updaters.setReduceMotion,
    setShowGradientFill: updaters.setShowGradientFill,
    setShowStreakConnections: updaters.setShowStreakConnections,
    setUseDyslexicFont: updaters.setUseDyslexicFont,
    setView,
    showGradientFill,
    showStreakConnections,
    useDyslexicFont,
    view,
  };
};
