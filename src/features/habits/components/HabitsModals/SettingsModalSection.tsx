/* eslint-disable max-lines-per-function */
import { useCallback } from 'react';
import SettingsModal from '../../../../components/SettingsModal';
import { useStreakReminderSettings } from '../../../../hooks/useStreakReminders';
import { usePremium } from '../../../../hooks/usePremium';
import { SortBottomSheet } from '../SortBottomSheet';
import type { HabitSortMode } from '../../types';
import type { SettingsModalSectionProps } from './HabitsModals.types';
import type { CompletionSound } from '../../types';

/**
 * Settings modal section - handles app settings + sort sheet
 */
export function SettingsModalSection({
  celebrationsEnabled,
  settings,
  showSettings,
  showHabitStrengthPercentage,
  closeSettings,
  openHapticTest,
  openSortSheet,
  closeSortSheet,
  showSortSheet,
  reduceMotionPreference,
  setShowHabitStrengthPercentage,
  onSettingsChange,
}: SettingsModalSectionProps) {
  const streakReminders = useStreakReminderSettings();
  const { isPremium } = usePremium();
  const handleSelectSortMode = useCallback(
    (mode: HabitSortMode) => void onSettingsChange({ habitSortMode: mode }),
    [onSettingsChange]
  );

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
      completionSoundEnabled={settings?.completionSoundEnabled ?? false}
      completionSoundSelected={settings?.completionSoundSelected ?? 'chime'}
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
      onToggleCompletionSound={(value) =>
        onSettingsChange({ completionSoundEnabled: value })
      }
      onChangeCompletionSound={(value) =>
        onSettingsChange({ completionSoundSelected: value as CompletionSound })
      }
    />
  );
}
