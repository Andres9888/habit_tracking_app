/**
 * Template category and frequency info pills
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
<<<<<<< HEAD
import { useThemeColors } from '../../../theme/ThemeContext';
=======
import { colors } from '../../../theme/colors';
>>>>>>> 18d9d6cc (ui: replace hardcoded colors with theme tokens in templates & analytics screens)
import type { TemplateInfoProps } from './types';

const localStyles = StyleSheet.create({
  infoContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  infoPill: {
<<<<<<< HEAD
=======
    backgroundColor: colors.gray[50],
>>>>>>> 18d9d6cc (ui: replace hardcoded colors with theme tokens in templates & analytics screens)
    borderRadius: 12,
    flex: 1,
    padding: 12,
  },
  infoPillLabel: {
<<<<<<< HEAD
=======
    color: colors.gray[500],
>>>>>>> 18d9d6cc (ui: replace hardcoded colors with theme tokens in templates & analytics screens)
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  infoPillValue: {
<<<<<<< HEAD
=======
    color: colors.gray[900],
>>>>>>> 18d9d6cc (ui: replace hardcoded colors with theme tokens in templates & analytics screens)
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
