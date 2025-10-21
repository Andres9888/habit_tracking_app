import { useMutation, useQuery } from 'convex/react';
import { useEffect, useState } from 'react';
import { api } from '../../../convex/_generated/api';

interface UseSettingsModalLogicProps {
  visible: boolean;
  onClose: () => void;
}

type DarkModePreference = 'system' | 'light' | 'dark';

const normalizeDarkModePreference = (value: unknown): DarkModePreference => {
  if (value === 'dark' || value === 'light' || value === 'system') {
    return value;
  }

  if (value === true) {
    return 'dark';
  }

  if (value === false) {
    return 'light';
  }

  return 'system';
};

export const useSettingsModalLogic = ({
  visible,
  onClose,
}: UseSettingsModalLogicProps) => {
  const [view, setView] = useState<'settings' | 'archived'>('settings');

  // Get settings from Convex
  const settings = useQuery(api.settings.get);
  const updateSettings = useMutation(api.settings.update);

  // Local state for settings
  const [darkModePreference, setDarkModeState] = useState<DarkModePreference>('system');
  const [reduceMotion, setReduceMotionState] = useState(false);
  const [highContrastMode, setHighContrastModeState] = useState(false);
  const [useDyslexicFont, setUseDyslexicFontState] = useState(false);

  // Sync local state with Convex settings
  useEffect(() => {
    if (settings) {
      setDarkModeState(normalizeDarkModePreference(settings.darkMode));
      setReduceMotionState(settings.reduceMotion);
      setHighContrastModeState(settings.highContrastMode);
      setUseDyslexicFontState(settings.useDyslexicFont);
    }
  }, [settings]);

  // Reset to settings view when modal closes
  const handleClose = () => {
    onClose();
    setTimeout(() => setView('settings'), 300); // Reset after animation
  };

  // Setting updaters
  const setDarkModePreference = async (value: DarkModePreference) => {
    setDarkModeState(value);
    if (settings) {
      await updateSettings({
        ...settings,
        darkMode: value,
      });
    }
  };

  const setReduceMotion = async (value: boolean) => {
    setReduceMotionState(value);
    if (settings) {
      await updateSettings({
        ...settings,
        reduceMotion: value,
      });
    }
  };

  const setHighContrastMode = async (value: boolean) => {
    setHighContrastModeState(value);
    if (settings) {
      await updateSettings({
        ...settings,
        highContrastMode: value,
      });
    }
  };

  const setUseDyslexicFont = async (value: boolean) => {
    setUseDyslexicFontState(value);
    if (settings) {
      await updateSettings({
        ...settings,
        useDyslexicFont: value,
      });
    }
  };

  return {
    handleClose,
    setView,
    view,
    darkModePreference,
    setDarkModePreference,
    reduceMotion,
    setReduceMotion,
    highContrastMode,
    setHighContrastMode,
    useDyslexicFont,
    setUseDyslexicFont,
  };
};
