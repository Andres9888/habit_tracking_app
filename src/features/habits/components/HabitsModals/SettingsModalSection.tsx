/* eslint-disable max-lines-per-function */
import { lazy, Suspense, useCallback } from 'react';
import { ErrorBoundary } from '../../../../components/ErrorBoundary';
import { useStreakReminderSettings } from '../../../../hooks/useStreakReminders';
import { usePremium } from '../../../../hooks/usePremium';
import type { HabitSortMode } from '../../types';
import type { SettingsModalSectionProps } from './HabitsModals.types';

// Lazy load heavy modal components - only load when modal is opened
const SettingsModal = lazy(() => import('../../../../components/SettingsModal'));
const SortBottomSheet = lazy(() => import('../SortBottomSheet'));

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
    <ErrorBoundary screenName="SettingsModalSection">
      <>
        {showSettings && (
          <Suspense fallback={null}>
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
          </Suspense>
        )}
        {showSortSheet && (
          <Suspense fallback={null}>
            <SortBottomSheet
              reduceMotion={reduceMotionPreference}
              sortMode={settings?.habitSortMode ?? 'manual'}
              visible={showSortSheet}
              onClose={closeSortSheet}
              onSelectSortMode={handleSelectSortMode}
            />
          </Suspense>
        )}
      </>
    </ErrorBoundary>
  );
}
