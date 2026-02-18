/* eslint-disable max-lines-per-function */
import { useCallback } from 'react';
import SettingsModal from '../../../../components/SettingsModal';
import { useStreakReminderSettings } from '../../../../hooks/useStreakReminders';
import { usePremium } from '../../../../hooks/usePremium';
import { SortBottomSheet } from '../SortBottomSheet';
import type { HabitSortMode } from '../../types';
import type { SettingsModalSectionProps } from './HabitsModals.types';

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
    <>
      <SettingsModal
        celebrationsEnabled={celebrationsEnabled}
        completionSoundEnabled={settings?.completionSoundEnabled ?? false}
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
        onChangeCompletionSoundEnabled={(value) =>
          onSettingsChange({ completionSoundEnabled: value })
        }
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
        onOpenSortSheet={openSortSheet}
        onToggleStreakReminders={streakReminders.setEnabled}
      />
      <SortBottomSheet
        reduceMotion={reduceMotionPreference}
        sortMode={settings?.habitSortMode ?? 'manual'}
        visible={showSortSheet}
        onClose={closeSortSheet}
        onSelectSortMode={handleSelectSortMode}
      />
    </>
  );
}
