/**
 * ScienceSection - Scientific backing and research citations
 */

import React from 'react';
import { View, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { useAppTheme } from '../../../theme';
import { useThemeColors } from '../../../theme/ThemeContext';
import { sectionStyles, themedSectionStyles } from '../styles';
import { getWhyItWorksText } from '../TemplateScienceModal.utils';
import type { ScienceSectionProps } from '../TemplateScienceModal.types';
import { ResearchCitation } from './ResearchCitation';
import { WhyItWorks } from './WhyItWorks';

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
  const { colors, isDark } = useThemeColors();
  const themed = themedSectionStyles(colors);
  const whyItWorksText = getWhyItWorksText(template);

  return (
    <Animated.View
      accessible
      accessibilityLabel={`Scientific backing: ${scientificReference}. Why this habit works: ${whyItWorksText}`}
      style={[themed.sectionCard, animatedStyle]}
    >
      <View style={sectionStyles.sectionHeader}>
        <View
          style={[
            sectionStyles.sectionIconBadge,
            { backgroundColor: isDark ? colors.primary[100] : '#F0FDF4' },
          ]}
        >
          <Text style={sectionStyles.sectionIconEmoji}>🔬</Text>
        </View>
        <Text
          style={[
            themed.sectionTitle,
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
