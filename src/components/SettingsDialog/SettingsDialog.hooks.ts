import { useMutation, useQuery } from 'convex/react';
import { useEffect, useState } from 'react';
import { api } from '../../../convex/_generated/api';
import { DEFAULT_SETTINGS } from './SettingsDialog.config';
import type { Settings } from './SettingsDialog.types';

export function useSettingsDialog(isOpen: boolean) {
  const settings = useQuery(api.settings.get) ?? DEFAULT_SETTINGS;
  const updateSettings = useMutation(api.settings.update);
  const [localSettings, setLocalSettings] = useState<Settings>(settings);

  // Sync local settings when dialog opens
  useEffect(() => {
    if (isOpen) {
      setLocalSettings(settings);
    }
  }, [isOpen, settings]);

  // Apply dark mode class
  useEffect(() => {
    document.documentElement.classList.toggle('dark', localSettings.darkMode);
  }, [localSettings.darkMode]);

  const toggleSetting = (key: keyof Settings) => {
    const newSettings = { ...localSettings, [key]: !localSettings[key] };
    setLocalSettings(newSettings);
    updateSettings(newSettings);
  };

  return { localSettings, toggleSetting };
}

export function useEscapeKey(onEscape: () => void) {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onEscape();
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onEscape]);
}
