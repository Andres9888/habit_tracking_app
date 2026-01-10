/**
 * FeatureListItem Component
 * Individual feature row for the premium paywall
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import type { FeatureItem } from '../PremiumAnalyticsPaywall.types';

interface FeatureListItemProps {
  feature: FeatureItem;
}

export const FeatureListItem: React.FC<FeatureListItemProps> = ({
  feature,
}) => (
  <View style={styles.featureItem}>
    <View style={styles.featureIcon}>
      <Ionicons
        color={colors.premium[600]}
        name={feature.icon as any}
        size={24}
      />
    </View>
    <View style={styles.featureContent}>
      <Text style={styles.featureTitle}>{feature.title}</Text>
      <Text style={styles.featureDescription}>{feature.description}</Text>
    </View>
    <Ionicons color={colors.success} name='checkmark-circle' size={20} />
  </View>
);

const styles = StyleSheet.create({
  featureContent: {
    flex: 1,
    marginRight: spacing.sm,
  },
  featureDescription: {
    color: colors.text.secondary,
    fontSize: 14,
    lineHeight: 20,
  },
  featureIcon: {
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 8,
    height: 40,
    justifyContent: 'center',
    marginRight: spacing.md,
    width: 40,
  },
  featureItem: {
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    borderRadius: 12,
    flexDirection: 'row',
    marginBottom: spacing.sm,
    padding: spacing.md,
  },
  featureTitle: {
    color: colors.text.primary,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
    marginBottom: spacing.xxs,
  },
});
