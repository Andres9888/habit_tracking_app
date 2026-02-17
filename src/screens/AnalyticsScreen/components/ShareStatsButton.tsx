/**
 * ShareStatsButton — opens the StatCardGenerator modal from the Analytics screen
 */

import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing, borderRadius } from '../../../theme/spacing';

interface ShareStatsButtonProps {
  onPress: () => void;
}

export const ShareStatsButton: React.FC<ShareStatsButtonProps> = ({
  onPress,
}) => {
  return (
    <AnimatedPressable
      accessible
      accessibilityHint='Double tap to create and share a shareable stat card'
      accessibilityLabel='Share Stats'
      accessibilityRole='button'
      style={styles.button}
      onPress={onPress}
    >
      <Ionicons color={colors.primary[700]} name='share-social-outline' size={20} />
      <Text style={styles.buttonText}>Share Stats</Text>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: colors.primary[100],
    borderColor: colors.primary[300],
    borderRadius: borderRadius.button,
    borderWidth: 1.5,
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
    paddingVertical: spacing.md,
  },
  buttonText: {
    ...typography.button,
    color: colors.primary[700],
    marginLeft: spacing.sm,
  },
});
