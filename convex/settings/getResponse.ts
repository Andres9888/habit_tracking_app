import type { Doc } from '../_generated/dataModel';
import { normalizeDarkMode, normalizeHabitSortMode } from './normalizers';
import { DEFAULT_SETTINGS } from './types';

// Derive the stored shape straight from the schema so this type can't drift
// from the userSettings table (it previously hand-listed every field and went
// stale: progressEmojis/darkMode/completionSoundType all diverged).
type StoredSettings = Doc<'userSettings'> | null | undefined;

export function toSettingsResponse(settings: StoredSettings) {
  return {
    appIcon: settings?.appIcon ?? DEFAULT_SETTINGS.appIcon,
    catTheme: settings?.catTheme ?? DEFAULT_SETTINGS.catTheme,
    celebrationsEnabled:
      settings?.celebrationsEnabled ?? DEFAULT_SETTINGS.celebrationsEnabled,
    compactView: settings?.compactView ?? DEFAULT_SETTINGS.compactView,
    completionSoundEnabled:
      settings?.completionSoundEnabled ??
      DEFAULT_SETTINGS.completionSoundEnabled,
    completionSoundType:
      settings?.completionSoundType ?? DEFAULT_SETTINGS.completionSoundType,
    darkMode: normalizeDarkMode(settings?.darkMode),
    dayShape: settings?.dayShape ?? DEFAULT_SETTINGS.dayShape,
    habitCompletionIcon:
      settings?.habitCompletionIcon ?? DEFAULT_SETTINGS.habitCompletionIcon,
    habitSortMode: normalizeHabitSortMode(
      settings?.habitSortMode,
      settings?.sortHabitsAlphabetically
    ),
    hasPremium: settings?.hasPremium ?? DEFAULT_SETTINGS.hasPremium,
    progressEmojis: settings?.progressEmojis,
    customProgressEmojis: settings?.customProgressEmojis,
    reduceMotion: settings?.reduceMotion ?? DEFAULT_SETTINGS.reduceMotion,
    showCalendarView:
      settings?.showCalendarView ?? DEFAULT_SETTINGS.showCalendarView,
    showCharacterScreen:
      settings?.showCharacterScreen ?? DEFAULT_SETTINGS.showCharacterScreen,
    showConsistency:
      settings?.showConsistency ?? DEFAULT_SETTINGS.showConsistency,
    showEmojis: settings?.showEmojis ?? DEFAULT_SETTINGS.showEmojis,
    showGradientFill:
      settings?.showGradientFill ?? DEFAULT_SETTINGS.showGradientFill,
    connectorStyle:
      settings?.connectorStyle ??
      (settings?.showStreakConnections === false
        ? 'none'
        : DEFAULT_SETTINGS.connectorStyle),
    showMotivationalMessages:
      settings?.showMotivationalMessages ??
      DEFAULT_SETTINGS.showMotivationalMessages,
    stickyCalendarHeader:
      settings?.stickyCalendarHeader ?? DEFAULT_SETTINGS.stickyCalendarHeader,
    showStreaks: settings?.showStreaks ?? DEFAULT_SETTINGS.showStreaks,
    showWeekCompletionBar:
      settings?.showWeekCompletionBar ?? DEFAULT_SETTINGS.showWeekCompletionBar,
    streakRemindersEnabled:
      settings?.streakRemindersEnabled ??
      DEFAULT_SETTINGS.streakRemindersEnabled,
    streakReminderTime:
      settings?.streakReminderTime ?? DEFAULT_SETTINGS.streakReminderTime,
    useDyslexicFont:
      settings?.useDyslexicFont ?? DEFAULT_SETTINGS.useDyslexicFont,
  };
}
