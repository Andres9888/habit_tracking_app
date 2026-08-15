import { SettingsContent } from '../SettingsContent';
import type { HabitSortMode } from '../../../features/habits/types';
import type { SettingsMainViewProps } from './SettingsMainView.types';

type ContentProps = Parameters<typeof SettingsContent>[0];

export function buildSettingsContentProps(
  p: SettingsMainViewProps,
  handleSortSelect: (mode: HabitSortMode) => void
): ContentProps {
  return {
    archivedHabitsCount: p.archivedHabitsCount,
    bottomInset: p.insets.bottom,
    compactView: p.compactView,
    completionSoundEnabled: p.completionSoundEnabled ?? false,
    completionSoundType: p.completionSoundType ?? 'chime',
    darkModePreference: p.darkModePreference,
    habitSortMode: p.habitSortMode,
    isPremium: p.isPremium ?? false,
    streakRemindersEnabled: p.streakRemindersEnabled ?? false,
    streakReminderTime: p.streakReminderTime ?? '20:00',
    onChangeCompactView: p.setCompactView,
    onChangeCompletionSoundEnabled:
      p.onChangeCompletionSoundEnabled ?? (() => {}),
    onChangeCompletionSoundType: p.onChangeCompletionSoundType ?? (() => {}),
    onChangeDarkModePreference: p.setDarkModePreference,
    onChangeHabitSortMode: handleSortSelect,
    onChangeStreakReminderTime: p.onChangeStreakReminderTime ?? (() => {}),
    onExportHabitsData: p.onExportHabitsData,
    onOpenAccount: () => p.setView('account'),
    onOpenAnalytics: () => p.setView('analytics'),
    onOpenArchivedHabits: () => p.setView('archived'),
    onOpenCalendarLook: () => p.setView('calendar'),
    onPremiumUpsell: p.onPremiumUpsell,
    onToggleStreakReminders: p.onToggleStreakReminders ?? (() => {}),
  };
}
