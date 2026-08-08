/* eslint-disable max-lines, max-lines-per-function */
import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useConvex } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import type { Doc } from '../../../../../convex/_generated/dataModel';
import { DEFAULT_SETTINGS } from '../../../../../convex/settings/types';
import { useStreakReminderSettings } from '../../../../hooks/useStreakReminders';
import { getLocalDateString } from '../../../../utils/getLocalDateString';
import { exportData, prepareExportData } from '../../../../utils/exportData';
import type { SettingsModalSettingsDocument } from '../../../../components/SettingsModal/types';
import type { SettingsModalSectionProps } from './HabitsModals.types';

type HabitDoc = Doc<'habits'>;

const SettingsModal = lazy(
  () => import('../../../../components/SettingsModal')
);

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
  settings,
  showSettings,
  closeSettings,
  onSettingsChange,
}: SettingsModalSectionProps) {
  const streakReminders = useStreakReminderSettings();
  const convex = useConvex();
  const [hasOpened, setHasOpened] = useState(showSettings);

  useEffect(() => {
    if (showSettings) setHasOpened(true);
  }, [showSettings]);

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
        // Success is reported by the in-Settings toast that fired when the
        // format was picked — a second modal on the happy path was noise.
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

  if (!showSettings && !hasOpened) return null;

  return (
    <Suspense fallback={null}>
      <SettingsModal
        archivedHabitsCount={archivedHabitsCount}
        completionSoundEnabled={
          settings?.completionSoundEnabled ??
          DEFAULT_SETTINGS.completionSoundEnabled
        }
        completionSoundType={
          settings?.completionSoundType ?? DEFAULT_SETTINGS.completionSoundType
        }
        dayShape={settings?.dayShape ?? DEFAULT_SETTINGS.dayShape}
        habitCompletionIcon={
          settings?.habitCompletionIcon ?? DEFAULT_SETTINGS.habitCompletionIcon
        }
        isPremium={settings?.hasPremium ?? DEFAULT_SETTINGS.hasPremium}
        settingsDocument={settings as SettingsModalSettingsDocument | undefined}
        stickyCalendarHeader={
          settings?.stickyCalendarHeader ??
          DEFAULT_SETTINGS.stickyCalendarHeader
        }
        streakRemindersEnabled={streakReminders.enabled}
        streakReminderTime={streakReminders.reminderTime}
        visible={showSettings}
        onChangeCompletionSoundEnabled={(value) =>
          onSettingsChange({ completionSoundEnabled: value })
        }
        onChangeCompletionSoundType={(value) =>
          onSettingsChange({ completionSoundType: value })
        }
        onChangeDayShape={(value) => onSettingsChange({ dayShape: value })}
        onChangeHabitCompletionIcon={(value) =>
          onSettingsChange({ habitCompletionIcon: value })
        }
        onChangeStickyCalendarHeader={(value) =>
          onSettingsChange({ stickyCalendarHeader: value })
        }
        onChangeStreakReminderTime={streakReminders.setReminderTime}
        onClose={closeSettings}
        onExportHabitsData={runHabitsExport}
        onToggleStreakReminders={streakReminders.setEnabled}
      />
    </Suspense>
  );
}
