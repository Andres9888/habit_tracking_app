/** HabitsSection — everything that changes how habits behave day to day:
 *  ordering, completion sound, the streak reminder, and the archive.
 *  Merges the old Behavior + Notifications cards, and pulls Archived habits
 *  across from Data & Privacy so the whole habit lifecycle sits in one card. */
import { SettingsRow } from '../SettingsRow';
import { SettingsSection } from '../SettingsSection';
import { BookOpen } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import {
  NotificationPermissionWarning,
  StreakReminderRow,
  useNotificationPermissionStatus,
} from '../StreakRemindersSection';
import { HabitsSortRows } from './HabitsSortRows';
import { SoundHapticsRows } from './SoundHapticsRows';
import { useThemeColors } from '../../../theme/ThemeContext';
import type { HabitSortMode } from '../../../features/habits/types';
import type { CompletionSoundType } from '../../../../convex/settings/types';

interface HabitsSectionProps {
  habitSortMode: string;
  onChangeHabitSortMode: (mode: HabitSortMode) => void;
  completionSoundEnabled: boolean;
  completionSoundType: CompletionSoundType;
  onChangeCompletionSoundEnabled: (value: boolean) => void | Promise<void>;
  onChangeCompletionSoundType: (
    value: CompletionSoundType
  ) => void | Promise<void>;
  streakRemindersEnabled: boolean;
  streakReminderTime: string;
  onToggleStreakReminders: (value: boolean) => void | Promise<void>;
  onChangeStreakReminderTime: (time: string) => void | Promise<void>;
  archivedHabitsCount?: number;
  onOpenArchivedHabits: () => void;
}

export function HabitsSection(p: HabitsSectionProps) {
  const { settings } = useThemeColors();
  const { permissionGranted } = useNotificationPermissionStatus(
    p.streakRemindersEnabled
  );

  return (
    <SettingsSection title='Habits'>
      {p.streakRemindersEnabled && !permissionGranted ? (
        <NotificationPermissionWarning />
      ) : null}
      <HabitsSortRows
        habitSortMode={p.habitSortMode}
        onChangeHabitSortMode={p.onChangeHabitSortMode}
      />
      <SoundHapticsRows
        enabled={p.completionSoundEnabled}
        soundType={p.completionSoundType}
        onChangeEnabled={p.onChangeCompletionSoundEnabled}
        onChangeType={p.onChangeCompletionSoundType}
      />
      <StreakReminderRow
        enabled={p.streakRemindersEnabled}
        reminderTime={p.streakReminderTime}
        onChangeTime={p.onChangeStreakReminderTime}
        onToggle={p.onToggleStreakReminders}
      />
      <SettingsRow
        badge={p.archivedHabitsCount}
        icon={<BookOpen color={settings.archive.icon} size={iconSizes.small} />}
        iconBackgroundColor={settings.archive.bg}
        label='Archived habits'
        type='navigation'
        onPress={p.onOpenArchivedHabits}
      />
    </SettingsSection>
  );
}
