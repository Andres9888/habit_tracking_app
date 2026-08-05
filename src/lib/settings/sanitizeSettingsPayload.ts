/* eslint-disable max-lines */
type UnknownRecord = Record<string, unknown>;

const VALID_DARK_MODE: Set<string> = new Set(['system', 'light', 'dark']);
const VALID_SORT_MODE: Set<string> = new Set([
  'manual',
  'name_asc',
  'name_desc',
  'strength_asc',
  'strength_desc',
  'streak_asc',
  'streak_desc',
]);
const VALID_DAY_SHAPE: Set<string> = new Set(['circle', 'square']);
const VALID_ICON: Set<string> = new Set(['chain', 'checkbox']);
const VALID_COMPLETION_SOUND: Set<string> = new Set([
  'chime',
  'pop',
  'success',
]);

function isValidBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

function isValidString(value: unknown): value is string {
  return typeof value === 'string';
}

export function sanitizeSettingsPayload(payload: unknown): UnknownRecord {
  if (!payload || Array.isArray(payload) || typeof payload !== 'object') {
    return {};
  }

  const source = payload as UnknownRecord;
  const output: UnknownRecord = {};

  if (isValidString(source.appIcon)) {
    output.appIcon = source.appIcon;
  }

  if (isValidBoolean(source.catTheme)) {
    output.catTheme = source.catTheme;
  }

  if (isValidBoolean(source.celebrationsEnabled)) {
    output.celebrationsEnabled = source.celebrationsEnabled;
  }

  if (isValidBoolean(source.compactView)) {
    output.compactView = source.compactView;
  }

  if (isValidBoolean(source.completionSoundEnabled)) {
    output.completionSoundEnabled = source.completionSoundEnabled;
  }

  // SECURITY: `hasPremium` is a server-owned entitlement field. It is returned
  // by `api.settings.get` but must never be echoed back into `api.settings.update`
  // (whose validator no longer accepts it — see convex/settings/validators.ts).
  // Dropping it here keeps settings updates valid and removes the client vector
  // for self-granting premium.

  if (isValidBoolean(source.reduceMotion)) {
    output.reduceMotion = source.reduceMotion;
  }

  if (isValidBoolean(source.showCalendarView)) {
    output.showCalendarView = source.showCalendarView;
  }

  if (isValidBoolean(source.showCharacterScreen)) {
    output.showCharacterScreen = source.showCharacterScreen;
  }

  if (isValidBoolean(source.showConsistency)) {
    output.showConsistency = source.showConsistency;
  }

  if (isValidBoolean(source.showEmojis)) {
    output.showEmojis = source.showEmojis;
  }

  if (isValidBoolean(source.showGradientFill)) {
    output.showGradientFill = source.showGradientFill;
  }

  if (isValidBoolean(source.showStreakConnections)) {
    output.showStreakConnections = source.showStreakConnections;
  }

  if (isValidBoolean(source.showMotivationalMessages)) {
    output.showMotivationalMessages = source.showMotivationalMessages;
  }

  if (isValidBoolean(source.showStreaks)) {
    output.showStreaks = source.showStreaks;
  }

  if (isValidBoolean(source.stickyCalendarHeader)) {
    output.stickyCalendarHeader = source.stickyCalendarHeader;
  }

  if (isValidBoolean(source.showWeekCompletionBar)) {
    output.showWeekCompletionBar = source.showWeekCompletionBar;
  }

  if (isValidBoolean(source.streakRemindersEnabled)) {
    output.streakRemindersEnabled = source.streakRemindersEnabled;
  }

  if (isValidBoolean(source.useDyslexicFont)) {
    output.useDyslexicFont = source.useDyslexicFont;
  }

  if (
    isValidString(source.completionSoundType) &&
    VALID_COMPLETION_SOUND.has(source.completionSoundType)
  ) {
    output.completionSoundType = source.completionSoundType;
  }

  if (isValidString(source.streakReminderTime)) {
    output.streakReminderTime = source.streakReminderTime;
  }

  if (isValidString(source.darkMode) && VALID_DARK_MODE.has(source.darkMode)) {
    output.darkMode = source.darkMode;
  } else if (typeof source.darkMode === 'boolean') {
    output.darkMode = source.darkMode ? 'dark' : 'light';
  }

  if (
    isValidString(source.habitSortMode) &&
    VALID_SORT_MODE.has(source.habitSortMode)
  ) {
    output.habitSortMode = source.habitSortMode;
  }

  if (isValidString(source.dayShape) && VALID_DAY_SHAPE.has(source.dayShape)) {
    output.dayShape = source.dayShape;
  }

  if (
    isValidString(source.habitCompletionIcon) &&
    VALID_ICON.has(source.habitCompletionIcon)
  ) {
    output.habitCompletionIcon = source.habitCompletionIcon;
  }

  return output;
}
