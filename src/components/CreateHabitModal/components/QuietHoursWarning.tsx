/**
 * QuietHoursWarning - Warns user if reminder time falls during quiet hours
 *
 * Shows a warning badge if the user has enabled quiet hours and the selected
 * reminder time falls within that window. The reminder won't fire during
 * quiet hours, so this helps set expectations.
 *
 * Features:
 * - Shows warning badge with icon
 * - Explains what quiet hours are
 * - Suggests adjusting time or quiet hours
 * - Fade animation
 */

import { Text, View } from 'react-native';
import { AlertCircle } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { formatReminderTime } from '../../../utils/notifications';

interface QuietHoursWarningProps {
  reminderTime: Date;
  quietHoursEnabled: boolean;
  quietHoursStartTime?: string; // "HH:MM" format
  quietHoursEndTime?: string; // "HH:MM" format
}

function isTimeInQuietHours(
  testHour: number,
  testMinute: number,
  startTimeStr: string,
  endTimeStr: string
): boolean {
  const [startHour, startMin] = startTimeStr.split(':').map(Number);
  const [endHour, endMin] = endTimeStr.split(':').map(Number);

  const testTime = testHour * 60 + testMinute;
  const startTime = startHour * 60 + startMin;
  const endTime = endHour * 60 + endMin;

  // Handle overnight quiet hours (e.g., 10 PM - 7 AM)
  if (startTime > endTime) {
    return testTime >= startTime || testTime < endTime;
  }

  return testTime >= startTime && testTime < endTime;
}

export function QuietHoursWarning({
  reminderTime,
  quietHoursEnabled,
  quietHoursStartTime = '22:00',
  quietHoursEndTime = '07:00',
}: QuietHoursWarningProps) {
  if (!quietHoursEnabled) {
    return null;
  }

  const reminderHour = reminderTime.getHours();
  const reminderMinute = reminderTime.getMinutes();

  const isInQuietHours = isTimeInQuietHours(
    reminderHour,
    reminderMinute,
    quietHoursStartTime,
    quietHoursEndTime
  );

  if (!isInQuietHours) {
    return null;
  }

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(150)}
      testID='quiet-hours-warning'
    >
      <View className='mb-4 flex-row items-start gap-2 rounded-lg bg-amber-50 p-3'>
        <AlertCircle color='#d97706' size={16} className='mt-0.5' />
        <View className='flex-1'>
          <Text className='text-xs font-semibold text-amber-900'>
            Falls During Quiet Hours
          </Text>
          <Text className='mt-0.5 text-xs text-amber-700'>
            {formatReminderTime(reminderTime)} is within your quiet hours ({
              quietHoursStartTime
            } - {quietHoursEndTime}). The reminder won't send during this time.
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

export default QuietHoursWarning;
