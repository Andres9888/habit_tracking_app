import SettingsModal from '../../../../components/SettingsModal';
import type { SettingsModalSectionProps } from './HabitsModals.types';

/**
 * Settings modal section - handles app settings configuration
 */
export function SettingsModalSection({
  settings,
  showSettings,
  closeSettings,
  onSettingsChange,
}: SettingsModalSectionProps) {
  return (
    <SettingsModal
      dayShape={settings?.dayShape ?? 'square'}
      habitCompletionIcon={settings?.habitCompletionIcon ?? 'chain'}
      showWeekCompletionBar={settings?.showWeekCompletionBar ?? true}
      visible={showSettings}
      onChangeDayShape={(value) => onSettingsChange({ dayShape: value })}
      onChangeHabitCompletionIcon={(value) =>
        onSettingsChange({ habitCompletionIcon: value })
      }
      onChangeShowWeekCompletionBar={(value) =>
        onSettingsChange({ showWeekCompletionBar: value })
      }
      onClose={closeSettings}
    />
  );
}
