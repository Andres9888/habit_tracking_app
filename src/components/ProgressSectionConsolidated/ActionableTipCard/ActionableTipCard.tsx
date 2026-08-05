/**
 * ActionableTipCard Component
 *
 * CTA section with personalized actionable tip.
 * Uses violet/indigo gradient for visual appeal.
 *
 * @see docs/specs/habit-details-screen/progress-consolidated-redesign.md
 * @see docs/specs/habit-details-screen/progress-tab-improvements-spec.md
 */

import React, { useState, useCallback, useMemo } from 'react';
import { Pressable } from 'react-native';
import Animated from 'react-native-reanimated';

import { useHapticFeedback } from '../../../hooks/useHapticFeedback';
import type { ActionableTipCardProps } from '../types';
import { TipQuickActionsSheet } from '../TipQuickActionsSheet';
import { determineTipTypeFromText } from '../TipQuickActionsSheet/determineTipTypeFromText';
import type { QuickAction } from '../TipQuickActionsSheet/types';
import { useTipAnimations } from './useTipAnimations';
import { TipCardContent } from './TipCardContent';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const ActionableTipCard = React.memo(function ActionableTipCard({
  tip,
  subtitle,
  currentStreak = 0,
  onPress,
  onQuickAction,
}: ActionableTipCardProps) {
  const { triggerLightImpact } = useHapticFeedback();
  const [isSheetVisible, setIsSheetVisible] = useState(false);

  const { tipType, focusDayName } = useMemo(
    () => determineTipTypeFromText(tip, currentStreak),
    [tip, currentStreak]
  );

  const { containerStyle, handlePressIn, handlePressOut } = useTipAnimations();

  const handlePress = useCallback(() => {
    triggerLightImpact();
    if (onQuickAction) {
      setIsSheetVisible(true);
    }
    onPress?.();
  }, [triggerLightImpact, onQuickAction, onPress]);

  const handleSheetClose = useCallback(() => {
    setIsSheetVisible(false);
  }, []);

  const handleQuickAction = useCallback(
    (action: QuickAction) => {
      onQuickAction?.(action);
    },
    [onQuickAction]
  );

  const isInteractive = !!onPress || !!onQuickAction;
  const accessibilityLabel = subtitle
    ? `Tip: ${tip}. ${subtitle}`
    : `Tip: ${tip}`;
  const accessibilityHint = isInteractive
    ? onQuickAction
      ? 'Double tap to view quick actions'
      : 'Double tap to open this tip'
    : undefined;

  return (
    <>
      <AnimatedPressable
        accessibilityHint={accessibilityHint}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole={isInteractive ? 'button' : 'text'}
        disabled={!isInteractive}
        style={containerStyle}
        testID='actionable-tip-card'
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <TipCardContent
          isInteractive={isInteractive}
          subtitle={subtitle}
          tip={tip}
        />
      </AnimatedPressable>

      {onQuickAction ? <TipQuickActionsSheet
          currentStreak={currentStreak}
          focusDayName={focusDayName}
          tipText={tip}
          tipType={tipType}
          visible={isSheetVisible}
          onActionPress={handleQuickAction}
          onClose={handleSheetClose}
        /> : null}
    </>
  );
});

export default ActionableTipCard;
