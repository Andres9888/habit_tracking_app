/** SetupSummary — builds the "your setup, in a sentence" copy */
import type {
  CompletionSoundType,
  DarkModePreference,
} from '../../../convex/settings/types';
import type { HabitSortMode } from '../../features/habits/types';
import { SORT_FAMILIES, getSortFamily } from './SortOrderPicker.constants';
import { formatDisplayTime } from './timeHelpers';

interface SetupSummaryInput {
  darkModePreference: DarkModePreference;
  habitSortMode: string;
  streakRemindersEnabled: boolean;
  streakReminderTime: string;
  completionSoundEnabled: boolean;
  completionSoundType: CompletionSoundType;
}

function themeClause(pref: DarkModePreference): string {
  if (pref === 'dark') return 'Dark theme';
  if (pref === 'light') return 'Light theme';
  return 'Theme matches your device';
}

function sortClause(mode: string): string {
  const family = getSortFamily(mode as HabitSortMode);
  const label = SORT_FAMILIES.find((f) => f.key === family)?.label ?? 'Custom';
  return family === 'manual' ? 'Habits in your own order' : `Sorted by ${label.toLowerCase()}`;
}

function reminderClause(enabled: boolean, time: string): string {
  if (!enabled) return 'reminders off';
  return `a reminder at ${formatDisplayTime(time)}`;
}

function soundClause(enabled: boolean, type: CompletionSoundType): string {
  if (!enabled) return 'sound off';
  return `${type} sound on`;
}

export function buildSetupSummary(input: SetupSummaryInput): string {
  const parts = [
    themeClause(input.darkModePreference),
    sortClause(input.habitSortMode),
    reminderClause(input.streakRemindersEnabled, input.streakReminderTime),
    soundClause(input.completionSoundEnabled, input.completionSoundType),
  ];
  return `${parts[0]}, ${parts[1]}, ${parts[2]}, ${parts[3]}.`;
}
