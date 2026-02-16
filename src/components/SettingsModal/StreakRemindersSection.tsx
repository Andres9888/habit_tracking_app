/* eslint-disable max-lines */
/**
 * StreakRemindersSection — Settings toggle for streak reminder notifications
 */

import { useCallback, useState } from 'react';
import { Bell, BellRing, Clock, Crown } from 'lucide-react-native';
import { Platform, Text, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SettingsRow } from './SettingsRow';
import { SettingsSection } from './SettingsSection';
import { sendTestNotification } from '../../utils/notifications';

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
  const [testSent, setTestSent] = useState(false);

  const handleTestNotification = useCallback(async () => {
    const sent = await sendTestNotification();
    if (sent) {
      setTestSent(true);
      setTimeout(() => setTestSent(false), 3000);
    }
  }, []);

  const handleTimeChange = (_event: unknown, selectedDate?: Date) => {
    if (Platform.OS === 'android') setShowTimePicker(false);
    if (selectedDate) void onChangeTime(dateToTimeString(selectedDate));
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
          <Text style={{ color: '#78716c', fontSize: 13, lineHeight: 18 }}>
            Get a reminder if you haven't completed a habit with an active
            streak by your chosen time.
          </Text>
        </View>
      )}
      <SettingsRow
        highContrastMode={highContrastMode}
        icon={<BellRing color={testSent ? '#16a34a' : '#6366f1'} size={16} />}
        iconBackgroundColor={testSent ? '#dcfce7' : '#e0e7ff'}
        label={testSent ? 'Test sent! Check in ~2s' : 'Send Test Notification'}
        showBorder={false}
        type='navigation'
        onPress={() => void handleTestNotification()}
      />
    </SettingsSection>
  );
}
