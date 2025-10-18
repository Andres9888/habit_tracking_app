import { useMutation, useQuery } from 'convex/react';
import { useEffect, useState } from 'react';
import { api } from '../convex/_generated/api';
import { Checkbox } from './components/Checkbox';

interface Settings {
  showStreaks: boolean;
  showConsistency: boolean;
  showMotivationalMessages: boolean;
  showEmojis: boolean;
  showCalendarView: boolean;
  catTheme: boolean;
  darkMode: boolean;
}

export function SettingsDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const defaultSettings: Settings = {
    catTheme: true,
    darkMode: false,
    showCalendarView: true,
    showConsistency: true,
    showEmojis: true,
    showMotivationalMessages: true,
    showStreaks: true,
  };

  const settings = useQuery(api.settings.get) ?? defaultSettings;
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

  const toggleSetting = (key: keyof Settings) => {
    const newSettings = { ...localSettings, [key]: !localSettings[key] };
    setLocalSettings(newSettings);
    updateSettings(newSettings);

    // Handle dark mode immediately for better UX
    if (key === 'darkMode') {
      document.documentElement.classList.toggle('dark', newSettings.darkMode);
    }
  };

  // Apply dark mode on component mount/update
  useEffect(() => {
    document.documentElement.classList.toggle('dark', localSettings.darkMode);
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
          <label className='flex w-full items-center justify-between rounded-lg py-2'>
            <span className='text-foreground'>Dark Theme</span>
            <Checkbox
              aria-label='Toggle dark theme'
              checked={localSettings.darkMode}
              variant='primary'
              onPress={() => toggleSetting('darkMode')}
            />
          </label>

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
