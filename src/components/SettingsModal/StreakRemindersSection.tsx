/* eslint-disable max-lines */
/**
 * StreakRemindersSection — Settings toggle for streak reminder notifications
 */

import { ReactNode, useState } from 'react';
import { Bell, ChevronRight, Clock, Crown } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { typography, fontWeights } from '@/theme/typography';
import { highContrastColors } from '@/theme/highContrastColors';
import { componentSpacing, spacing } from '@/theme/spacing';
import { Platform, Text, View } from 'react-native';
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
  icon?: ReactNode;
  onToggle: (value: boolean) => void | Promise<void>;
  onChangeTime: (time: string) => void | Promise<void>;
  onPremiumUpsell?: () => void;
  collapsible?: boolean;
  isExpanded?: boolean;
  onToggleSection?: () => void;
}

export function StreakRemindersSection({
  highContrastMode,
  enabled,
  reminderTime,
  isPremium,
  icon,
  onToggle,
  onChangeTime,
  onPremiumUpsell,
  collapsible,
  isExpanded,
  onToggleSection,
}: StreakRemindersSectionProps) {
  const [showTimePicker, setShowTimePicker] = useState(false);
  const { colors: themeColors, isDark, settings } = useThemeColors();

  const insetBackground = isDark
    ? 'rgba(255,255,255,0.03)'
    : 'rgba(0,0,0,0.02)';
  const insetBorder = highContrastMode ? highContrastColors.border : themeColors.border;
  const insetCardBackground = highContrastMode ? highContrastColors.background : themeColors.surface;

  const handleTimeChange = (_event: unknown, selectedDate?: Date) => {
    if (Platform.OS === nativeHandsetPlatform) setShowTimePicker(false);
    if (selectedDate) void onChangeTime(dateToTimeString(selectedDate));
  };

  return (
    <SettingsSection collapsible={collapsible} highContrastMode={highContrastMode} icon={icon} isExpanded={isExpanded} title='Notifications' onToggle={onToggleSection}>
      <SettingsRow
        highContrastMode={highContrastMode}
        icon={<Bell color={settings.bell.icon} size={iconSizes.small} />}
        iconBackgroundColor={settings.bell.bg}
        label='Streak Reminders'
        subtitle='Get nudged before an active streak slips'
        showBorder={!enabled}
        type='toggle'
        value={enabled}
        onToggle={(v) => void onToggle(v)}
      />
      {enabled ? <View>
          <View
            style={{
              backgroundColor: insetBackground,
              paddingBottom: 10,
              paddingLeft: componentSpacing.avatar.size + spacing.base, // 40 + 16 = 56
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
                      borderColor: highContrastMode ? highContrastColors.accent : 'transparent',
                      borderWidth: highContrastMode ? 1 : 0,
                      height: 36,
                      width: 36,
                    }}
                  >
                    <Clock color={settings.clock.icon} size={iconSizes.small} />
                  </View>
                  <Text
                    className='flex-1'
                    style={{ ...typography.body, fontWeight: fontWeights.semibold, color: themeColors.text.primary }}
                  >
                    Reminder time
                  </Text>
                  <Text
                    style={{ ...typography.body, fontWeight: fontWeights.medium, color: themeColors.text.secondary }}
                  >
                    {formatDisplayTime(reminderTime)}
                  </Text>
                  <ChevronRight
                    color={themeColors.text.secondary}
                    size={iconSizes.small}
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
                      <Crown color={settings.premiumTime.icon} size={iconSizes.small} />
                    </View>
                    <View className='flex-1'>
                      <Text
                        style={{ ...typography.body, fontWeight: fontWeights.semibold, color: themeColors.text.primary }}
                      >
                        Custom times per habit
                      </Text>
                      <Text
                        style={{ ...typography.caption, color: themeColors.text.secondary }}
                      >
                        Premium lets each habit keep its own reminder schedule
                      </Text>
                    </View>
                    <ChevronRight
                      color={themeColors.text.secondary}
                      size={iconSizes.small}
                      strokeWidth={2}
                    />
                  </View>
                </AnimatedPressable>
              )}
            </View>
          </View>
        </View> : null}
      {enabled ? null : <View>
          <View className='px-4 pb-3'>
            <Text
              style={{ ...typography.caption, lineHeight: 18, color: themeColors.text.secondary }}
            >
              Get a reminder if you haven't completed a habit with an active
              streak by your chosen time.
            </Text>
          </View>
        </View>}
    </SettingsSection>
  );
}
