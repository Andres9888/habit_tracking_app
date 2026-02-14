/**
 * ResearchCitation - Research citation box with optional link
 */

import React from 'react';
import { View, Text, Pressable, type ViewStyle } from 'react-native';
import Animated, { type AnimatedStyleProp } from 'react-native-reanimated';
import { ExternalLink } from 'lucide-react-native';
import { useAppTheme } from '../../../theme';
import { scienceStyles } from '../styles';
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
  linkButtonAnimatedStyle: AnimatedStyleProp<ViewStyle>;
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

  return (
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
  );
}
