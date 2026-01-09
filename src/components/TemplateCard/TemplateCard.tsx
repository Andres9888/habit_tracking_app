/**
 * TemplateCard Component
 *
 * Enhanced design with accent bar, color tint, and icon glow
 * Displays habit template with rich visual personality
 */
import React from 'react';

import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';

import { useReduceMotion } from '../../hooks/useReduceMotion';
import { CardContainer, TemplateCardContent } from './components';
import {
  useTemplateCardAnimations,
  useTemplateCardCallbacks,
  useTemplateCardHandlers,
} from './hooks';
import { DEFAULT_ICON_COLOR } from './TemplateCard.constants';
import type { TemplateCardProps } from './TemplateCard.types';

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
    <CardContainer
      containerStyle={containerStyle}
      description={description}
      glowStyle={glowStyle}
      iconColor={iconColor}
      isImported={isImported}
      isLocked={isLocked}
      name={name}
      shadowStyle={shadowStyle}
      style={style}
      onPress={handleCardPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
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
    </CardContainer>
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
