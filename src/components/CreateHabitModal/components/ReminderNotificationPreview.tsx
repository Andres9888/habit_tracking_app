/**
 * ReminderNotificationPreview - Shows users what their notification will look like
 *
 * Displays a realistic mockup of how the reminder notification will appear on
 * their device, helping them understand the reminder before enabling it.
 *
 * Features:
 * - iOS/Android specific styles
 * - Shows habit name in notification title
 * - Shows time in notification body
 * - Shows default alarm sound indicator
 * - Fade animation on enter/exit
 */

import { Platform, Text, View } from 'react-native';
import { Bell, Volume2 } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { formatReminderTime } from '../../../utils/notifications';
import { useThemeColors } from '../../../theme/ThemeContext';

interface ReminderNotificationPreviewProps {
  habitName?: string;
  reminderTime: Date;
  reminderSound?: string;
  showPreview?: boolean;
}

const DEFAULT_HABIT_NAME = 'Your habit';

export function ReminderNotificationPreview({
  habitName = DEFAULT_HABIT_NAME,
  reminderTime,
  reminderSound = 'Default',
  showPreview = true,
}: ReminderNotificationPreviewProps) {
  const { colors } = useThemeColors();

  if (!showPreview) {
    return null;
  }

  const displayTime = formatReminderTime(reminderTime);
  const isAndroid = Platform.OS === 'android';

  // Android: Uses taller notification style
  if (isAndroid) {
    return (
      <Animated.View
        entering={FadeIn.duration(200).delay(100)}
        exiting={FadeOut.duration(150)}
        testID='notification-preview-android'
      >
        <View
          className='mb-4 rounded-2xl p-4'
          style={{
            backgroundColor: colors.gray[100],
            borderLeftWidth: 4,
            borderLeftColor: '#059669',
          }}
          accessibilityLabel={`Notification preview: ${habitName} at ${displayTime}`}
          accessibilityRole='text'
        >
          <Text className='text-xs font-semibold text-gray-500'>
            CHAIN DAY • {displayTime}
          </Text>
          <View className='mt-2 flex-row items-start gap-2'>
            <Bell color='#059669' size={16} className='mt-0.5' />
            <View className='flex-1'>
              <Text
                className='text-sm font-bold'
                style={{ color: colors.text.primary }}
              >
                Time for {habitName}
              </Text>
              <Text className='mt-0.5 text-xs' style={{ color: colors.text.secondary }}>
                Tap to open and mark complete
              </Text>
            </View>
          </View>
          <View className='mt-2 flex-row items-center gap-1'>
            <Volume2 color='#999' size={12} />
            <Text className='text-xs text-gray-500'>{reminderSound}</Text>
          </View>
        </View>
      </Animated.View>
    );
  }

  // iOS: Uses compact notification style
  return (
    <Animated.View
      entering={FadeIn.duration(200).delay(100)}
      exiting={FadeOut.duration(150)}
      testID='notification-preview-ios'
    >
      <View
        className='mb-4 overflow-hidden rounded-2xl'
        style={{ backgroundColor: colors.surface }}
        accessibilityLabel={`Notification preview: ${habitName} at ${displayTime}`}
        accessibilityRole='text'
      >
        {/* iOS Status Bar Area */}
        <View
          className='flex-row items-center justify-between px-4 py-2'
          style={{ backgroundColor: colors.gray[900] }}
        >
          <Text className='text-xs text-white'>9:41</Text>
          <Text className='text-xs text-white'>📶 📡 🔋</Text>
        </View>

        {/* Notification Card */}
        <View className='p-4'>
          <View className='flex-row items-start gap-2'>
            <View
              className='h-10 w-10 items-center justify-center rounded-full'
              style={{ backgroundColor: '#DCFCE7' }}
            >
              <Bell color='#059669' size={18} />
            </View>
            <View className='flex-1'>
              <Text className='text-xs text-gray-500'>Chain Day</Text>
              <Text
                className='mt-0.5 font-semibold'
                style={{ color: colors.text.primary }}
              >
                Time for {habitName}
              </Text>
              <Text
                className='mt-0.5 text-sm'
                style={{ color: colors.text.secondary }}
              >
                {displayTime}
              </Text>
            </View>
          </View>
          <View className='mt-3 flex-row gap-2'>
            <Text
              className='flex-1 rounded-lg px-3 py-2 text-center text-xs font-semibold'
              style={{ backgroundColor: colors.gray[200], color: colors.text.primary }}
            >
              Dismiss
            </Text>
            <Text
              className='flex-1 rounded-lg px-3 py-2 text-center text-xs font-semibold text-white'
              style={{ backgroundColor: '#059669' }}
            >
              Open
            </Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

export default ReminderNotificationPreview;
