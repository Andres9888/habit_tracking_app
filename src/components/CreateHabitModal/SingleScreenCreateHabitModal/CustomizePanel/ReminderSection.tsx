/**
 * ReminderSection - Reminder toggle row for customize panel
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
    <View>
      <Pressable
        style={{
          backgroundColor: COLORS.cardBackground,
          borderRadius: 8,
          height: 48,
          paddingHorizontal: SPACING.sm,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
        onPress={handlePress}
      >
        <Text style={{ color: COLORS.mutedText, fontSize: TYPOGRAPHY.caption.fontSize }}>
          Remind me
        </Text>
        <Text style={{ color: enabled ? COLORS.secondary : COLORS.mutedText, fontSize: TYPOGRAPHY.body.fontSize }}>
          {enabled ? formatTime(reminderTime) : 'Off'}
        </Text>
      </Pressable>
    </View>
  );
}

export const ReminderSection = memo(ReminderSectionComponent);
