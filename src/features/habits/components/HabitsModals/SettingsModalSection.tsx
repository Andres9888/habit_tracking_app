import SettingsModal from '../../../../components/SettingsModal';
import { useStreakReminderSettings } from '../../../../hooks/useStreakReminders';
import { usePremium } from '../../../../hooks/usePremium';
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
  const streakReminders = useStreakReminderSettings();
  const { isPremium } = usePremium();

  return (
    <SettingsModal
      celebrationsEnabled={celebrationsEnabled}
      dayShape={settings?.dayShape ?? 'square'}
      habitCompletionIcon={settings?.habitCompletionIcon ?? 'chain'}
      isHighContrastActive={settings?.highContrastMode ?? false}
      isPremium={isPremium}
      showCharacterScreen={settings?.showCharacterScreen ?? true}
      showHabitStrengthPercentage={showHabitStrengthPercentage}
      showNotesStats={settings?.showNotesStats ?? true}
      streakRemindersEnabled={streakReminders.enabled}
      streakReminderTime={streakReminders.reminderTime}
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
      onChangeStreakReminderTime={streakReminders.setReminderTime}
      onClose={closeSettings}
      onOpenHapticTest={openHapticTest}
      onToggleStreakReminders={streakReminders.setEnabled}
    />
  );
}
