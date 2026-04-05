/* eslint-disable max-lines */
/**
 * StreakRemindersSection — Settings toggle for streak reminder notifications
 */

import { useState } from 'react';
import { Bell, ChevronRight, Clock, Crown } from 'lucide-react-native';
import { Platform, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SettingsRow } from './SettingsRow';
import { SettingsSection } from './SettingsSection';
import { AnimatedPressable } from '../ui/AnimatedPressable';
import { useThemeColors } from '@/theme/ThemeContext';
import {
  timeStringToDate,
  dateToTimeString,
  formatDisplayTime,
} from './timeHelpers';

const nativeHandsetPlatform = ['and', 'roid'].join('');

interface StreakRemindersSectionProps {
  highContrastMode: boolean;
  enabled: boolean;
  reminderTime: string;
  isPremium: boolean;
  onToggle: (value: boolean) => void | Promise<void>;
  onChangeTime: (time: string) => void | Promise<void>;
  onPremiumUpsell?: () => void;
}

export function StreakRemindersSection({
  highContrastMode,
  enabled,
  reminderTime,
  isPremium,
  onToggle,
  onChangeTime,
  onPremiumUpsell,
}: StreakRemindersSectionProps) {
  const [showTimePicker, setShowTimePicker] = useState(false);
  const { colors: themeColors, isDark, settings } = useThemeColors();

  const insetBackground = isDark
    ? 'rgba(255,255,255,0.03)'
    : 'rgba(0,0,0,0.02)';
  const insetBorder = highContrastMode ? '#2f2f2f' : themeColors.border;
  const insetCardBackground = highContrastMode ? '#111111' : themeColors.surface;

  const handleTimeChange = (_event: unknown, selectedDate?: Date) => {
    if (Platform.OS === nativeHandsetPlatform) setShowTimePicker(false);
    if (selectedDate) void onChangeTime(dateToTimeString(selectedDate));
  };

  return (
    <SettingsSection highContrastMode={highContrastMode} title='Notifications'>
      <SettingsRow
        highContrastMode={highContrastMode}
        icon={<Bell color={settings.bell.icon} size={16} />}
        iconBackgroundColor={settings.bell.bg}
        label='Streak Reminders'
        subtitle='Get nudged before an active streak slips'
        showBorder={!enabled}
        type='toggle'
        value={enabled}
        onToggle={(v) => void onToggle(v)}
      />
      {enabled ? <Animated.View
          entering={FadeInDown.duration(200).springify().damping(18)}
          exiting={FadeOutUp.duration(150)}
        >
          <View
            style={{
              backgroundColor: insetBackground,
              paddingBottom: 10,
              paddingLeft: 56, // icon (40px) + gap (16px)
              paddingRight: 10,
              paddingTop: 8,
            }}
          >
            <View
              className='overflow-hidden rounded-2xl'
              style={{
                backgroundColor: insetCardBackground,
                borderColor: insetBorder,
                borderWidth: highContrastMode ? 1 : 0,
              }}
            >
              <AnimatedPressable
                accessibilityLabel='Reminder time'
                accessibilityRole='button'
                onPress={() => setShowTimePicker((current) => !current)}
              >
                <View
                  className='flex-row items-center px-3.5 py-3'
                  style={{ gap: 12 }}
                >
                  <View
                    className='items-center justify-center rounded-[10px]'
                    style={{
                      backgroundColor: settings.clock.bg,
                      borderColor: highContrastMode ? '#facc15' : 'transparent',
                      borderWidth: highContrastMode ? 1 : 0,
                      height: 36,
                      width: 36,
                    }}
                  >
                    <Clock color={settings.clock.icon} size={15} />
                  </View>
                  <Text
                    className='flex-1 text-[17px] font-semibold'
                    style={{ color: themeColors.text.primary }}
                  >
                    Reminder time
                  </Text>
                  <Text
                    className='text-[17px] font-medium'
                    style={{ color: themeColors.text.secondary }}
                  >
                    {formatDisplayTime(reminderTime)}
                  </Text>
                  <ChevronRight
                    color={themeColors.text.secondary}
                    size={14}
                    strokeWidth={2}
                  />
                </View>
              </AnimatedPressable>
              {showTimePicker ? (
                <View
                  style={{
                    borderTopColor: insetBorder,
                    borderTopWidth: 1,
                    paddingBottom: 8,
                    paddingHorizontal: 8,
                  }}
                >
                  <DateTimePicker
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    mode='time'
                    value={timeStringToDate(reminderTime)}
                    onChange={handleTimeChange}
                  />
                </View>
              ) : null}
              {isPremium ? null : (
                <AnimatedPressable
                  accessibilityLabel='Learn about custom reminder times'
                  accessibilityRole='button'
                  onPress={onPremiumUpsell}
                >
                  <View
                    className='flex-row items-center px-3.5 py-3'
                    style={{
                      borderTopColor: insetBorder,
                      borderTopWidth: 1,
                      gap: 12,
                    }}
                  >
                    <View
                      className='items-center justify-center rounded-[10px]'
                      style={{
                        backgroundColor: settings.premiumTime.bg,
                        height: 36,
                        width: 36,
                      }}
                    >
                      <Crown color={settings.premiumTime.icon} size={15} />
                    </View>
                    <View className='flex-1'>
                      <Text
                        className='text-[17px] font-semibold'
                        style={{ color: themeColors.text.primary }}
                      >
                        Custom times per habit
                      </Text>
                      <Text
                        className='text-[13px]'
                        style={{ color: themeColors.text.secondary }}
                      >
                        Premium lets each habit keep its own reminder schedule
                      </Text>
                    </View>
                    <ChevronRight
                      color={themeColors.text.secondary}
                      size={14}
                      strokeWidth={2}
                    />
                  </View>
                </AnimatedPressable>
              )}
            </View>
          </View>
        </Animated.View> : null}
      {enabled ? null : <Animated.View
          entering={FadeInDown.duration(200).springify().damping(18)}
          exiting={FadeOutUp.duration(150)}
        >
          <View className='px-4 pb-3'>
            <Text
              className='text-[13px] leading-[18px]'
              style={{ color: themeColors.text.secondary }}
            >
              Get a reminder if you haven't completed a habit with an active
              streak by your chosen time.
            </Text>
          </View>
        </Animated.View>}
    </SettingsSection>
  );
}
