/**
 * MiniTemplateCard Component
 * Compact template card for horizontal scrolling previews within category sections
 */
import React from 'react';

import { useReduceMotion } from '../../hooks/useReduceMotion';
import { DEFAULT_ICON_COLOR } from './constants';
import { MiniCardContainer } from './MiniCardContainer';
import type { MiniTemplateCardProps } from './MiniTemplateCard.types';
import {
  useCheckmarkStyle,
  useChevronStyle,
  useGlowStyle,
  useImportButtonStyle,
  useScienceBadgeStyle,
} from './useAnimatedStyles';
import {
  useAnimatedCardStyle,
  useMiniTemplateCardAnimations,
} from './useMiniTemplateCardAnimations';
import { createImportHandler, createPressHandlers } from './usePressHandlers';

export const MiniTemplateCard = React.memo(function MiniTemplateCard(props: MiniTemplateCardProps) {
  const {
    description = '',
    hasResearch,
    icon = '📝',
    iconColor: iconColorProp,
    isImported,
    isImporting,
    name = 'Untitled',
    onImport,
    onPress,
  } = props;

  const reducedMotion = useReduceMotion();
  const iconColor =
    iconColorProp && typeof iconColorProp === 'string' && iconColorProp.trim() !== ''
      ? iconColorProp
      : DEFAULT_ICON_COLOR;

  const animations = useMiniTemplateCardAnimations({
    hasImportHandler: !!onImport,
    hasResearch,
    isImported,
    isImporting,
    reducedMotion,
  });

  const animatedCardStyle = useAnimatedCardStyle(
    animations.shadowElevation,
    animations.pressScale,
    animations.pressRotation
  );
  const importButtonStyle = useImportButtonStyle(animations.buttonPulse);
  const checkmarkStyle = useCheckmarkStyle(animations.checkmarkScale);
  const glowStyle = useGlowStyle(animations.successGlow);
  const chevronStyle = useChevronStyle(animations.chevronTranslate);
  const scienceBadgeStyle = useScienceBadgeStyle(animations.scienceBadgePulse);

  const { handlePressIn, handlePressOut, handlePress } = createPressHandlers(
    animations,
    reducedMotion,
    onPress
  );
  const handleImport = createImportHandler(isImporting, isImported, onImport);

  return (
    <MiniCardContainer
      animatedCardStyle={animatedCardStyle}
      checkmarkStyle={checkmarkStyle}
      chevronStyle={chevronStyle}
      description={description}
      glowStyle={glowStyle}
      hasResearch={hasResearch}
      icon={icon}
      iconColor={iconColor}
      importButtonStyle={importButtonStyle}
      isImported={isImported}
      isImporting={isImporting}
      name={name}
      scienceBadgeStyle={scienceBadgeStyle}
      onImport={onImport ? handleImport : undefined}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    />
  );
});

export default MiniTemplateCard;
