import { useMutation, useQuery } from 'convex/react';
import { useEffect, useState } from 'react';
import { api } from '../../../convex/_generated/api';
import { DEFAULT_SETTINGS } from './SettingsDialog.config';
import type {
  DarkModePreference,
  Settings,
  ToggleableSettingKey,
} from './SettingsDialog.types';

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

  return DEFAULT_SETTINGS.darkMode;
};

const normalizeHabitCompletionIcon = (
  value: unknown
): Settings['habitCompletionIcon'] => {
  if (value === 'chain' || value === 'checkbox') {
    return value;
  }

  return DEFAULT_SETTINGS.habitCompletionIcon;
};

const resolveShouldUseDark = (preference: DarkModePreference) => {
  if (preference === 'dark') return true;
  if (preference === 'light') return false;

  if (globalThis.window !== undefined && globalThis.matchMedia) {
    return globalThis.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  return false;
};

export function useSettingsDialog(isOpen: boolean) {
  const serverSettings = useQuery(api.settings.get);
  const settings: Settings = serverSettings
    ? {
        ...serverSettings,
        darkMode: normalizeDarkModePreference(serverSettings.darkMode),
        habitCompletionIcon: normalizeHabitCompletionIcon(
          serverSettings.habitCompletionIcon
        ),
      }
    : { ...DEFAULT_SETTINGS };
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
    document.documentElement.classList.toggle(
      'dark',
      resolveShouldUseDark(localSettings.darkMode)
    );
  }, [localSettings.darkMode]);

  useEffect(() => {
    if (localSettings.darkMode !== 'system') return;
    if (globalThis.window === undefined || !globalThis.matchMedia) return;

    const mediaQuery = globalThis.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (event: MediaQueryListEvent) => {
      document.documentElement.classList.toggle('dark', event.matches);
    };

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, [localSettings.darkMode]);

  const toggleSetting = (key: ToggleableSettingKey) => {
    const newSettings = { ...localSettings, [key]: !localSettings[key] };
    setLocalSettings(newSettings);
    updateSettings(newSettings);
  };

  const updateTheme = (value: DarkModePreference) => {
    setLocalSettings((prev) => {
      const updatedSettings = { ...prev, darkMode: value };
      updateSettings(updatedSettings);
      return updatedSettings;
    });
  };

  const updateHabitCompletionIcon = (value: Settings['habitCompletionIcon']) => {
    setLocalSettings((prev) => {
      const updatedSettings = { ...prev, habitCompletionIcon: value };
      updateSettings(updatedSettings);
      return updatedSettings;
    });
  };

  return {
    localSettings,
    toggleSetting,
    updateHabitCompletionIcon,
    updateTheme,
  };
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
