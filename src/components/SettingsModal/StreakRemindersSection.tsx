/* eslint-disable max-lines */
/**
 * StreakRemindersSection — Settings toggle for streak reminder notifications
 */

import { useState } from 'react';
import { Bell, Clock, Crown } from 'lucide-react-native';
import { Platform, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SettingsRow } from './SettingsRow';
import { SettingsSection } from './SettingsSection';
import { useThemeColors } from '@/theme/ThemeContext';
import { fontFamilies } from '@/theme/typography';
import {
  timeStringToDate,
  dateToTimeString,
  formatDisplayTime,
} from './timeHelpers';

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
  const { colors: themeColors, settings } = useThemeColors();

  const handleTimeChange = (_event: unknown, selectedDate?: Date) => {
    if (Platform.OS === 'android') setShowTimePicker(false);
    if (selectedDate) void onChangeTime(dateToTimeString(selectedDate));
  };

  return (
    <SettingsSection highContrastMode={highContrastMode} title='Notifications'>
      <SettingsRow
        highContrastMode={highContrastMode}
        icon={<Bell color={settings.bell.icon} size={16} />}
        iconBackgroundColor={settings.bell.bg}
        label='Streak Reminders'
        type='toggle'
        value={enabled}
        onToggle={(v) => void onToggle(v)}
      />
      {enabled && (
        <Animated.View
          entering={FadeInDown.duration(200).springify().damping(18)}
          exiting={FadeOutUp.duration(150)}
        >
          <SettingsRow
            hapticStyle='selection'
            highContrastMode={highContrastMode}
            icon={<Clock color={settings.clock.icon} size={16} />}
            iconBackgroundColor={settings.clock.bg}
            label='Reminder Time'
            type='selection'
            value={formatDisplayTime(reminderTime)}
            onPress={() => setShowTimePicker(!showTimePicker)}
          />
          {showTimePicker && (
            <View style={{ paddingBottom: 8, paddingHorizontal: 16 }}>
              <DateTimePicker
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                mode='time'
                value={timeStringToDate(reminderTime)}
                onChange={handleTimeChange}
              />
            </View>
          )}
          {!isPremium && (
            <SettingsRow
              highContrastMode={highContrastMode}
              icon={<Crown color={settings.premiumTime.icon} size={16} />}
              iconBackgroundColor={settings.premiumTime.bg}
              label='Custom times per habit'
              showBorder={false}
              type='navigation'
              onPress={onPremiumUpsell}
            />
          )}
        </Animated.View>
      )}
      {!enabled && (
        <Animated.View
          entering={FadeInDown.duration(200).springify().damping(18)}
          exiting={FadeOutUp.duration(150)}
        >
          <View style={{ paddingBottom: 12, paddingHorizontal: 16 }}>
            <Text
              style={{
                color: themeColors.text.secondary,
                fontSize: 13,
                fontFamily: fontFamilies.primary.text,
                lineHeight: 18,
              }}
            >
              Get a reminder if you haven't completed a habit with an active
              streak by your chosen time.
            </Text>
          </View>
        </Animated.View>
      )}
    </SettingsSection>
  );
}
