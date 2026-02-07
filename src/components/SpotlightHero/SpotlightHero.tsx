/**
 * SpotlightHero Component
 * Featured template showcase with gradient background and premium visual treatment
 *
 * Purpose: Highlight a curated template at the top of the Templates screen
 * Features: Gradient background using template accent color, shimmer effect, dual CTAs
 */

import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated from 'react-native-reanimated';
import { shadows } from '../../theme/spacing';

import type { SpotlightHeroProps } from './SpotlightHero.types';
import {
  useSpotlightAnimations,
  getGradientColors,
} from './SpotlightHero.hooks';
import {
  SpotlightBadge,
  TemplateContent,
  ActionButtons,
  ShimmerOverlay,
} from './components';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const SpotlightHero: React.FC<SpotlightHeroProps> = ({
  template,
  onPreview,
  onImport,
  isImporting = false,
  animationDelay = 0,
}) => {
  const { containerStyle, shimmerStyle, handlePressIn, handlePressOut } =
    useSpotlightAnimations(animationDelay);

  const gradientColors = getGradientColors(template.iconColor);

  return (
    <AnimatedPressable
      accessible
      accessibilityHint='Tap to preview this featured template'
      accessibilityLabel={`Spotlight: ${template.name}`}
      accessibilityRole='button'
      style={[styles.container, containerStyle]}
      onPress={onPreview}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <LinearGradient
        colors={gradientColors}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={styles.gradient}
      >
        <ShimmerOverlay shimmerStyle={shimmerStyle} />
        <SpotlightBadge />
        <TemplateContent template={template} />
        <ActionButtons
          iconColor={template.iconColor}
          isImporting={isImporting}
          onImport={onImport}
          onPreview={onPreview}
        />
      </LinearGradient>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    ...shadows.floatingActionButton,
    borderRadius: 20,
    marginBottom: 16,
    marginHorizontal: 20,
    overflow: 'hidden',
    shadowOpacity: 0.12,
  },
  gradient: {
    overflow: 'hidden',
    padding: 20,
  },
});

export default SpotlightHero;
