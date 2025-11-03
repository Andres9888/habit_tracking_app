import { SettingItem } from './SettingItem';
import { SETTINGS_CONFIG } from './SettingsDialog.config';
import { useEscapeKey, useSettingsDialog } from './SettingsDialog.hooks';
import type { SettingsDialogProps } from './SettingsDialog.types';

export function SettingsDialog({ isOpen, onClose }: SettingsDialogProps) {
  const { localSettings, toggleSetting, updateTheme } =
    useSettingsDialog(isOpen);
  useEscapeKey(onClose);

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
          <h2 className='text-[20px] font-bold leading-[26px] tracking-tight text-foreground'>Settings</h2>
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
              <span className='text-[15px] font-bold text-foreground'>
                Theme
              </span>
              <select
                aria-label='Select theme preference'
                className='w-full rounded-md border border-border bg-background px-3 py-2 text-base text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring'
                value={localSettings.darkMode}
                onChange={(event) =>
                  updateTheme(
                    event.target.value as typeof localSettings.darkMode
                  )
                }
              >
                <option value='system'>Match system</option>
                <option value='light'>Light mode</option>
                <option value='dark'>Dark mode</option>
              </select>
            </label>
          </div>
          {SETTINGS_CONFIG.map((setting) => (
            <SettingItem
              key={setting.key}
              ariaLabel={setting.ariaLabel}
              checked={localSettings[setting.key]}
              label={setting.label}
              onToggle={() => toggleSetting(setting.key)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
