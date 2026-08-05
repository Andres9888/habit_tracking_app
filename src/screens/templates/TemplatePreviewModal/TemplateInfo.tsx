/**
 * Template category and frequency info pills
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import { borderRadius } from '../../../theme/spacing';
import { typography, fontFamilies, fontWeights } from '../../../theme/typography';
import type { TemplateInfoProps } from './types';

const localStyles = StyleSheet.create({
  infoContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  infoPill: {
    borderRadius: borderRadius.medium,
    flex: 1,
    padding: 12,
  },
  infoPillLabel: {
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.caption.fontSize,
    fontWeight: fontWeights.semibold,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  infoPillValue: {
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.body.fontSize,
    fontWeight: fontWeights.bold,
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
    <View style={localStyles.infoContainer}>
      <View style={[localStyles.infoPill, { backgroundColor: colors.gray[200] }]}>
        <Text style={[localStyles.infoPillLabel, { color: colors.text.secondary }]}>
          Category
        </Text>
        <Text style={[localStyles.infoPillValue, { color: colors.text.primary }]}>
          {formatCategory(category)}
        </Text>
      </View>
      <View style={[localStyles.infoPill, { backgroundColor: colors.gray[200] }]}>
        <Text style={[localStyles.infoPillLabel, { color: colors.text.secondary }]}>
          Frequency
        </Text>
        <Text style={[localStyles.infoPillValue, { color: colors.text.primary }]}>
          {formatFrequency(frequency)}
        </Text>
      </View>
    </View>
  );
}
