/**
 * YouTubeSection - Watch & Learn video link card
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated from 'react-native-reanimated';
import { Play, ExternalLink } from 'lucide-react-native';
import { useAppTheme } from '../../../theme';
import { useThemeColors } from '../../../theme/ThemeContext';
import { sectionStyles, themedSectionStyles, youtubeStyles } from '../styles';
import type { YouTubeSectionProps } from '../TemplateScienceModal.types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const YouTubeSection = ({
  animatedStyle,
  onPress,
  pressHandlers,
  buttonAnimatedStyle,
  templateName,
}: YouTubeSectionProps) => {
  const theme = useAppTheme();
  const { colors, isDark } = useThemeColors();
  const themed = themedSectionStyles(colors);

  return (
    <Animated.View style={[themed.sectionCard, animatedStyle]}>
      <View style={sectionStyles.sectionHeader}>
        <View
          style={[
            sectionStyles.sectionIconBadge,
            { backgroundColor: isDark ? colors.gray[100] : '#FEE2E2' },
          ]}
        >
          <Play color='#DC2626' fill='#DC2626' size={16} />
        </View>
        <Text
          style={[
            themed.sectionTitle,
            { fontFamily: theme.custom.fontFamilies.primary.text },
          ]}
        >
          Watch & Learn
        </Text>
      </View>

      <AnimatedPressable
        accessibilityHint='Opens YouTube video in your browser'
        accessibilityLabel={`Watch video about ${templateName} on YouTube`}
        accessibilityRole='link'
        style={[youtubeStyles.youtubeButton, buttonAnimatedStyle]}
        onPress={onPress}
        {...pressHandlers}
      >
        <LinearGradient
          colors={['#FF0000', '#CC0000']}
          end={{ x: 1, y: 1 }}
          start={{ x: 0, y: 0 }}
          style={youtubeStyles.youtubeGradient}
        >
          <Play color='#FFFFFF' fill='#FFFFFF' size={24} />
        </LinearGradient>
        <View style={youtubeStyles.youtubeTextContainer}>
          <Text style={youtubeStyles.youtubeTitle}>Video Explanation</Text>
          <Text style={youtubeStyles.youtubeSubtitle}>Watch on YouTube</Text>
        </View>
        <ExternalLink color='#DC2626' size={18} />
      </AnimatedPressable>
    </Animated.View>
  );
};
