/**
 * Research-backed pill — section header for Science & Evidence
 */

import React from 'react';
import { View, Text } from 'react-native';
import { ShieldCheck } from 'lucide-react-native';

import { colors } from '@/theme';
import { iconSizes } from '@/theme/iconSizes';
import { evidenceStyles as s } from '../styles';

export function ScienceEvidenceHeader() {
  return (
    <View
      accessible
      accessibilityLabel="Science-backed"
      accessibilityRole="text"
      style={s.pill}
    >
      <ShieldCheck color={colors.primary[700]} size={iconSizes.small} strokeWidth={2.2} />
      <Text style={s.pillText}>Science-backed</Text>
    </View>
  );
}
