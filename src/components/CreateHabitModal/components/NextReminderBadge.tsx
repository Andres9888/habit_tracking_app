import { useMemo } from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeOut } from 'react-native-reanimated';
import { Clock } from 'lucide-react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import { iconSizes } from '@/theme/iconSizes';
import { formatReminderTime } from '../../../utils/notifications';
import { durations } from '@/theme/animations';

/**
 * Props for the NextReminderBadge component.
 */
export interface NextReminderBadgeProps {
  /** The reminder time as a Date object */
  reminderTime: Date;
  /** Whether reminders are enabled */
  enabled: boolean;
}

/**
 * Calculate the next reminder occurrence text.
 *
 * - If the time is in the future today: "Today at X:XX AM/PM (in Yh Zm)"
 * - If the time has passed today: "Tomorrow at X:XX AM/PM"
 *
 * @param time The reminder time
 * @returns Formatted string showing when the next reminder will fire
 */
export function getNextReminderText(time: Date): string {
  const now = new Date();
  const reminderToday = new Date(now);
  reminderToday.setHours(time.getHours(), time.getMinutes(), 0, 0);

  const formattedTime = formatReminderTime(time);

  if (reminderToday > now) {
    // Today - show relative time
    const diffMs = reminderToday.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHours > 0) {
      if (diffMins > 0) {
        return `Today at ${formattedTime} (in ${diffHours}h ${diffMins}m)`;
      }
      return `Today at ${formattedTime} (in ${diffHours} hour${diffHours === 1 ? '' : 's'})`;
    }
    return `Today at ${formattedTime} (in ${diffMins} minute${diffMins === 1 ? '' : 's'})`;
  } else {
    // Tomorrow
    return `Tomorrow at ${formattedTime}`;
  }
}

/**
 * NextReminderBadge - Displays when the next reminder will fire.
 *
 * Features:
 * - Shows "Today at X" when time is in future today
 * - Shows "Tomorrow at X" when time has passed today
 * - Shows relative time "(in X hours)" or "(in X minutes)"
 * - Amber background with clock icon
 * - Accessible text for screen readers
 * - Fade animation on enter/exit
 *
 * Usage:
 * ```tsx
 * <NextReminderBadge
 *   reminderTime={new Date()}
 *   enabled={true}
 * />
 * ```
 */
export const NextReminderBadge = ({
  reminderTime,
  enabled,
}: NextReminderBadgeProps) => {
  // Memoize the text computation - must be called before any early returns
  // to follow React's rules of hooks (consistent hook call order)
  const { colors } = useThemeColors();
  const text = useMemo(() => getNextReminderText(reminderTime), [reminderTime]);

  // Don't render if reminders are disabled
  if (!enabled) {
    return null;
  }

  return (
    <Animated.View
      accessibilityLabel={`Next reminder: ${text}`}
      accessibilityRole='text'
      exiting={FadeOut.duration(durations.quick)}
      testID='next-reminder-badge'
    >
      <View
        className='flex-row items-center justify-center gap-1.5 rounded-full px-3 py-1.5'
        style={{ backgroundColor: colors.status.warningLight }}
      >
        <Clock color={colors.status.warningText} size={iconSizes.small} />
        <Text
          className='text-xs font-medium'
          style={{ color: colors.status.warningText }}
        >
          Next: {text}
        </Text>
      </View>
    </Animated.View>
  );
};

export default NextReminderBadge;
