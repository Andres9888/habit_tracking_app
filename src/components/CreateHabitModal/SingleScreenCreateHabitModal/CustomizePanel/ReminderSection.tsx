/* eslint-disable max-lines-per-function */
/**
 * ReminderSection - Reminder toggle row (48px, default off)
 */
import { memo, useCallback } from 'react';
import { Keyboard, Pressable, Text, View } from 'react-native';
import useHapticFeedback from '../../../../hooks/useHapticFeedback';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants';

interface ReminderSectionProps {
  enabled: boolean;
  onPress: () => void;
  reminderTime: Date;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function ReminderSectionComponent({
  enabled,
  onPress,
  reminderTime,
}: ReminderSectionProps) {
  const { triggerSelection } = useHapticFeedback();

  const handlePress = useCallback(() => {
    Keyboard.dismiss();
    triggerSelection();
    onPress();
  }, [onPress, triggerSelection]);

  return (
    <View className='mb-4'>
      <Text
        style={{
          color: COLORS.mutedText,
          fontSize: TYPOGRAPHY.caption.fontSize,
          marginBottom: SPACING.sm,
        }}
      >
        Reminder
      </Text>

      <Pressable
        accessibilityHint={
          enabled ? 'Tap to change reminder time' : 'Tap to enable reminder'
        }
        accessibilityLabel={
          enabled ? `Reminder at ${formatTime(reminderTime)}` : 'Reminder off'
        }
        accessibilityRole='button'
        style={{
          alignItems: 'center',
          backgroundColor: COLORS.cardBackground,
          borderRadius: 8,
          flexDirection: 'row',
          height: 48,
          justifyContent: 'space-between',
          paddingHorizontal: SPACING.md,
        }}
        onPress={handlePress}
      >
        <Text
          style={{
            color: COLORS.secondary,
            fontSize: TYPOGRAPHY.body.fontSize,
          }}
        >
          Remind me
        </Text>
        <Text
          style={{
            color: enabled ? COLORS.accent : COLORS.mutedText,
            fontSize: TYPOGRAPHY.body.fontSize,
            fontWeight: enabled ? '500' : '400',
          }}
        >
          {enabled ? formatTime(reminderTime) : 'Off'}
        </Text>
      </Pressable>
    </View>
  );
}

export const ReminderSection = memo(ReminderSectionComponent);
