import { useEffect, useState } from 'react';
import type { SettingsModalSettingsDocument } from './types';
import type { ConnectorStyle } from '../../../convex/settings/types';
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
  const [compactView, setCompactViewState] = useState(false);
  const [showGradientFill, setShowGradientFillState] = useState(true);
  const [connectorStyle, setConnectorStyleState] =
    useState<ConnectorStyle>('full');

  useEffect(() => {
    if (settings) {
      setDarkModeState(normalizeDarkModePreference(settings.darkMode));
      setReduceMotionState(settings.reduceMotion ?? false);
      setCompactViewState(settings.compactView ?? false);
      setShowGradientFillState(settings.showGradientFill ?? true);
      setConnectorStyleState(settings.connectorStyle ?? 'full');
    }
  }, [settings]);

  return {
    compactView,
    connectorStyle,
    darkModePreference,
    reduceMotion,
    setCompactViewState,
    setConnectorStyleState,
    setDarkModeState,
    setReduceMotionState,
    setShowGradientFillState,
    showGradientFill,
  };
}
