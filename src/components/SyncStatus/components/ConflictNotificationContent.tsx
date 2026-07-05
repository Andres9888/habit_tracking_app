/**
 * ConflictNotificationContent - Inner content of the ConflictNotification
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import { styles } from '../ConflictNotification.styles';

interface ConflictNotificationContentProps {
  conflictCount: number;
  onDismiss?: () => void;
}

export function ConflictNotificationContent({
  conflictCount,
  onDismiss,
}: ConflictNotificationContentProps) {
  const { colors } = useThemeColors();

  return (
    <Pressable
      style={styles.content}
      onPress={onDismiss}
      accessibilityLabel='Dismiss conflict notification'
      accessibilityRole='button'
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>⚠️</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: colors.surface }]}>
          Sync Conflict Resolved
        </Text>
        <Text style={[styles.message, { color: colors.surface }]}>
          {conflictCount} {conflictCount === 1 ? 'change was' : 'changes were'}{' '}
          overridden by server data
        </Text>
      </View>
    </Pressable>
  );
}
