import { SettingItem } from './SettingItem';
import { SETTINGS_CONFIG } from './SettingsDialog.config';
import { useEscapeKey, useSettingsDialog } from './SettingsDialog.hooks';
import type { SettingsDialogProps } from './SettingsDialog.types';

export function SettingsDialog({ isOpen, onClose }: SettingsDialogProps) {
  const { localSettings, toggleSetting } = useSettingsDialog(isOpen);
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
          {SETTINGS_CONFIG.map((setting) => (
            <SettingItem
              key={setting.key}
              ariaLabel={setting.ariaLabel}
              checked={localSettings[setting.key] as boolean}
              label={setting.label}
              onToggle={() => toggleSetting(setting.key)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
