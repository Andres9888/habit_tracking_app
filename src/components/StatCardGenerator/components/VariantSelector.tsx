/**
 * VariantSelector — horizontal picker for Minimal / Bold / Dark variants
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';
import { typography } from '../../../theme/typography';
import { borderRadius, spacing } from '../../../theme/spacing';
import {
  VARIANT_CONFIG,
  VARIANT_ORDER,
  VARIANT_GRADIENTS,
} from '../StatCardGenerator.constants';
import type { StatCardVariant } from '../StatCardGenerator.types';

interface VariantSelectorProps {
  selectedVariant: StatCardVariant;
  onSelectVariant: (variant: StatCardVariant) => void;
}

/** Maps variant → a single representative swatch colour */
const SWATCH: Record<StatCardVariant, string> = {
  bold: '#059669',
  dark: '#1F2937',
  minimal: '#ECFDF5',
};

export function VariantSelector({
  selectedVariant,
  onSelectVariant,
}: VariantSelectorProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.sectionLabel}>Style</Text>
      <View style={styles.row}>
        {VARIANT_ORDER.map((variant) => {
          const config = VARIANT_CONFIG[variant];
          const isSelected = variant === selectedVariant;
          return (
            <Pressable
              key={variant}
              accessibilityLabel={`${config.label} style`}
              accessibilityRole='button'
              accessibilityState={{ selected: isSelected }}
              style={[styles.chip, isSelected && styles.chipSelected]}
              onPress={() => onSelectVariant(variant)}
            >
              <View
                style={[styles.swatch, { backgroundColor: SWATCH[variant] }]}
              />
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignItems: 'center',
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.card,
    flex: 1,
    marginHorizontal: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.md,
  },
  chipDesc: {
    ...typography.caption,
    color: colors.gray[400],
    marginTop: 2,
    textAlign: 'center',
  },
  chipLabel: {
    ...typography.bodySmall,
    color: colors.gray[600],
    fontWeight: '600',
    marginTop: spacing.xs,
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
  row: {
    flexDirection: 'row',
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
  swatch: {
    borderRadius: 24,
    height: 36,
    width: 36,
  },
  wrapper: {
    marginTop: spacing.base,
  },
});
