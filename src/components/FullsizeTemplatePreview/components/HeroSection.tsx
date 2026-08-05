/**
 * Hero section for FullsizeTemplatePreview
 * Warm-peach gradient hero: cream icon tile, serif title, meta chips.
 */

import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { heroStyles } from '../styles';
import { useDetailPalette } from '../detailPalette';
import { HeroIconTile } from './HeroIconTile';
import { HeroMetaPills } from './HeroMetaPills';
import type { HeroSectionProps } from './HeroSection.types';

export function HeroSection({ template, iconAnimatedStyle }: HeroSectionProps) {
  const palette = useDetailPalette();

  // Every stop is an opaque hex, and stop 0 is the exact color the ModalHeader
  // and ScrollView background use — so there is nothing to alpha-stack. Do NOT
  // reintroduce a 'transparent' first stop: RN interpolates it as transparent
  // BLACK, which greys out the middle of the gradient.
  return (
    <LinearGradient
      colors={palette.heroGradient}
      locations={palette.heroLocations}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={heroStyles.heroGradient}
    >
      <View style={heroStyles.heroContent}>
        <HeroIconTile
          icon={template?.icon ?? '✨'}
          iconAnimatedStyle={iconAnimatedStyle}
        />

        <Text
          testID='templates-preview-name'
          style={[heroStyles.templateName, { color: palette.textPrimary }]}
        >
          {template?.name ?? 'Template'}
        </Text>

        {template?.tagline ? (
          <Text style={[heroStyles.tagline, { color: palette.textSecondary }]}>
            {template.tagline}
          </Text>
        ) : null}

        <HeroMetaPills template={template} />
      </View>
    </LinearGradient>
  );
}
