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
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    flex: 1,
    padding: 12,
  },
  infoPillLabel: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  infoPillValue: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '700',
  },
});

const formatCategory = (category: string): string => {
  return category
    .replaceAll('_', ' ')
    .replaceAll(/\b\w/g, (c: string) => c.toUpperCase());
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
