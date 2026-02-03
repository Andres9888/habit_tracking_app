/**
 * SuggestedActions Component
 * Displays suggested focus actions for at-risk habits
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { suggestedActionsStyles as styles } from './SuggestedActions.styles';

export function SuggestedActions() {
  return (
    <View style={styles.suggestedActions}>
      <Text style={styles.suggestedActionsTitle}>Suggested Focus</Text>
      <TouchableOpacity
        accessibilityLabel='Set reminders for at-risk habits'
        accessibilityRole='button'
        activeOpacity={0.7}
        style={styles.actionButton}
      >
        <Ionicons color={colors.primary[500]} name='notifications' size={16} />
        <Text style={styles.actionButtonText}>
          Set reminders for at-risk habits
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        accessibilityLabel='Review habit difficulty'
        accessibilityRole='button'
        activeOpacity={0.7}
        style={styles.actionButton}
      >
        <Ionicons color={colors.primary[500]} name='bulb' size={16} />
        <Text style={styles.actionButtonText}>Review habit difficulty</Text>
      </TouchableOpacity>
    </View>
  );
}
