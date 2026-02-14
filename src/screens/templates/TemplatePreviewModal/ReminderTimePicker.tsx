/**
 * Reminder time picker section
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Haptics from 'expo-haptics';
import { Clock } from 'lucide-react-native';
import { useAppTheme } from '../../../theme';
import { spacing, borderRadius } from '../../../theme/spacing';
import { styles as baseStyles } from './styles';
import type { ReminderTimePickerProps } from './types';

const localStyles = StyleSheet.create({
  timePickerButton: {
    alignItems: 'center',
    borderRadius: borderRadius.medium,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.base,
    paddingVertical: 14,
  },
  timeText: {
    color: '#1c1917', // stone-900
    fontSize: 17,
    fontWeight: '600',
  },
});

export function ReminderTimePicker({
  disabled,
  onTimeChange,
  reminderTime,
  showTimePicker,
  onTogglePicker,
}: ReminderTimePickerProps) {
  const theme = useAppTheme();

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onTogglePicker(true);
  };

  const handleChange = (_event: unknown, selected?: Date) => {
    onTogglePicker(false);
    if (selected) {
      onTimeChange(selected);
    }
  };

  return (
    <View style={baseStyles.section}>
      <Text
        style={[
          baseStyles.label,
          { fontFamily: theme.custom.fontFamilies.primary.text },
        ]}
      >
        Reminder Time
      </Text>
      <Pressable
        accessibilityHint='Opens time picker'
        accessibilityLabel={`Reminder time: ${reminderTime.toLocaleTimeString(
          'en-US',
          {
            hour: 'numeric',
            hour12: true,
            minute: '2-digit',
          }
        )}`}
        accessibilityRole='button'
        disabled={disabled}
        style={[
          localStyles.timePickerButton,
          {
            backgroundColor: theme.custom.colors.light.background,
            borderColor: theme.custom.colors.gray[200],
          },
        ]}
        onPress={handlePress}
      >
        <Clock color='#6B7280' size={20} />
        <Text
          style={[
            localStyles.timeText,
            { fontFamily: theme.custom.fontFamilies.primary.text },
          ]}
        >
          {reminderTime.toLocaleTimeString('en-US', {
            hour: 'numeric',
            hour12: true,
            minute: '2-digit',
          })}
        </Text>
      </Pressable>

      {showTimePicker && (
        <DateTimePicker
          display='spinner'
          is24Hour={false}
          mode='time'
          value={reminderTime}
          onChange={handleChange}
        />
      )}
    </View>
  );
}
