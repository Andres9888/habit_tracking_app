/**
 * Tips rendered inside the evidence section with green theme
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Lightbulb } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { colors } from '@/theme';
import { useAppTheme } from '../../../theme';
import { evidenceStyles as es } from '../styles';
import { evidenceDetailStyles as s } from '../styles/evidenceDetail.styles';

interface ScienceEvidenceTipsProps {
  tips: string[];
}

export function ScienceEvidenceTips({ tips }: ScienceEvidenceTipsProps) {
  const theme = useAppTheme();
  const fontFamily = theme.custom.fontFamilies.primary.text;

  if (!tips || tips.length === 0) return null;

  return (
    <>
      <View style={s.tipsDivider} />
      <View
        accessible
        accessibilityLabel={`Practical tips: ${tips.length} tips available`}
        accessibilityRole="text"
      >
        <View style={es.header}>
          <Lightbulb color={colors.primary[600]} size={iconSizes.medium} strokeWidth={2} />
          <Text style={[es.headerLabel, { fontFamily }]}>PRACTICAL TIPS</Text>
        </View>
        {tips.map((tip: string, index: number) => (
          <View key={index} style={s.tipItem}>
            <View
              style={[
                s.tipIconContainer,
                { backgroundColor: `${colors.primary[600]}15` },
              ]}
            >
              <Text style={[s.tipNumber, { color: colors.primary[600] }]}>
                {index + 1}
              </Text>
            </View>
            <Text style={[s.tipText, { fontFamily }]}>{tip}</Text>
          </View>
        ))}
      </View>
    </>
  );
}
