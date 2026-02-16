/**
 * NotificationPreferencesSection - Notification style preferences
 *
 * Allows users to customize how notifications are presented:
 * - Notification style (motivating, neutral, urgent)
 * - Future: Quiet hours, notification sounds, etc.
 */

import { Bell } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { SettingsSection } from './SettingsSection';
import { SettingsRow } from './SettingsRow';
import { useThemeColors } from '../../theme/ThemeContext';
import type { NotificationStyle } from '../../utils/notifications';

interface NotificationPreferencesSectionProps {
  highContrastMode: boolean;
  notificationStyle: NotificationStyle;
  onChangeNotificationStyle: (style: NotificationStyle) => void;
}

const NOTIFICATION_STYLE_OPTIONS: Array<{
  key: NotificationStyle;
  label: string;
  description: string;
}> = [
  {
    key: 'motivating',
    label: 'Motivating',
    description: 'Encouraging messages with streaks and emojis',
  },
  {
    key: 'neutral',
    label: 'Neutral',
    description: 'Simple, straightforward reminders',
  },
  {
    key: 'urgent',
    label: 'Urgent',
    description: 'Emphasize urgency and streak preservation',
  },
];

export function NotificationPreferencesSection({
  highContrastMode,
  notificationStyle,
  onChangeNotificationStyle,
}: NotificationPreferencesSectionProps) {
  const { colors: themeColors } = useThemeColors();

  return (
    <SettingsSection
      highContrastMode={highContrastMode}
      subtitle='How notifications speak to you'
      title='Notification Style'
    >
      <SettingsRow
        highContrastMode={highContrastMode}
        icon={<Bell color='#3b82f6' size={16} />}
        iconBackgroundColor='#dbeafe'
        label='Notification tone'
        showBorder={false}
        type='custom'
      >
        <View className='px-4 pb-4 pt-2'>
          <Text
            className='mb-3 text-[13px]'
            style={{ color: themeColors.text.secondary }}
          >
            Choose how habit reminders are worded
          </Text>
          <View className='gap-2'>
            {NOTIFICATION_STYLE_OPTIONS.map(({ key, label, description }) => {
              const selected = notificationStyle === key;
              return (
                <Pressable
                  key={key}
                  className='rounded-xl p-3'
                  style={{
                    backgroundColor: selected
                      ? themeColors.primary + '15'
                      : themeColors.surface,
                    borderColor: selected
                      ? themeColors.primary
                      : themeColors.border,
                    borderWidth: selected ? 2 : 1,
                  }}
                  onPress={() => onChangeNotificationStyle(key)}
                >
                  <View className='flex-row items-center justify-between'>
                    <View className='flex-1'>
                      <Text
                        className='mb-0.5 text-[15px] font-semibold'
                        style={{
                          color: selected
                            ? themeColors.primary
                            : themeColors.text.primary,
                        }}
                      >
                        {label}
                      </Text>
                      <Text
                        className='text-[13px]'
                        style={{ color: themeColors.text.secondary }}
                      >
                        {description}
                      </Text>
                    </View>
                    {selected && (
                      <View
                        className='h-5 w-5 items-center justify-center rounded-full'
                        style={{ backgroundColor: themeColors.primary }}
                      >
                        <View
                          className='h-2 w-2 rounded-full'
                          style={{ backgroundColor: 'white' }}
                        />
                      </View>
                    )}
                  </View>
                </Pressable>
              );
            })}
          </View>
          <View className='mt-3 rounded-lg p-3' style={{ backgroundColor: themeColors.surface }}>
            <Text className='text-[13px]' style={{ color: themeColors.text.secondary }}>
              <Text style={{ fontWeight: '600' }}>Example {notificationStyle}:</Text>
              {'\n'}
              {getExampleNotification(notificationStyle)}
            </Text>
          </View>
        </View>
      </SettingsRow>
    </SettingsSection>
  );
}

function getExampleNotification(style: NotificationStyle): string {
  switch (style) {
    case 'motivating':
      return '"7 day streak! Don\'t break the chain! 🔗"';
    case 'neutral':
      return '"Time to check in on your habit progress!"';
    case 'urgent':
      return '"Don\'t lose your 7 day streak! Check in now! 🚨"';
  }
}
