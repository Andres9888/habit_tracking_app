/**
 * Hero section for FullsizeTemplatePreview
 * Category-themed domed backdrop + accent halo, premium icon tile, Literata name,
 * tagline, and neutral metadata pills. Theming comes from scienceTheme(template)
 * so the hero, the Why-it-works card, and the header tint all share one accent.
 */

import React, { useState } from 'react';
import { View, Text, Dimensions, type LayoutChangeEvent } from 'react-native';

import { colors } from '@/theme';
import { withAlpha } from '@/theme/colors/alpha';
import { heroStyles } from '../styles';
import { HeroBackdrop } from './hero/HeroBackdrop';
import { HeroIconTile } from './hero/HeroIconTile';
import { HeroMetaPills } from './HeroMetaPills';
import { scienceTheme } from './science/scienceTheme';
import type { HeroSectionProps } from './HeroSection.types';

export function HeroSection({
  template,
  iconAnimatedStyle,
  iconGlowStyle,
}: HeroSectionProps) {
  const t = scienceTheme(template);
  const [size, setSize] = useState({
    width: Dimensions.get('window').width,
    height: 240,
  });
  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize((s) =>
      s.width === width && s.height === height ? s : { width, height }
    );
  };

  return (
    <View style={heroStyles.heroGradient} onLayout={onLayout}>
      <HeroBackdrop
        accent={t.accent}
        gradientStart={t.gradientStart}
        gradientEnd={t.gradientEnd}
        height={size.height}
        width={size.width}
      />
      <View
        style={[heroStyles.heroHairline, { backgroundColor: withAlpha(t.accent, 0.12) }]}
      />
      <View style={heroStyles.heroContent}>
        <HeroIconTile
          accent={t.accent}
          icon={template?.icon ?? '✨'}
          iconAnimatedStyle={iconAnimatedStyle}
          iconGlowStyle={iconGlowStyle}
        />
        <Text testID='templates-preview-name' style={heroStyles.templateName}>
          {template?.name ?? 'Template'}
        </Text>
        {template?.tagline ? (
          <Text style={heroStyles.tagline}>{template.tagline}</Text>
        ) : null}
        <HeroMetaPills iconColor={colors.gray[500]} template={template} />
      </View>
    </View>
  );
}
