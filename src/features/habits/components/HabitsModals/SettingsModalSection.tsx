/* eslint-disable max-lines, max-lines-per-function */
import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useConvex } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import type { Doc } from '../../../../../convex/_generated/dataModel';
import SettingsModal from '../../../../components/SettingsModal';
import { useStreakReminderSettings } from '../../../../hooks/useStreakReminders';
import { usePremium } from '../../../../hooks/usePremium';
import { getLocalDateString } from '../../../../utils/getLocalDateString';
import { exportData, prepareExportData } from '../../../../utils/exportData';
import { SortBottomSheet } from '../SortBottomSheet';
import type { HabitSortMode } from '../../types';
import type { SettingsModalSettingsDocument } from '../../../../components/SettingsModal/types';
import type { SettingsModalSectionProps } from './HabitsModals.types';

type HabitDoc = Doc<'habits'>;

function mergeUniqueHabits(
  activeHabits: HabitDoc[],
  archivedHabits: HabitDoc[]
): HabitDoc[] {
  const map = new Map<string, HabitDoc>();
  for (const habit of activeHabits) {
    map.set(habit._id, habit);
  }
  for (const habit of archivedHabits) {
    map.set(habit._id, habit);
  }
  return [...map.values()];
}

function buildExportOverviewStats(habits: HabitDoc[]) {
  if (habits.length === 0) {
    return { averageStrength: 0, totalHabits: 0 };
  }

  let totalStrength = 0;
  for (const habit of habits) {
    totalStrength += (habit.strength ?? 0) * 100;
  }

  return {
    averageStrength: totalStrength / habits.length,
    totalHabits: habits.length,
  };
}

function getTrackingStartDate(habits: HabitDoc[]): string {
  if (habits.length === 0) return getLocalDateString();

  let earliestCreatedAt = Number.POSITIVE_INFINITY;
  for (const habit of habits) {
    if (habit.createdAt < earliestCreatedAt) {
      earliestCreatedAt = habit.createdAt;
    }
  }
  if (!Number.isFinite(earliestCreatedAt)) return getLocalDateString();
  return getLocalDateString(new Date(earliestCreatedAt));
}

/**
 * Settings modal section - handles app settings + sort sheet
 */
export function SettingsModalSection({
  archivedHabitsCount,
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
  const convex = useConvex();

  const handleSelectSortMode = useCallback(
    (mode: HabitSortMode) => void onSettingsChange({ habitSortMode: mode }),
    [onSettingsChange]
  );

  const runHabitsExport = useCallback(
    async (format: 'csv' | 'json') => {
      try {
        const [activeHabits, archivedHabits] = await Promise.all([
          convex.query(api.habits.list, {}),
          convex.query(api.habits.listArchived, {}),
        ]);
        const allHabits = mergeUniqueHabits(activeHabits, archivedHabits);

        const tracking =
          allHabits.length === 0
            ? []
            : await convex.query(api.habits.getTracking, {
                endDate: getLocalDateString(),
                startDate: getTrackingStartDate(allHabits),
              });

        const exportPayload = await prepareExportData(
          allHabits,
          tracking,
          buildExportOverviewStats(allHabits)
        );
        await exportData(exportPayload, format);

        Alert.alert(
          'Export Complete',
          `Habits and stats exported as ${format.toUpperCase()}.`,
          [{ text: 'OK' }]
        );
      } catch (error) {
        if (__DEV__) {
          console.error('Failed to export habits data:', error);
        }
        Alert.alert(
          'Export Failed',
          error instanceof Error
            ? error.message
            : 'Unable to export habits data right now.',
          [{ text: 'OK' }]
        );
      }
    },
    [convex]
  );

  const handleExportHabitsData = useCallback(() => {
    Alert.alert(
      'Export Habits & Stats',
      'Choose a format. JSON is best for AI analysis.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'CSV',
          onPress: () => {
            void runHabitsExport('csv');
          },
        },
        {
          text: 'JSON (AI-friendly)',
          onPress: () => {
            void runHabitsExport('json');
          },
        },
      ]
    );
  }, [runHabitsExport]);

  return (
    <>
      <SettingsModal
        archivedHabitsCount={archivedHabitsCount}
        celebrationsEnabled={celebrationsEnabled}
        completionSoundEnabled={settings?.completionSoundEnabled ?? false}
        dayShape={settings?.dayShape ?? 'square'}
        habitCompletionIcon={settings?.habitCompletionIcon ?? 'chain'}
        isHighContrastActive={settings?.highContrastMode ?? false}
        isPremium={isPremium}
        settingsDocument={settings as SettingsModalSettingsDocument | undefined}
        showCharacterScreen={settings?.showCharacterScreen ?? true}
        showHabitStrengthPercentage={showHabitStrengthPercentage}
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
        onChangeStickyCalendarHeader={(value) =>
          onSettingsChange({ stickyCalendarHeader: value })
        }
        stickyCalendarHeader={settings?.stickyCalendarHeader ?? false}
        onChangeStreakReminderTime={streakReminders.setReminderTime}
        onClose={closeSettings}
        onExportHabitsData={handleExportHabitsData}
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
