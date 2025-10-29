import { useMutation, useQuery } from 'convex/react';
import { useEffect, useState } from 'react';
import { api } from '../convex/_generated/api';
import { Checkbox } from './components/Checkbox';

type DarkModePreference = 'system' | 'light' | 'dark';

type ToggleableSettingKey =
  | 'showStreaks'
  | 'showConsistency'
  | 'showMotivationalMessages'
  | 'showEmojis'
  | 'showCalendarView'
  | 'catTheme';

interface Settings {
  showStreaks: boolean;
  showConsistency: boolean;
  showMotivationalMessages: boolean;
  showEmojis: boolean;
  showCalendarView: boolean;
  catTheme: boolean;
  darkMode: DarkModePreference;
}

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

const resolveShouldUseDark = (preference: DarkModePreference) => {
  if (preference === 'dark') return true;
  if (preference === 'light') return false;

  if (globalThis.window !== undefined && globalThis.matchMedia) {
    return globalThis.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  return false;
};

export function SettingsDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const defaultSettings: Settings = {
    catTheme: true,
    darkMode: 'system',
    showCalendarView: true,
    showConsistency: true,
    showEmojis: true,
    showMotivationalMessages: true,
    showStreaks: true,
  };

  const serverSettings = useQuery(api.settings.get);
  const settings = serverSettings
    ? {
        ...serverSettings,
        darkMode: normalizeDarkModePreference(serverSettings.darkMode),
      }
    : defaultSettings;
  const updateSettings = useMutation(api.settings.update);
  const [localSettings, setLocalSettings] = useState<Settings>(settings);

  useEffect(() => {
    if (isOpen) {
      setLocalSettings(settings);
    }
  }, [isOpen, settings]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const toggleSetting = (key: ToggleableSettingKey) => {
    const newSettings = { ...localSettings, [key]: !localSettings[key] };
    setLocalSettings(newSettings);
    updateSettings(newSettings);
  };

  const updateTheme = (value: DarkModePreference) => {
    const newSettings = { ...localSettings, darkMode: value };
    setLocalSettings(newSettings);
    updateSettings(newSettings);
  };

  // Apply dark mode on component mount/update
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

  if (!isOpen) return null;

  return (
    <div
      aria-label='Settings overlay'
      className='fixed inset-0 flex items-center justify-center bg-black/50'
      role='presentation'
      onClick={onClose}
    >
      <div
        aria-modal='true'
        className='w-full max-w-md rounded-xl border border-border bg-card p-6'
        role='dialog'
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='text-xl font-semibold text-foreground'>Settings</h2>
          <button
            aria-label='Close settings'
            className='rounded border border-transparent p-1 text-muted-foreground transition-colors hover:border-border hover:brightness-95'
            type='button'
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className='space-y-4'>
          <div className='rounded-lg border border-border p-4'>
            <label className='flex flex-col gap-2 text-sm font-medium text-muted-foreground'>
              <span className='text-sm font-semibold text-foreground'>
                Theme
              </span>
              <select
                aria-label='Select theme preference'
                className='w-full rounded-md border border-border bg-background px-3 py-2 text-base text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring'
                value={localSettings.darkMode}
                onChange={(event) =>
                  updateTheme(event.target.value as DarkModePreference)
                }
              >
                <option value='system'>Match system</option>
                <option value='light'>Light mode</option>
                <option value='dark'>Dark mode</option>
              </select>
            </label>
          </div>

          <label className='flex w-full items-center justify-between rounded-lg py-2'>
            <span className='text-foreground'>Show Streaks</span>
            <Checkbox
              aria-label='Toggle show streaks'
              checked={localSettings.showStreaks}
              variant='primary'
              onPress={() => toggleSetting('showStreaks')}
            />
          </label>

          <label className='flex w-full items-center justify-between rounded-lg py-2'>
            <span className='text-foreground'>Show Consistency</span>
            <Checkbox
              aria-label='Toggle show consistency'
              checked={localSettings.showConsistency}
              variant='primary'
              onPress={() => toggleSetting('showConsistency')}
            />
          </label>

          <label className='flex w-full items-center justify-between rounded-lg py-2'>
            <span className='text-foreground'>Show Motivational Messages</span>
            <Checkbox
              aria-label='Toggle motivational messages'
              checked={localSettings.showMotivationalMessages}
              variant='primary'
              onPress={() => toggleSetting('showMotivationalMessages')}
            />
          </label>

          <label className='flex w-full items-center justify-between rounded-lg py-2'>
            <span className='text-foreground'>Show Emojis</span>
            <Checkbox
              aria-label='Toggle emojis'
              checked={localSettings.showEmojis}
              variant='primary'
              onPress={() => toggleSetting('showEmojis')}
            />
          </label>

          <label className='flex w-full items-center justify-between rounded-lg py-2'>
            <span className='text-foreground'>Enable Calendar View</span>
            <Checkbox
              aria-label='Toggle calendar view'
              checked={localSettings.showCalendarView}
              variant='primary'
              onPress={() => toggleSetting('showCalendarView')}
            />
          </label>

          <label className='flex w-full items-center justify-between rounded-lg py-2'>
            <span className='text-foreground'>Cat Theme</span>
            <Checkbox
              aria-label='Toggle cat theme'
              checked={localSettings.catTheme}
              variant='primary'
              onPress={() => toggleSetting('catTheme')}
            />
          </label>
        </div>
      </div>
    </div>
  );
}
