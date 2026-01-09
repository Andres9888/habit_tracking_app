/**
 * TemplateCard Component
 *
 * Enhanced design with accent bar, color tint, and icon glow
 * Displays habit template with rich visual personality
 */

import React from 'react';
import { View, Pressable } from 'react-native';
import Animated, { FadeInUp, FadeIn } from 'react-native-reanimated';
import { useReduceMotion } from '../../hooks/useReduceMotion';
import {
  useTemplateCardAnimations,
  useTemplateCardCallbacks,
  useTemplateCardHandlers,
} from './hooks';
import { DEFAULT_ICON_COLOR, SUCCESS_COLOR } from './TemplateCard.constants';
import { styles } from './TemplateCard.styles';
import { TemplateCardContent } from './components/TemplateCardContent';
import type { TemplateCardProps } from './TemplateCard.types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function TemplateCard({
  animationIndex = 0,
  category,
  description,
  enableScrollReveal = false,
  frequency,
  hasAccess = true,
  icon,
  iconColor: iconColorProp,
  isImported = false,
  isImporting = false,
  isPremium = false,
  name,
  onImport,
  onPreview,
  onUpgrade,
  popularityScore,
  scientificLink,
  scientificReference,
  showPreviewCTA = true,
  style,
  youtubeLink,
}: TemplateCardProps) {
  const reducedMotion = useReduceMotion();
  const isLocked = isPremium && !hasAccess;
  const iconColor = iconColorProp?.trim() || DEFAULT_ICON_COLOR;

  const {
    checkmarkStyle,
    containerStyle,
    glowStyle,
    pressScale,
    shadowOpacity,
    shadowStyle,
  } = useTemplateCardAnimations({ animationIndex, isImported, reducedMotion });
  const { handlePressIn, handlePressOut } = useTemplateCardHandlers(
    pressScale,
    shadowOpacity
  );
  const { handleCardPress, handleImportPress } = useTemplateCardCallbacks({
    isLocked,
    onImport,
    onPreview,
    onUpgrade,
  });

  const scrollRevealAnimation = reducedMotion
    ? FadeIn.duration(0)
    : FadeInUp.duration(350).springify().damping(18).stiffness(120);

  const cardContent = (
    <AnimatedPressable
      accessible
      accessibilityHint='Tap to preview, or tap Import Habit to add to your habits'
      accessibilityLabel={`${name} template. ${description}`}
      accessibilityRole='button'
      style={[
        styles.card,
        { backgroundColor: '#fff', opacity: isLocked ? 0.75 : 1 },
        containerStyle,
        shadowStyle,
        style,
      ]}
      onPress={handleCardPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        pointerEvents='none'
        style={[
          styles.glowOverlay,
          { backgroundColor: SUCCESS_COLOR },
          glowStyle,
        ]}
      />
      <View
        style={[
          styles.accentBar,
          { backgroundColor: isImported ? SUCCESS_COLOR : iconColor },
        ]}
      />
      <TemplateCardContent
        category={category}
        checkmarkStyle={checkmarkStyle}
        description={description}
        frequency={frequency}
        icon={icon}
        iconColor={iconColor}
        isImported={isImported}
        isImporting={isImporting}
        isLocked={isLocked}
        isPremium={isPremium}
        name={name}
        popularityScore={popularityScore}
        scientificLink={scientificLink}
        scientificReference={scientificReference}
        showPreviewCTA={showPreviewCTA}
        youtubeLink={youtubeLink}
        onImportPress={handleImportPress}
        onPreview={onPreview}
      />
    </AnimatedPressable>
  );

  if (enableScrollReveal) {
    return (
      <Animated.View entering={scrollRevealAnimation}>
        {cardContent}
      </Animated.View>
    );
  }
  return cardContent;
}

export default TemplateCard;
