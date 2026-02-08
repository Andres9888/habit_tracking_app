import SettingsModal from '../../../../components/SettingsModal';
import type { SettingsModalSectionProps } from './HabitsModals.types';

/**
 * Settings modal section - handles app settings configuration
 */
export function SettingsModalSection({
  celebrationsEnabled,
  settings,
  showSettings,
  showHabitStrengthPercentage,
  closeSettings,
  openHapticTest,
  setShowHabitStrengthPercentage,
  onSettingsChange,
}: SettingsModalSectionProps) {
  return (
    <SettingsModal
      celebrationsEnabled={celebrationsEnabled}
      dayShape={settings?.dayShape ?? 'square'}
      habitCompletionIcon={settings?.habitCompletionIcon ?? 'chain'}
      isHighContrastActive={settings?.highContrastMode ?? false}
      showCharacterScreen={settings?.showCharacterScreen ?? true}
      showHabitStrengthPercentage={showHabitStrengthPercentage}
      showNotesStats={settings?.showNotesStats ?? true}
      visible={showSettings}
      onChangeDayShape={(value) => onSettingsChange({ dayShape: value })}
      onChangeHabitCompletionIcon={(value) =>
        onSettingsChange({ habitCompletionIcon: value })
      }
      onChangeShowCharacterScreen={(value) =>
        onSettingsChange({ showCharacterScreen: value })
      }
      onChangeShowHabitStrengthPercentage={(value) =>
        setShowHabitStrengthPercentage(value)
      }
      onChangeShowNotesStats={(value) =>
        onSettingsChange({ showNotesStats: value })
      }
      onClose={closeSettings}
      onOpenHapticTest={__DEV__ ? openHapticTest : undefined}
    />
  );
}
