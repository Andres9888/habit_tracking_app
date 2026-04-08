/**
 * Science box for FullsizeTemplatePreview
 * Displays scientific research, reference link, and optional paper link
 */

import React from 'react';
import { View, Text, Pressable, Linking } from 'react-native';
import { useAppTheme } from '../../../theme';
import { scienceStyles } from '../styles';
import type { Doc } from '../../../../convex/_generated/dataModel';

interface ScienceBoxProps {
  template: Doc<'templates'>;
}

export function ScienceBox({ template }: ScienceBoxProps) {
  const theme = useAppTheme();
  const fontFamily = theme.custom.fontFamilies.primary.text;
  const hasLink = Boolean(template?.scientificLink);

  return (
    <View style={scienceStyles.scienceBox}>
      <View style={scienceStyles.scienceHeader}>
        <Text style={scienceStyles.scienceIcon}>🔬</Text>
        <Text style={[scienceStyles.scienceLabel, { fontFamily }]}>
          SCIENCE BEHIND THIS HABIT
        </Text>
      </View>
      <View style={scienceStyles.scienceDivider} />
      <Text style={[scienceStyles.scienceQuote, { fontFamily }]}>
        "{template?.scientificReference ?? ''}"
      </Text>
      {hasLink ? (
        <Pressable
          accessibilityLabel='Read the research paper'
          accessibilityRole='link'
          hitSlop={8}
          onPress={() => void Linking.openURL(template.scientificLink!)}
        >
          <Text style={[scienceStyles.researchLink, { fontFamily }]}>
            📄 Read the research →
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
