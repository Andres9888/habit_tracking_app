/**
 * SuggestedActions Component
 * Displays suggested focus actions for at-risk habits
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Bell, Lightbulb } from 'lucide-react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { iconSizes } from '@/theme/iconSizes';
import { colors } from '../../theme/colors';
import { suggestedActionsStyles as styles } from './SuggestedActions.styles';

export function SuggestedActions() {
  return (
    <View style={styles.suggestedActions}>
      <Text style={styles.suggestedActionsTitle}>Suggested Focus</Text>
      <AnimatedPressable
        accessibilityLabel='Set reminders for at-risk habits'
        accessibilityRole='button'
        style={styles.actionButton}
      >
        <Bell color={colors.primary[500]} size={iconSizes.small} />
        <Text style={styles.actionButtonText}>
          Set reminders for at-risk habits
        </Text>
      </AnimatedPressable>
      <AnimatedPressable
        accessibilityLabel='Review habit difficulty'
        accessibilityRole='button'
        style={styles.actionButton}
      >
        <Lightbulb color={colors.primary[500]} size={iconSizes.small} />
        <Text style={styles.actionButtonText}>Review habit difficulty</Text>
      </AnimatedPressable>
    </View>
  );
}
