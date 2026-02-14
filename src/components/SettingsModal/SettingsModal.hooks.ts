import { useMutation, useQuery } from 'convex/react';
import { useCallback, useEffect, useState } from 'react';
import { api } from '../../../convex/_generated/api';

interface UseSettingsModalLogicProps {
  visible: boolean;
  onClose: () => void;
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
}: UseSettingsModalLogicProps) => {
  const [view, setView] = useState<'settings' | 'archived' | 'paused'>(
    'settings'
  );
  const settings = useQuery(api.settings.get);
  const updateSettings = useMutation(api.settings.update);

  const [darkModePreference, setDarkModeState] =
    useState<DarkModePreference>('system');
  const [reduceMotion, setReduceMotionState] = useState(false);
  const [highContrastMode, setHighContrastModeState] = useState(false);
  const [useDyslexicFont, setUseDyslexicFontState] = useState(false);
  const [showGradientFill, setShowGradientFillState] = useState(true);

  useEffect(() => {
    if (settings) {
      setDarkModeState(normalizeDarkModePreference(settings.darkMode));
      setReduceMotionState(settings.reduceMotion);
      setHighContrastModeState(settings.highContrastMode);
      setUseDyslexicFontState(settings.useDyslexicFont);
      setShowGradientFillState(settings.showGradientFill);
    }
  }, [settings]);

  const handleClose = () => {
    onClose();
    setTimeout(() => setView('settings'), 300);
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

  return {
    darkModePreference,
    handleClose,
    highContrastMode,
    reduceMotion,
    setDarkModePreference,
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
