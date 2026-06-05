import { Animated, type ViewStyle } from 'react-native';
import Reanimated from 'react-native-reanimated';
import { useAnimatedTier } from '@/hooks/useAnimatedTier';

import type { HabitDayToggleProps } from './types';
import { useHabitDayToggleAnimations } from './useHabitDayToggleAnimations';
import { useHabitDayToggleHandlers } from './useHabitDayToggleHandlers';
import { useHabitDayToggleTierStyles } from './useHabitDayToggleTierStyles';
import * as toggleStyles from './habitDayToggleStyles';
import { HabitDayToggleContent } from './HabitDayToggleContent';
import { HabitDayTogglePressable } from './HabitDayTogglePressable';
import { getMaterialTier } from './materialTier';

const MISSED_BG = '#FEF2F2';
const MISSED_BORDER = '#DC2626';

export function HabitDayToggle({
  accentColor,
  accessibilityHint,
  accessibilityLabel,
  completionIcon,
  completed,
  enableTodayPulse = true,
  strengthPercent,
  disabled,
  highContrastMode,
  isToday,
  missed = false,
  onPress,
  shape,
}: HabitDayToggleProps) {
  const { completion, buttonScale, combinedScale } =
    useHabitDayToggleAnimations({
      completed,
      isToday: enableTodayPulse && isToday,
    });
  const { handlePressIn, handlePressOut, handlePress } =
    useHabitDayToggleHandlers({ buttonScale, completed, onPress });

  const strength = strengthPercent ?? 0;
  const tier = getMaterialTier(strength);
  const tierAnim = useAnimatedTier(strength);
  const borderRadius = shape === 'circle' ? 22 : 10;
  const tierBackground = toggleStyles.getBackgroundColor(
    completed,
    accentColor,
    highContrastMode,
    tier
  );
  const tierBorder = toggleStyles.getBorderColor(
    completed,
    isToday,
    accentColor,
    highContrastMode,
    tier
  );
  const staticBackground = missed ? MISSED_BG : tierBackground;
  const staticBorder = missed ? MISSED_BORDER : tierBorder;
  const borderWidth = missed || !completed || tier.name === 'legendary' ? 2 : 0;
  const showCompletedShadow = completed && !missed && !highContrastMode;

  const { cellStyle, shadowStyle } = useHabitDayToggleTierStyles({
    tierAnim,
    accentColor,
    completed,
    missed,
    isToday,
    showCompletedShadow,
    staticBackground,
    staticBorder,
  });

  const outerFrame: ViewStyle = {
    borderRadius,
    borderStyle: missed ? 'dashed' : 'solid',
    borderWidth,
    height: 44,
    width: 44,
  };

  return (
    <Animated.View
      style={isToday ? toggleStyles.getTodayGlowStyle(borderRadius) : undefined}
    >
      <Reanimated.View style={[outerFrame, cellStyle, shadowStyle]}>
        <HabitDayTogglePressable
          accessibilityHint={accessibilityHint}
          accessibilityLabel={accessibilityLabel}
          borderRadius={borderRadius}
          combinedScale={combinedScale}
          disabled={disabled}
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <HabitDayToggleContent
            completed={completed}
            missed={missed}
            completion={completion}
            completionIcon={completionIcon}
            iconColor={tier.iconColor}
          />
        </HabitDayTogglePressable>
      </Reanimated.View>
    </Animated.View>
  );
}
