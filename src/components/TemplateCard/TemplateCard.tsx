import React from 'react';
import { useReduceMotion } from '../../hooks/useReduceMotion';
import {
  useTemplateCardAnimations,
  useTemplateCardCallbacks,
  useTemplateCardHandlers,
} from './hooks';
import type { TemplateCardProps } from './TemplateCard.types';
import { getTemplateCardState } from './TemplateCard.helpers';
import { TemplateCardRender } from './TemplateCardRender';

export function TemplateCard(props: TemplateCardProps) {
  const {
    animationIndex = 0,
    isImported = false,
    onImport,
    onPreview,
    onUpgrade,
  } = props;

  const reducedMotion = useReduceMotion();
  const { isLocked, iconColor } = getTemplateCardState(props);

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

  return (
    <TemplateCardRender
      {...props}
      checkmarkStyle={checkmarkStyle}
      containerStyle={containerStyle}
      glowStyle={glowStyle}
      handleCardPress={handleCardPress}
      handleImportPress={handleImportPress}
      handlePressIn={handlePressIn}
      handlePressOut={handlePressOut}
      iconColor={iconColor}
      isLocked={isLocked}
      reducedMotion={reducedMotion}
      shadowStyle={shadowStyle}
    />
  );
}
