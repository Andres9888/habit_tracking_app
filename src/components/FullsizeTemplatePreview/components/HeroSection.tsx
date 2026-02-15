/**
 * Hero section for FullsizeTemplatePreview
 * Displays the template icon, name, and metadata pills
 */

import React from 'react';
import { View, Text } from 'react-native';

import Animated from 'react-native-reanimated';
import { Clock, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import type { HeroSectionProps } from './HeroSection.types';
import {
  FREQUENCY_LABELS,
  CATEGORY_LABELS,
} from '../FullsizeTemplatePreview.constants';
import { MetadataPill } from './MetadataPill';
import { heroStyles } from '../styles';
import { useAppTheme } from '../../../theme';

export function HeroSection({
  template,
  iconColor,
  iconAnimatedStyle,
  iconGlowStyle,
}: HeroSectionProps) {
  const theme = useAppTheme();
  const gradientColors = [
    `${iconColor}15`,
    `${iconColor}08`,
    '#FAFAF9',
  ] as const;
  const formattedFrequency =
    FREQUENCY_LABELS[template?.frequency] || template?.frequency || 'Daily';
  const formattedCategory =
    CATEGORY_LABELS[template?.category] || template?.category || 'General';

  return (
    <LinearGradient colors={gradientColors} style={heroStyles.heroGradient}>
      <View style={heroStyles.heroContent}>
        <Animated.View style={[heroStyles.iconWrapper, iconAnimatedStyle]}>
          <Animated.View
            style={[
              heroStyles.iconGlow,
              { backgroundColor: iconColor, shadowColor: iconColor },
              iconGlowStyle,
            ]}
          />
          <View
            style={[
              heroStyles.iconContainer,
              { backgroundColor: `${iconColor}20` },
            ]}
          >
            <Text style={heroStyles.iconText}>{template?.icon ?? '✨'}</Text>
          </View>
        </Animated.View>

        <Text
          style={[
            heroStyles.templateName,
            { fontFamily: theme.custom.fontFamilies.primary.text },
          ]}
        >
          {template?.name ?? 'Template'}
        </Text>

        <View style={heroStyles.pillsRow}>
          <MetadataPill
            icon={<Clock color={iconColor} size={14} strokeWidth={2} />}
            iconColor={iconColor}
          >
            {formattedFrequency}
          </MetadataPill>
          <MetadataPill
            icon={<Sparkles color={iconColor} size={14} strokeWidth={2} />}
            iconColor={iconColor}
          >
            {formattedCategory}
          </MetadataPill>
          <MetadataPill iconColor={iconColor}>⏱️ 5-10 min</MetadataPill>
        </View>
      </View>
    </LinearGradient>
  );
}
