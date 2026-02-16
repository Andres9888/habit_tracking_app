import { useMutation, useQuery } from 'convex/react';
import { useCallback, useEffect, useRef, useState } from 'react';
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

  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (settings) {
      setDarkModeState(normalizeDarkModePreference(settings.darkMode));
      setReduceMotionState(settings.reduceMotion);
      setHighContrastModeState(settings.highContrastMode);
      setUseDyslexicFontState(settings.useDyslexicFont);
      setShowGradientFillState(settings.showGradientFill);
    }
  }, [settings]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  const handleClose = useCallback(() => {
    onClose();
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => setView('settings'), 300);
  }, [onClose]);

  const update = useCallback(
    async (patch: Record<string, unknown>) => {
      if (settings) await updateSettings({ ...settings, ...patch });
    },
    [settings, updateSettings]
  );

  const setDarkModePreference = useCallback(async (value: DarkModePreference) => {
    setDarkModeState(value);
    await update({ darkMode: value });
  }, [update]);
  const setReduceMotion = useCallback(async (value: boolean) => {
    setReduceMotionState(value);
    await update({ reduceMotion: value });
  }, [update]);
  const setHighContrastMode = useCallback(async (value: boolean) => {
    setHighContrastModeState(value);
    await update({ highContrastMode: value });
  }, [update]);
  const setUseDyslexicFont = useCallback(async (value: boolean) => {
    setUseDyslexicFontState(value);
    await update({ useDyslexicFont: value });
  }, [update]);
  const setShowGradientFill = useCallback(async (value: boolean) => {
    setShowGradientFillState(value);
    await update({ showGradientFill: value });
  }, [update]);

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
