/**
 * CategoryBadge Component
 *
 * Badge displaying template category and premium status
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '../../../theme';
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

const styles = StyleSheet.create({
  badgeRow: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginLeft: 8,
  },
  categoryBadge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  inlinePremiumBadge: {
    backgroundColor: '#ede9fe',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  inlinePremiumText: {
    color: '#7c3aed',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
