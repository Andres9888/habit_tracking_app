/* eslint-disable max-lines */
/**
 * Reminder time picker section
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Clock } from 'lucide-react-native';
import { useAppTheme } from '../../../theme';
import { useThemeColors } from '../../../theme/ThemeContext';
import { styles as baseStyles } from './styles';
import type { ReminderTimePickerProps } from './types';
import { triggerHaptic } from '@/utils/haptics';

const localStyles = StyleSheet.create({
  timePickerButton: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  timeText: {
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
  const { colors } = useThemeColors();

  const handlePress = () => {
    void triggerHaptic('tap');
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
          {
            color: colors.text.secondary,
            fontFamily: theme.custom.fontFamilies.primary.text,
          },
        ]}
      >
        Reminder Time
      </Text>
      <AnimatedPressable
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
            backgroundColor: colors.gray[50],
            borderColor: colors.gray[200],
          },
        ]}
        onPress={handlePress}
      >
        <Clock color={colors.text.tertiary} size={20} />
        <Text
          style={[
            localStyles.timeText,
            {
              color: colors.text.primary,
              fontFamily: theme.custom.fontFamilies.primary.text,
            },
          ]}
        >
          {reminderTime.toLocaleTimeString('en-US', {
            hour: 'numeric',
            hour12: true,
            minute: '2-digit',
          })}
        </Text>
      </AnimatedPressable>

      {showTimePicker ? <DateTimePicker
          display='spinner'
          is24Hour={false}
          mode='time'
          value={reminderTime}
          onChange={handleChange}
        /> : null}
    </View>
  );
}
