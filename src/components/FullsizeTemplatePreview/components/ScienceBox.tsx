/**
 * Science box for FullsizeTemplatePreview
 * Displays scientific research and reference link
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import { ExternalLink } from 'lucide-react-native';
import { useAppTheme } from '../../../theme';
import { scienceStyles } from '../styles';
import type { Doc } from '../../../../convex/_generated/dataModel';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ScienceBoxProps {
  template: Doc<'templates'>;
  onResearchPress: () => void;
}

export function ScienceBox({ template, onResearchPress }: ScienceBoxProps) {
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
        "{template.scientificReference}"
      </Text>

      {template.scientificLink && (
        <AnimatedPressable
          accessible
          accessibilityHint='Opens the research paper in your browser'
          accessibilityLabel='Read research paper'
          accessibilityRole='link'
          style={scienceStyles.researchLinkButton}
          onPress={onResearchPress}
        >
          <ExternalLink color='#3B82F6' size={16} strokeWidth={2} />
          <Text style={scienceStyles.researchLinkText}>Read Research</Text>
        </AnimatedPressable>
      )}
    </View>
  );
}
