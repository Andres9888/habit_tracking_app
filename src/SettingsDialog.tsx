import { useMutation, useQuery } from 'convex/react';
import { useEffect, useState } from 'react';
import { api } from '../convex/_generated/api';
import { Checkbox } from "./components/Checkbox";

export function SettingsDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const settings = useQuery(api.settings.get) ?? {
    showStreaks: true,
    showConsistency: true,
    showMotivationalMessages: true,
    showEmojis: true,
    showCalendarView: true,
    catTheme: true,
  };

  const updateSettings = useMutation(api.settings.update);
  const [localSettings, setLocalSettings] = useState(settings);

  if (!isOpen) return null;

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

  const toggleSetting = (key: keyof typeof settings) => {
    const newSettings = { ...localSettings, [key]: !localSettings[key] };
    setLocalSettings(newSettings);
    updateSettings(newSettings);
  };

  return (
    <div
      aria-label="Settings overlay"
      className="fixed inset-0 flex items-center justify-center bg-black/50"
      onClick={onClose}
      role="presentation"
    >
      <div
        aria-modal="true"
        className="w-full max-w-md rounded-xl bg-white p-6"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        tabIndex={-1}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Settings</h2>
          <button
            aria-label="Close settings"
            className="rounded p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
            onClick={onClose}
            type="button"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <label className="flex w-full items-center justify-between rounded-lg py-2">
            <span>Show Streaks</span>
            <Checkbox
              aria-label="Toggle show streaks"
              checked={localSettings.showStreaks}
              onChange={() => toggleSetting('showStreaks')}
              variant="primary"
            />
          </label>

          <label className="flex w-full items-center justify-between rounded-lg py-2">
            <span>Show Consistency</span>
            <Checkbox
              aria-label="Toggle show consistency"
              checked={localSettings.showConsistency}
              onChange={() => toggleSetting('showConsistency')}
              variant="primary"
            />
          </label>

          <label className="flex w-full items-center justify-between rounded-lg py-2">
            <span>Show Motivational Messages</span>
            <Checkbox
              aria-label="Toggle motivational messages"
              checked={localSettings.showMotivationalMessages}
              onChange={() => toggleSetting('showMotivationalMessages')}
              variant="primary"
            />
          </label>

          <label className="flex w-full items-center justify-between rounded-lg py-2">
            <span>Show Emojis</span>
            <Checkbox
              aria-label="Toggle emojis"
              checked={localSettings.showEmojis}
              onChange={() => toggleSetting('showEmojis')}
              variant="primary"
            />
          </label>

          <label className="flex w-full items-center justify-between rounded-lg py-2">
            <span>Enable Calendar View</span>
            <Checkbox
              aria-label="Toggle calendar view"
              checked={localSettings.showCalendarView}
              onChange={() => toggleSetting('showCalendarView')}
              variant="primary"
            />
          </label>

          <label className="flex w-full items-center justify-between rounded-lg py-2">
            <span>Cat Theme</span>
            <Checkbox
              aria-label="Toggle cat theme"
              checked={localSettings.catTheme}
              onChange={() => toggleSetting('catTheme')}
              variant="primary"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
