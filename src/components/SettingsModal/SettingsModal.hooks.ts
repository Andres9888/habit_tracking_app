import { useMutation } from 'convex/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../../../convex/_generated/api';
import type { SettingsModalSettingsDocument } from './types';

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
  const [showGradientFill, setShowGradientFillState] = useState(true);

  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (settings) {
      setDarkModeState(normalizeDarkModePreference(settings.darkMode));
      setReduceMotionState(settings.reduceMotion);
      setHighContrastModeState(settings.highContrastMode);
      setUseDyslexicFontState(settings.useDyslexicFont);
      setShowGradientFillState(settings.showGradientFill ?? true);
    }
  }, [settings]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  const handleClose = () => {
    onClose();
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => setView('settings'), 300);
  };

  const update = useCallback(
    async (patch: Record<string, unknown>) => {
      if (settings) await updateSettings({ ...settings, ...patch });
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
  const setShowGradientFill = async (value: boolean) => {
    setShowGradientFillState(value);
    await update({ showGradientFill: value });
  };

  const habitSortMode = (settings?.habitSortMode as string) ?? 'manual';
  const setHabitSortMode = async (value: string) => {
    await update({ habitSortMode: value });
  };

  return {
    darkModePreference,
    habitSortMode,
    handleClose,
    highContrastMode,
    reduceMotion,
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
