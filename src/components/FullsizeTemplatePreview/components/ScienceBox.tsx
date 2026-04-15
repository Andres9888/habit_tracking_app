/**
 * Science box for FullsizeTemplatePreview
 * Displays scientific research, reference link, and optional paper link
 */

import React from 'react';
import { View, Text, Pressable, Linking } from 'react-native';
import { useAppTheme } from '../../../theme';
import { useThemeColors } from '../../../theme/ThemeContext';
import { createScienceStyles } from '../styles/science.styles';
import type { Doc } from '../../../../convex/_generated/dataModel';

interface ScienceBoxProps {
  template: Doc<'templates'>;
}

export function ScienceBox({ template }: ScienceBoxProps) {
  const theme = useAppTheme();
  const { colors } = useThemeColors();
  const styles = createScienceStyles(colors);
  const fontFamily = theme.custom.fontFamilies.primary.text;
  const hasLink = Boolean(template?.scientificLink);

  return (
    <View style={styles.scienceBox}>
      <View style={styles.scienceHeader}>
        <Text style={styles.scienceIcon}>🔬</Text>
        <Text style={[styles.scienceLabel, { fontFamily }]}>
          SCIENCE BEHIND THIS HABIT
        </Text>
      </View>
      <View style={styles.scienceDivider} />
      <Text style={[styles.scienceQuote, { fontFamily }]}>
        "{template?.scientificReference ?? ''}"
      </Text>
      {hasLink ? (
        <Pressable
          accessibilityLabel='Read the research paper'
          accessibilityRole='link'
          hitSlop={8}
          onPress={() => void Linking.openURL(template.scientificLink!)}
        >
          <Text style={[styles.researchLink, { fontFamily }]}>
            📄 Read the research →
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
