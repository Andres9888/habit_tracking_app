/**
 * Template category and frequency info pills
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeColors } from '../../theme/ThemeContext';
import type { TemplateInfoProps } from './types';

const styles = StyleSheet.create({
  infoContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  infoPill: {
    borderRadius: 12,
    flex: 1,
    padding: 12,
  },
  infoPillLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  infoPillValue: {
    fontSize: 17,
    fontWeight: '700',
  },
});

const formatCategory = (category: string): string => {
  return category.replace('_', ' ').replaceAll(/\b\w/g, (c) => c.toUpperCase());
};

const formatFrequency = (frequency: string): string => {
  return frequency.charAt(0).toUpperCase() + frequency.slice(1);
};

export function TemplateInfo({ category, frequency }: TemplateInfoProps) {
  const { colors } = useThemeColors();
  return (
    <View style={styles.infoContainer}>
      <View style={[styles.infoPill, { backgroundColor: colors.gray[100] }]}>
        <Text style={[styles.infoPillLabel, { color: colors.text.secondary }]}>Category</Text>
        <Text style={[styles.infoPillValue, { color: colors.text.primary }]}>{formatCategory(category)}</Text>
      </View>
      <View style={[styles.infoPill, { backgroundColor: colors.gray[100] }]}>
        <Text style={[styles.infoPillLabel, { color: colors.text.secondary }]}>Frequency</Text>
        <Text style={[styles.infoPillValue, { color: colors.text.primary }]}>{formatFrequency(frequency)}</Text>
      </View>
    </View>
  );
}
