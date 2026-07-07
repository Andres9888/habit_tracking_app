/** PerHabitRemindersRow — summary of habits with their own daily reminder */
import { AlarmClock } from 'lucide-react-native';
import { api } from '../../../../../convex/_generated/api';
import { iconSizes } from '@/theme/iconSizes';
import { useCachedQuery } from '../../../../lib/queryCache';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { SettingsRow } from '../../SettingsRow';

export function PerHabitRemindersRow() {
  const { settings } = useThemeColors();
  const habitsQuery = useCachedQuery(
    api.habits.list,
    {},
    { entryName: 'habits.list' }
  );
  const habits = Array.isArray(habitsQuery) ? habitsQuery : [];
  const count = habits.filter(
    (habit) => habit.remindersEnabled && habit.reminderTime
  ).length;

  const value =
    count === 0 ? 'None yet' : count === 1 ? '1 habit' : `${count} habits`;

  return (
    <SettingsRow
      icon={<AlarmClock color={settings.bell.icon} size={iconSizes.small} />}
      iconBackgroundColor={settings.bell.bg}
      label='Per-habit reminders'
      subtitle='Each habit can have its own daily time — set it when editing a habit'
      type='info'
      value={value}
    />
  );
}
