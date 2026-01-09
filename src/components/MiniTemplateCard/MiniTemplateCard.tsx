/**
 * MiniTemplateCard Component
 * Compact template card for horizontal scrolling previews within category sections
 */

import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useReduceMotion } from '../../hooks/useReduceMotion';
import type { MiniTemplateCardProps } from './MiniTemplateCard.types';
import { styles } from './MiniTemplateCard.styles';
import { DEFAULT_ICON_COLOR, SUCCESS_COLOR } from './constants';
import {
  useMiniTemplateCardAnimations,
  useAnimatedCardStyle,
} from './useMiniTemplateCardAnimations';
import {
  useImportButtonStyle,
  useCheckmarkStyle,
  useGlowStyle,
  useChevronStyle,
  useScienceBadgeStyle,
} from './useAnimatedStyles';
import { createPressHandlers, createImportHandler } from './usePressHandlers';
import { CardHeader } from './CardHeader';
import { ImportButton } from './ImportButton';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function MiniTemplateCard(props: MiniTemplateCardProps) {
  const {
    icon,
    iconColor: iconColorProp,
    name,
    description,
    hasResearch,
    onPress,
    onImport,
    isImporting,
    isImported,
  } = props;
  const reducedMotion = useReduceMotion();
  const iconColor =
    iconColorProp && iconColorProp.trim() !== ''
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
    <AnimatedPressable
      accessible
      accessibilityLabel={`${name} template`}
      accessibilityRole='button'
      style={[
        styles.card,
        { backgroundColor: `${iconColor}08` },
        animatedCardStyle,
      ]}
      onPress={handlePress}
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
          styles.accent,
          { backgroundColor: isImported ? SUCCESS_COLOR : iconColor },
        ]}
      />
      <CardHeader
        chevronStyle={chevronStyle}
        hasResearch={hasResearch}
        icon={icon}
        iconColor={iconColor}
        scienceBadgeStyle={scienceBadgeStyle}
      />
      <Text numberOfLines={1} style={styles.name}>
        {name}
      </Text>
      {description && (
        <Text numberOfLines={2} style={styles.description}>
          {description}
        </Text>
      )}
      {onImport && (
        <ImportButton
          checkmarkStyle={checkmarkStyle}
          iconColor={iconColor}
          importButtonStyle={importButtonStyle}
          isImported={isImported}
          isImporting={isImporting}
          name={name}
          onImport={handleImport}
        />
      )}
    </AnimatedPressable>
  );
}

export default MiniTemplateCard;
