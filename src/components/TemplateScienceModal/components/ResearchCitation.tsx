/**
 * ResearchCitation - Research citation box with optional link
 */

import React from 'react';
import { View, Text, Pressable, type ViewStyle } from 'react-native';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';
import { ExternalLink } from 'lucide-react-native';
import { useAppTheme } from '../../../theme';
import { useThemeColors } from '../../../theme/ThemeContext';
import { scienceStyles, themedScienceStyles } from '../styles';
import { AnimatedBorderBox } from './AnimatedBorderBox';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface PressHandlers {
  onPressIn: () => void;
  onPressOut: () => void;
}

interface ResearchCitationProps {
  baseColor: string;
  scientificReference: string;
  scientificLink?: string;
  linkButtonAnimatedStyle: AnimatedStyle<ViewStyle>;
  onLinkPress?: () => void;
  pressHandlers: PressHandlers;
}

export function ResearchCitation({
  baseColor,
  scientificReference,
  scientificLink,
  linkButtonAnimatedStyle,
  onLinkPress,
  pressHandlers,
}: ResearchCitationProps) {
  const theme = useAppTheme();
  const { colors, isDark } = useThemeColors();
  const themed = themedScienceStyles(colors, isDark);

  return (
    <AnimatedBorderBox baseColor={baseColor}>
      <View style={scienceStyles.citationHeader}>
        <View style={[scienceStyles.citationDot, themed.citationDot]} />
        <Text
          style={[
            scienceStyles.citationLabel,
            themed.citationLabel,
            { fontFamily: theme.custom.fontFamilies.primary.text },
          ]}
        >
          Research Citation
        </Text>
      </View>
      <Text
        style={[
          scienceStyles.citationText,
          themed.citationText,
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
          style={[scienceStyles.linkButton, themed.linkButton, linkButtonAnimatedStyle]}
          onPress={onLinkPress}
          {...pressHandlers}
        >
          <ExternalLink color={isDark ? colors.primary[400] : '#3B82F6'} size={16} strokeWidth={2.5} />
          <Text
            style={[
              scienceStyles.linkText,
              themed.linkText,
              { fontFamily: theme.custom.fontFamilies.primary.text },
            ]}
          >
            Read Full Research Paper
          </Text>
        </AnimatedPressable>
      )}
    </AnimatedBorderBox>
  );
}
