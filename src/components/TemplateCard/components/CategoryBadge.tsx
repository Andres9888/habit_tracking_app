/**
 * CategoryBadge Component
 *
 * Badge displaying template category and premium status
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '../../../theme';
import { borderRadius, spacing } from '../../../theme/spacing';
import { typography } from '@/theme/typography';
import { CATEGORY_LABELS } from '../TemplateCard.constants';

interface CategoryBadgeProps {
  category?: string;
  iconColor: string;
  isPremium: boolean;
}

export function CategoryBadge({
  category,
  iconColor,
  isPremium,
}: CategoryBadgeProps) {
  const theme = useAppTheme();

  return (
    <View style={styles.badgeRow}>
      {category && (
        <View
          style={[styles.categoryBadge, { backgroundColor: `${iconColor}15` }]}
        >
          <Text
            style={[
              theme.custom.typography.caption,
              { color: '#4b5563', fontWeight: '600' },
            ]}
          >
            {CATEGORY_LABELS[category] || category}
          </Text>
        </View>
      )}

      {isPremium && (
        <View style={styles.inlinePremiumBadge}>
          <Text style={styles.inlinePremiumText}>Premium</Text>
        </View>
      )}
    </View>
  );
}

export const styles = StyleSheet.create({
  badgeRow: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginLeft: spacing.sm,
  },
  categoryBadge: {
    borderRadius: borderRadius.small,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  inlinePremiumBadge: {
    backgroundColor: '#ede9fe',
    borderRadius: borderRadius.small,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  inlinePremiumText: {
    color: '#7c3aed',
    fontSize: typography.tabBar.fontSize,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
