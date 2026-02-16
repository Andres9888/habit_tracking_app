/**
 * QuietHoursSection — Global quiet hours / Do Not Disturb settings
 *
 * Allows users to set a time window where habit reminders won't fire.
 * Useful for sleep hours or focus time.
 *
 * Features:
 * - Toggle to enable/disable quiet hours
 * - Start time picker
 * - End time picker
 * - Preview showing which hours are quiet (e.g., "10 PM - 7 AM")
 * - Clear visual indication when enabled
 */

import { useState } from 'react';
import { Bell, Moon, Clock } from 'lucide-react-native';
import { Platform, Text, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SettingsRow } from './SettingsRow';
import { SettingsSection } from './SettingsSection';
import {
  timeStringToDate,
  dateToTimeString,
  formatDisplayTime,
} from './timeHelpers';

interface QuietHoursSectionProps {
  highContrastMode: boolean;
  enabled: boolean;
  startTime: string; // "HH:MM" format
  endTime: string; // "HH:MM" format
  onToggle: (value: boolean) => void | Promise<void>;
  onStartTimeChange: (time: string) => void | Promise<void>;
  onEndTimeChange: (time: string) => void | Promise<void>;
}

type TimePickerMode = 'startTime' | 'endTime' | null;

export function QuietHoursSection({
  highContrastMode,
  enabled,
  startTime,
  endTime,
  onToggle,
  onStartTimeChange,
  onEndTimeChange,
}: QuietHoursSectionProps) {
  const [showTimePicker, setShowTimePicker] = useState<TimePickerMode>(null);

  const handleTimeChange = (
    _event: unknown,
    selectedDate?: Date,
    mode?: TimePickerMode
  ) => {
    if (Platform.OS === 'android') setShowTimePicker(null);
    if (selectedDate && mode) {
      const timeString = dateToTimeString(selectedDate);
      if (mode === 'startTime') void onStartTimeChange(timeString);
      else void onEndTimeChange(timeString);
    }
  };

  return (
    <SettingsSection
      highContrastMode={highContrastMode}
      title='Quiet Hours (Do Not Disturb)'
    >
      <SettingsRow
        highContrastMode={highContrastMode}
        icon={<Moon color='#6366f1' size={16} />}
        iconBackgroundColor='#e0e7ff'
        label='Quiet Hours'
        type='toggle'
        value={enabled}
        onToggle={(v) => void onToggle(v)}
      />

      {enabled && (
        <>
          <SettingsRow
            highContrastMode={highContrastMode}
            icon={<Clock color='#8b5cf6' size={16} />}
            iconBackgroundColor='#f3e8ff'
            label='Start Time'
            type='selection'
            value={formatDisplayTime(startTime)}
            onPress={() => setShowTimePicker('startTime')}
          />

          <SettingsRow
            highContrastMode={highContrastMode}
            icon={<Clock color='#8b5cf6' size={16} />}
            iconBackgroundColor='#f3e8ff'
            label='End Time'
            type='selection'
            value={formatDisplayTime(endTime)}
            onPress={() => setShowTimePicker('endTime')}
            showBorder={false}
          />

          {showTimePicker && (
            <View style={{ paddingBottom: 8, paddingHorizontal: 16 }}>
              <DateTimePicker
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                mode='time'
                value={timeStringToDate(
                  showTimePicker === 'startTime' ? startTime : endTime
                )}
                onChange={(event, date) =>
                  handleTimeChange(event, date, showTimePicker)
                }
              />
            </View>
          )}

          <View style={{ paddingBottom: 12, paddingHorizontal: 16 }}>
            <Text
              style={{
                color: '#6b7280',
                fontSize: 13,
                lineHeight: 18,
                fontWeight: '600',
                marginBottom: 4,
              }}
            >
              Preview
            </Text>
            <Text style={{ color: '#78716c', fontSize: 13, lineHeight: 18 }}>
              Reminders will not send between {formatDisplayTime(startTime)} and{' '}
              {formatDisplayTime(endTime)}.
            </Text>
          </View>
        </>
      )}

      {!enabled && (
        <View style={{ paddingBottom: 12, paddingHorizontal: 16 }}>
          <Text style={{ color: '#78716c', fontSize: 13, lineHeight: 18 }}>
            Quiet hours pause reminders during your specified time window (e.g.,
            sleep hours or focus time).
          </Text>
        </View>
      )}
    </SettingsSection>
  );
}
