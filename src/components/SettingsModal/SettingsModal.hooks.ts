import { useMutation } from 'convex/react';
import { useCallback, useEffect, useState } from 'react';
import { api } from '../../../convex/_generated/api';
import type { SettingsModalSettingsDocument } from './types';
import { DEFAULT_SETTINGS } from '../../../convex/settings/types';
import {
  sanitizeSettingsPayload,
} from '../../lib/settings/sanitizeSettingsPayload';
import { updateSettingsWithFallback } from '../../lib/settings/updateSettingsWithFallback';

interface UseSettingsModalLogicProps {
  visible: boolean;
  onClose: () => void;
  settingsDocument?: SettingsModalSettingsDocument;
}

type DarkModePreference = 'system' | 'light' | 'dark';

const normalizeDarkModePreference = (value: unknown): DarkModePreference => {
  if (value === 'dark' || value === 'light' || value === 'system') return value;
  if (value === true) return 'dark';
  if (value === false) return 'light';
  return 'system';
};

export const useSettingsModalLogic = ({
  onClose,
  settingsDocument,
  visible,
}: UseSettingsModalLogicProps) => {
  const [view, setView] = useState<'settings' | 'archived' | 'paused' | 'sort'>(
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

  useEffect(() => {
    if (settings) {
      setDarkModeState(normalizeDarkModePreference(settings.darkMode));
      setReduceMotionState(settings.reduceMotion ?? false);
      setHighContrastModeState(settings.highContrastMode ?? false);
      setUseDyslexicFontState(settings.useDyslexicFont ?? false);
      setCompactViewState(settings.compactView ?? false);
      setShowGradientFillState(settings.showGradientFill ?? true);
    }
  }, [settings]);

  // Reset view to 'settings' whenever the modal opens
  useEffect(() => {
    if (visible) {
      setView('settings');
    }
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

  const setDarkModePreference = async (value: DarkModePreference) => {
    setDarkModeState(value);
    await update({ darkMode: value });
  };
  const setReduceMotion = async (value: boolean) => {
    setReduceMotionState(value);
    await update({ reduceMotion: value });
  };
  const setHighContrastMode = async (value: boolean) => {
    setHighContrastModeState(value);
    await update({ highContrastMode: value });
  };
  const setUseDyslexicFont = async (value: boolean) => {
    setUseDyslexicFontState(value);
    await update({ useDyslexicFont: value });
  };
  const setCompactView = async (value: boolean) => {
    setCompactViewState(value);
    await update({ compactView: value });
  };
  const setShowGradientFill = async (value: boolean) => {
    setShowGradientFillState(value);
    await update({ showGradientFill: value });
  };

  const habitSortMode = (settings?.habitSortMode as string) ?? 'manual';
  const setHabitSortMode = async (value: string) => {
    await update({ habitSortMode: value });
  };

  return {
    compactView,
    darkModePreference,
    habitSortMode,
    handleClose,
    highContrastMode,
    reduceMotion,
    setCompactView,
    setDarkModePreference,
    setHabitSortMode,
    setHighContrastMode,
    setReduceMotion,
    setShowGradientFill,
    setUseDyslexicFont,
    setView,
    showGradientFill,
    useDyslexicFont,
    view,
  };
};
