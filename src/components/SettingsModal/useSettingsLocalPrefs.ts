import { useEffect, useState } from 'react';
import type { SettingsModalSettingsDocument } from './types';
import {
  normalizeDarkModePreference,
  type DarkModePreference,
} from './SettingsModal.settingsUpdaters';

export function useSettingsLocalPrefs(
  settings?: SettingsModalSettingsDocument
) {
  const [darkModePreference, setDarkModeState] =
    useState<DarkModePreference>('system');
  const [reduceMotion, setReduceMotionState] = useState(false);
  const [useDyslexicFont, setUseDyslexicFontState] = useState(false);
  const [compactView, setCompactViewState] = useState(false);
  const [showGradientFill, setShowGradientFillState] = useState(true);
  const [showStreakConnections, setShowStreakConnectionsState] = useState(true);

  useEffect(() => {
    if (settings) {
      setDarkModeState(normalizeDarkModePreference(settings.darkMode));
      setReduceMotionState(settings.reduceMotion ?? false);
      setUseDyslexicFontState(settings.useDyslexicFont ?? false);
      setCompactViewState(settings.compactView ?? false);
      setShowGradientFillState(settings.showGradientFill ?? true);
      setShowStreakConnectionsState(settings.showStreakConnections ?? true);
    }
  }, [settings]);

  return {
    compactView,
    darkModePreference,
    reduceMotion,
    setCompactViewState,
    setDarkModeState,
    setReduceMotionState,
    setShowGradientFillState,
    setShowStreakConnectionsState,
    setUseDyslexicFontState,
    showGradientFill,
    showStreakConnections,
    useDyslexicFont,
  };
}
