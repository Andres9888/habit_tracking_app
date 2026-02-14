/**
 * Template category and frequency info pills
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { TemplateInfoProps } from './types';

const styles = StyleSheet.create({
  infoContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  infoPill: {
    backgroundColor: '#FAF8F5',
    borderRadius: 12,
    flex: 1,
    padding: 12,
  },
  infoPillLabel: {
    color: '#78716c', // stone-500
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  infoPillValue: {
    color: '#1c1917', // stone-900
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
  return (
    <View style={styles.infoContainer}>
      <View style={styles.infoPill}>
        <Text style={styles.infoPillLabel}>Category</Text>
        <Text style={styles.infoPillValue}>{formatCategory(category)}</Text>
      </View>
      <View style={styles.infoPill}>
        <Text style={styles.infoPillLabel}>Frequency</Text>
        <Text style={styles.infoPillValue}>{formatFrequency(frequency)}</Text>
      </View>
    </View>
  );
}
