import { useMutation, useQuery } from 'convex/react';
import { useEffect, useState } from 'react';
import { api } from '../convex/_generated/api';
import { Checkbox } from "./components/Checkbox";

interface Settings {
  showStreaks: boolean;
  showConsistency: boolean;
  showMotivationalMessages: boolean;
  showEmojis: boolean;
  showCalendarView: boolean;
  catTheme: boolean;
  darkMode: boolean;
}

export function SettingsDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const defaultSettings: Settings = {
    showStreaks: true,
    showConsistency: true,
    showMotivationalMessages: true,
    showEmojis: true,
    showCalendarView: true,
    catTheme: true,
    darkMode: false,
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
      if (newSettings.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  // Apply dark mode on component mount/update
  useEffect(() => {
    if (localSettings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [localSettings.darkMode]);

  if (!isOpen) return null;

  return (
    <div
      aria-label="Settings overlay"
      className="fixed inset-0 flex items-center justify-center bg-black/50"
      onClick={onClose}
      role="presentation"
    >
      <div
        aria-modal="true"
        className="w-full max-w-md rounded-xl p-6 border border-border bg-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        tabIndex={-1}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Settings</h2>
          <button
            aria-label="Close settings"
            className="rounded p-1 text-muted-foreground transition-colors hover:brightness-95 border border-transparent hover:border-border"
            onClick={onClose}
            type="button"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <label className="flex w-full items-center justify-between rounded-lg py-2">
            <span className="text-foreground">Dark Theme</span>
            <Checkbox
              aria-label="Toggle dark theme"
              checked={localSettings.darkMode}
              onPress={() => toggleSetting('darkMode')}
              variant="primary"
            />
          </label>

          <label className="flex w-full items-center justify-between rounded-lg py-2">
            <span className="text-foreground">Show Streaks</span>
            <Checkbox
              aria-label="Toggle show streaks"
              checked={localSettings.showStreaks}
              onPress={() => toggleSetting('showStreaks')}
              variant="primary"
            />
          </label>

          <label className="flex w-full items-center justify-between rounded-lg py-2">
            <span className="text-foreground">Show Consistency</span>
            <Checkbox
              aria-label="Toggle show consistency"
              checked={localSettings.showConsistency}
              onPress={() => toggleSetting('showConsistency')}
              variant="primary"
            />
          </label>

          <label className="flex w-full items-center justify-between rounded-lg py-2">
            <span className="text-foreground">Show Motivational Messages</span>
            <Checkbox
              aria-label="Toggle motivational messages"
              checked={localSettings.showMotivationalMessages}
              onPress={() => toggleSetting('showMotivationalMessages')}
              variant="primary"
            />
          </label>

          <label className="flex w-full items-center justify-between rounded-lg py-2">
            <span className="text-foreground">Show Emojis</span>
            <Checkbox
              aria-label="Toggle emojis"
              checked={localSettings.showEmojis}
              onPress={() => toggleSetting('showEmojis')}
              variant="primary"
            />
          </label>

          <label className="flex w-full items-center justify-between rounded-lg py-2">
            <span className="text-foreground">Enable Calendar View</span>
            <Checkbox
              aria-label="Toggle calendar view"
              checked={localSettings.showCalendarView}
              onPress={() => toggleSetting('showCalendarView')}
              variant="primary"
            />
          </label>

          <label className="flex w-full items-center justify-between rounded-lg py-2">
            <span className="text-foreground">Cat Theme</span>
            <Checkbox
              aria-label="Toggle cat theme"
              checked={localSettings.catTheme}
              onPress={() => toggleSetting('catTheme')}
              variant="primary"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
