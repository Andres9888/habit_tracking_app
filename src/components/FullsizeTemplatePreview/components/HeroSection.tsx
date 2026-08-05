/**
 * Hero section for FullsizeTemplatePreview
 * Displays the template icon, name, and metadata pills
 */

import React from 'react';
import { View, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { heroStyles } from '../styles';
import { HeroMetaPills } from './HeroMetaPills';
import { buildHeroGradient } from '../utils/heroGradient';
import type { HeroSectionProps } from './HeroSection.types';

export function HeroSection({
  template,
  iconColor,
  iconAnimatedStyle,
  iconGlowStyle,
}: HeroSectionProps) {
  const baseGradient = buildHeroGradient(iconColor);
  // First stop is transparent so the ScrollView's header-matching background
  // shows through — prevents alpha-stacking that makes the hero top read
  // darker than the ModalHeader.
  const gradientColors: readonly [string, string, string] = [
    'transparent',
    baseGradient[1],
    baseGradient[2],
  ];

  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={heroStyles.heroGradient}
    >
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
            testID='templates-preview-icon'
            style={[
              heroStyles.iconContainer,
              { backgroundColor: `${iconColor}20` },
            ]}
          >
            <Text style={heroStyles.iconText}>{template?.icon ?? '✨'}</Text>
          </View>
        </Animated.View>

        <Text testID='templates-preview-name' style={heroStyles.templateName}>
          {template?.name ?? 'Template'}
        </Text>

        {template?.tagline ? (
          <Text style={heroStyles.tagline}>{template.tagline}</Text>
        ) : null}

        <HeroMetaPills iconColor={iconColor} template={template} />
      </View>
    </LinearGradient>
  );
}
