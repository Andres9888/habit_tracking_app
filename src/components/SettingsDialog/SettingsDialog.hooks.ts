import { useMutation, useQuery } from 'convex/react';
import { useEffect, useRef, useState } from 'react';
import { api } from '../../../convex/_generated/api';
import { DEFAULT_SETTINGS } from './SettingsDialog.config';
import type { Settings } from './SettingsDialog.types';

export function useSettingsDialog(isOpen: boolean) {
  const settings = useQuery(api.settings.get) ?? DEFAULT_SETTINGS;
  const updateSettings = useMutation(api.settings.update);
  const [localSettings, setLocalSettings] = useState<Settings>(settings);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync local settings when dialog opens
  useEffect(() => {
    if (isOpen) {
      setLocalSettings(settings);
    }
  }, [isOpen, settings]);

  // Apply dark mode class
  useEffect(() => {
    document.documentElement.classList.toggle('dark', localSettings.darkMode === 'dark');
  }, [localSettings.darkMode]);

  // Debounced settings persist — batches rapid toggles into a single mutation
  const debouncedUpdate = (newSettings: Settings) => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      updateSettings(newSettings);
    }, 300);
  };

  const toggleSetting = (key: keyof Settings) => {
    if (key === 'darkMode') {
      const nextDarkMode: Settings['darkMode'] =
        localSettings.darkMode === 'dark' ? 'light' : 'dark';
      const newSettings: Settings = { ...localSettings, darkMode: nextDarkMode };
      setLocalSettings(newSettings);
      debouncedUpdate(newSettings);
      return;
    }

    const newSettings = { ...localSettings, [key]: !localSettings[key] };
    setLocalSettings(newSettings);
    debouncedUpdate(newSettings);
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
