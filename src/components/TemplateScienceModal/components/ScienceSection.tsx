/**
 * ScienceSection - Scientific backing and research citations
 */

import React from 'react';
import { View, Text } from 'react-native';

import Animated from 'react-native-reanimated';

import type { ScienceSectionProps } from '../TemplateScienceModal.types';
import { ResearchCitation } from './ResearchCitation';
import { WhyItWorks } from './WhyItWorks';
import { getWhyItWorksText } from '../TemplateScienceModal.utils';
import { sectionStyles } from '../styles';
import { useAppTheme } from '../../../theme';

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

      <ResearchCitation
        baseColor={baseColor}
        linkButtonAnimatedStyle={linkButtonAnimatedStyle}
        pressHandlers={pressHandlers}
        scientificLink={scientificLink}
        scientificReference={scientificReference}
        onLinkPress={onLinkPress}
      />

      <WhyItWorks whyItWorksText={whyItWorksText} />
    </Animated.View>
  );
};
