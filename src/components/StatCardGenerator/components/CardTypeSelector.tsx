/**
 * CardTypeSelector — horizontal picker for the three stat card templates
 */

import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';
import { typography } from '../../../theme/typography';
import { borderRadius, spacing } from '../../../theme/spacing';
import {
  CARD_TYPE_CONFIG,
  CARD_TYPE_ORDER,
} from '../StatCardGenerator.constants';
import type { StatCardType } from '../StatCardGenerator.types';

interface CardTypeSelectorProps {
  selectedType: StatCardType;
  onSelectType: (type: StatCardType) => void;
}

export function CardTypeSelector({
  selectedType,
  onSelectType,
}: CardTypeSelectorProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.sectionLabel}>Card Type</Text>
      <ScrollView
        horizontal
        contentContainerStyle={styles.scrollContent}
        showsHorizontalScrollIndicator={false}
      >
        {CARD_TYPE_ORDER.map((type) => {
          const config = CARD_TYPE_CONFIG[type];
          const isSelected = type === selectedType;
          return (
            <Pressable
              key={type}
              accessibilityLabel={`${config.label} stat card`}
              accessibilityRole='button'
              accessibilityState={{ selected: isSelected }}
              style={[styles.chip, isSelected && styles.chipSelected]}
              onPress={() => onSelectType(type)}
            >
              <Text style={styles.chipEmoji}>{config.emoji}</Text>
              <Text
                style={[
                  styles.chipLabel,
                  isSelected && styles.chipLabelSelected,
                ]}
              >
                {config.label}
              </Text>
              <Text style={styles.chipDesc}>{config.description}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignItems: 'center',
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.card,
    marginRight: spacing.sm,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    width: 148,
  },
  chipDesc: {
    ...typography.caption,
    color: colors.gray[400],
    marginTop: 2,
    textAlign: 'center',
  },
  chipEmoji: {
    fontSize: 28,
    marginBottom: spacing.xs,
  },
  chipLabel: {
    ...typography.bodySmall,
    color: colors.gray[600],
    fontWeight: '600',
    textAlign: 'center',
  },
  chipLabelSelected: {
    color: colors.primary[700],
  },
  chipSelected: {
    backgroundColor: colors.primary[100],
    borderColor: colors.primary[400],
    borderWidth: 2,
  },
  scrollContent: {
    paddingHorizontal: spacing.base,
  },
  sectionLabel: {
    ...typography.bodySmall,
    color: colors.gray[500],
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.base,
    textTransform: 'uppercase',
  },
  wrapper: {
    marginTop: spacing.base,
  },
});
