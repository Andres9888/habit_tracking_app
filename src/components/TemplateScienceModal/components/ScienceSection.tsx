/**
 * ScienceSection - Scientific backing and research citations
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import { ExternalLink } from 'lucide-react-native';
import { useAppTheme } from '../../../theme';
import { sectionStyles, scienceStyles } from '../styles';
import { AnimatedBorderBox } from './AnimatedBorderBox';
import { getWhyItWorksText } from '../TemplateScienceModal.utils';
import type { ScienceSectionProps } from '../TemplateScienceModal.types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const ScienceSection = ({
  animatedStyle,
  baseColor,
  linkButtonAnimatedStyle,
  onLinkPress,
  pressHandlers,
  scientificLink,
  scientificReference,
  template,
}: ScienceSectionProps) => {
  const theme = useAppTheme();
  const whyItWorksText = getWhyItWorksText(template);

  return (
    <Animated.View
      accessible
      accessibilityLabel={`Scientific backing: ${scientificReference}. Why this habit works: ${whyItWorksText}`}
      style={[sectionStyles.sectionCard, animatedStyle]}
    >
      <View style={sectionStyles.sectionHeader}>
        <View
          style={[
            sectionStyles.sectionIconBadge,
            { backgroundColor: '#F0FDF4' },
          ]}
        >
          <Text style={sectionStyles.sectionIconEmoji}>🔬</Text>
        </View>
        <Text
          style={[
            sectionStyles.sectionTitle,
            { fontFamily: theme.custom.fontFamilies.primary.text },
          ]}
        >
          Scientific Backing
        </Text>
      </View>

      <AnimatedBorderBox baseColor={baseColor}>
        <View style={scienceStyles.citationHeader}>
          <View style={scienceStyles.citationDot} />
          <Text
            style={[
              scienceStyles.citationLabel,
              { fontFamily: theme.custom.fontFamilies.primary.text },
            ]}
          >
            Research Citation
          </Text>
        </View>
        <Text
          style={[
            scienceStyles.citationText,
            { fontFamily: theme.custom.fontFamilies.primary.text },
          ]}
        >
          "{scientificReference}"
        </Text>

        {scientificLink && (
          <AnimatedPressable
            accessibilityHint='Opens research paper in your browser'
            accessibilityLabel='Read the full research paper'
            accessibilityRole='link'
            style={[scienceStyles.linkButton, linkButtonAnimatedStyle]}
            onPress={onLinkPress}
            {...pressHandlers}
          >
            <ExternalLink color='#3B82F6' size={16} strokeWidth={2.5} />
            <Text
              style={[
                scienceStyles.linkText,
                { fontFamily: theme.custom.fontFamilies.primary.text },
              ]}
            >
              Read Full Research Paper
            </Text>
          </AnimatedPressable>
        )}
      </AnimatedBorderBox>

      <View
        accessible
        accessibilityRole='text'
        style={scienceStyles.whyItWorksContainer}
      >
        <View style={scienceStyles.whyItWorksHeader}>
          <Text style={scienceStyles.whyItWorksEmoji}>💡</Text>
          <Text
            style={[
              scienceStyles.whyItWorksTitle,
              { fontFamily: theme.custom.fontFamilies.primary.text },
            ]}
          >
            Why This Habit Works
          </Text>
        </View>
        <Text
          style={[
            scienceStyles.whyItWorksText,
            { fontFamily: theme.custom.fontFamilies.primary.text },
          ]}
        >
          {whyItWorksText}
        </Text>
      </View>
    </Animated.View>
  );
};
