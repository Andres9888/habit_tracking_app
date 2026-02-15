/* eslint-disable max-lines */
/**
 * StreakRemindersSection — Settings toggle for streak reminder notifications
 * with time picker for reminder time.
 */

import { useState } from 'react';
import { Bell, Clock, Crown } from 'lucide-react-native';
import { Platform, Text, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SettingsRow } from './SettingsRow';
import { SettingsSection } from './SettingsSection';

interface StreakRemindersSectionProps {
  highContrastMode: boolean;
  enabled: boolean;
  reminderTime: string;
  isPremium: boolean;
  onToggle: (value: boolean) => void | Promise<void>;
  onChangeTime: (time: string) => void | Promise<void>;
  onPremiumUpsell?: () => void;
}

function timeStringToDate(time: string): Date {
  const [hours, minutes] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(hours || 20, minutes || 0, 0, 0);
  return date;
}

function dateToTimeString(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

function formatDisplayTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const ampm = (hours || 0) >= 12 ? 'PM' : 'AM';
  const hour12 = (hours || 0) % 12 || 12;
  return `${hour12}:${(minutes || 0).toString().padStart(2, '0')} ${ampm}`;
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

  const handleTimeChange = (_event: unknown, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    if (selectedDate) {
      void onChangeTime(dateToTimeString(selectedDate));
    }
  };

  return (
    <SettingsSection highContrastMode={highContrastMode} title='Notifications'>
      <SettingsRow
        highContrastMode={highContrastMode}
        icon={<Bell color='#ea580c' size={16} />}
        iconBackgroundColor='#fed7aa'
        label='Streak Reminders'
        type='toggle'
        value={enabled}
        onToggle={(v) => void onToggle(v)}
      />
      {enabled && (
        <>
          <SettingsRow
            highContrastMode={highContrastMode}
            icon={<Clock color='#0284c7' size={16} />}
            iconBackgroundColor='#bae6fd'
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
              icon={<Crown color='#ca8a04' size={16} />}
              iconBackgroundColor='#fef9c3'
              label='Custom times per habit'
              showBorder={false}
              type='navigation'
              onPress={onPremiumUpsell}
            />
          )}
        </>
      )}
      {!enabled && (
        <View style={{ paddingBottom: 12, paddingHorizontal: 16 }}>
          <Text
            style={{
              color: highContrastMode ? '#facc15' : undefined,
              fontSize: 13,
              lineHeight: 18,
            }}
            className={highContrastMode ? '' : 'text-stone-500 dark:text-stone-400'}
          >
            Get a reminder if you haven&apos;t completed a habit with an active
            streak by your chosen time.
          </Text>
        </View>
      )}
    </SettingsSection>
  );
}
