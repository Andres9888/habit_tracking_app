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
    colors: p.colors,
    compactView: p.compactView,
    completionSoundEnabled: p.completionSoundEnabled ?? false,
    completionSoundType: p.completionSoundType ?? 'chime',
    darkModePreference: p.darkModePreference,
    dayShape: p.dayShape ?? 'square',
    habitCompletionIcon: p.habitCompletionIcon ?? 'chain',
    habitSortMode: p.habitSortMode,
    isPremium: p.isPremium ?? false,
    showGradientFill: p.showGradientFill,
    showStreakConnections: p.showStreakConnections,
    stickyCalendarHeader: p.stickyCalendarHeader ?? false,
    streakRemindersEnabled: p.streakRemindersEnabled ?? false,
    streakReminderTime: p.streakReminderTime ?? '20:00',
    onChangeCompactView: p.setCompactView,
    onChangeCompletionSoundEnabled:
      p.onChangeCompletionSoundEnabled ?? (() => {}),
    onChangeCompletionSoundType: p.onChangeCompletionSoundType ?? (() => {}),
    onChangeDarkModePreference: p.setDarkModePreference,
    onChangeDayShape: p.onChangeDayShape ?? (() => {}),
    onChangeHabitCompletionIcon: p.onChangeHabitCompletionIcon ?? (() => {}),
    onChangeHabitSortMode: handleSortSelect,
    onChangeShowGradientFill: p.setShowGradientFill,
    onChangeShowStreakConnections: p.setShowStreakConnections,
    onChangeStickyCalendarHeader: p.onChangeStickyCalendarHeader ?? (() => {}),
    onChangeStreakReminderTime: p.onChangeStreakReminderTime ?? (() => {}),
    onExportHabitsData: p.onExportHabitsData,
    onOpenAccount: () => p.setView('account'),
    onOpenArchivedHabits: () => p.setView('archived'),
    onPremiumUpsell: p.onPremiumUpsell,
    onToggleStreakReminders: p.onToggleStreakReminders ?? (() => {}),
  };
}
