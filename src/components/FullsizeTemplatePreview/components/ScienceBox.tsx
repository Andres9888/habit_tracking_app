/**
 * Science box for FullsizeTemplatePreview
 * Displays scientific research and reference link
 */

import React from 'react';
import { View, Text } from 'react-native';
import { useAppTheme } from '../../../theme';
import { scienceStyles } from '../styles';
import type { Doc } from '../../../../convex/_generated/dataModel';

interface ScienceBoxProps {
  template: Doc<'templates'>;
}

export function ScienceBox({ template }: ScienceBoxProps) {
  const theme = useAppTheme();

  return (
    <View style={scienceStyles.scienceBox}>
      <View style={scienceStyles.scienceHeader}>
        <Text style={scienceStyles.scienceIcon}>🔬</Text>
        <Text
          style={[
            scienceStyles.scienceLabel,
            { fontFamily: theme.custom.fontFamilies.primary.text },
          ]}
        >
          SCIENCE BEHIND THIS HABIT
        </Text>
      </View>
      <View style={scienceStyles.scienceDivider} />
      <Text
        style={[
          scienceStyles.scienceQuote,
          { fontFamily: theme.custom.fontFamilies.primary.text },
        ]}
      >
        "{template?.scientificReference ?? ''}"
      </Text>
    </View>
  );
}
