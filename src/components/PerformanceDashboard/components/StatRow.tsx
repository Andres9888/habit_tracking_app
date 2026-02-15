/**
 * Stat Row Component
 * Label-value pair display used in tab statistics sections.
 */

import React from 'react';
import { Text, View } from 'react-native';

import { tabStyles } from './tabStyles';

interface StatRowProps {
  label: string;
  value: string;
}

export function StatRow({ label, value }: StatRowProps) {
  return (
    <View style={tabStyles.statRow}>
      <Text style={tabStyles.statLabel}>{label}</Text>
      <Text style={tabStyles.statValue}>{value}</Text>
    </View>
  );
}
