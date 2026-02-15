/**
 * HeroSection - Template hero display with icon and badges
 */

import React from 'react';
import { View, Text } from 'react-native';

import Animated from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles, Clock, Timer, Flame } from 'lucide-react-native';

import type { HeroSectionProps } from '../TemplateScienceModal.types';
import { getGradientColors } from '../TemplateScienceModal.utils';
import { heroStyles, badgeStyles } from '../styles';
import { useAppTheme } from '../../../theme';

export const HeroSection = ({
  baseColor,
  heroAnimatedStyle,
  iconGlowAnimatedStyle,
  isPopular,
  readingTime,
  template,
}: HeroSectionProps) => {
  const theme = useAppTheme();
  const gradientColors = getGradientColors(baseColor);

  return (
    <LinearGradient colors={gradientColors} style={heroStyles.heroGradient}>
      <Animated.View
        accessible
        accessibilityLabel={`${template.name} template. Category: ${template.category.replace('_', ' ')}. Frequency: ${template.frequency}. ${isPopular ? 'This is a popular template.' : ''}`}
        accessibilityRole='header'
        style={[badgeStyles.templateHeader, heroAnimatedStyle]}
      >
        <View style={heroStyles.iconWrapper}>
          <Animated.View
            style={[
              heroStyles.iconGlow,
              { backgroundColor: baseColor, shadowColor: baseColor },
              iconGlowAnimatedStyle,
            ]}
          />
          <View
            style={[
              heroStyles.iconContainer,
              { backgroundColor: `${baseColor}20` },
            ]}
          >
            <Text style={heroStyles.iconText}>{template.icon}</Text>
          </View>
          {isPopular && (
            <View style={badgeStyles.popularBadge}>
              <Flame color='#FF6B35' fill='#FF6B35' size={14} />
            </View>
          )}
        </View>

        <Text
          style={[
            badgeStyles.templateName,
            { fontFamily: theme.custom.fontFamilies.primary.text },
          ]}
        >
          {template.name}
        </Text>

        <View style={heroStyles.pillRow}>
          <View
            style={[
              heroStyles.categoryBadge,
              { backgroundColor: `${baseColor}18` },
            ]}
          >
            <Sparkles color={baseColor} size={12} strokeWidth={2.5} />
            <Text style={[heroStyles.categoryText, { color: baseColor }]}>
              {template.category
                .replace('_', ' ')
                .replaceAll(/\b\w/g, (c) => c.toUpperCase())}
            </Text>
          </View>
          <View style={heroStyles.frequencyPill}>
            <Clock color='#6B7280' size={12} strokeWidth={2.5} />
            <Text style={heroStyles.frequencyPillText}>
              {template.frequency.charAt(0).toUpperCase() +
                template.frequency.slice(1)}
            </Text>
          </View>
          <View style={badgeStyles.readingTimePill}>
            <Timer color='#6B7280' size={12} strokeWidth={2.5} />
            <Text style={badgeStyles.readingTimePillText}>
              {readingTime} min read
            </Text>
          </View>
        </View>
      </Animated.View>
    </LinearGradient>
  );
};
