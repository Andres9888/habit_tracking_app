/**
 * Entrance Animation Types
 * Type definitions for habit card entrance animations
 */

import type { useAnimatedStyle, SharedValue } from 'react-native-reanimated';

/**
 * Available animation variants for habit card entrance.
 */
export type HabitCardEntranceVariant =
  | 'fadeUp'
  | 'accentSlideDown'
  | 'widthExpansion'
  | 'none';

export interface UseHabitCardEntranceOptions {
  variant?: HabitCardEntranceVariant;
  delay?: number;
  onAnimationComplete?: () => void;
  autoTrigger?: boolean;
}

export interface HabitCardEntranceStyles {
  cardStyle: ReturnType<typeof useAnimatedStyle>;
  accentStyle: ReturnType<typeof useAnimatedStyle>;
  contentStyle: ReturnType<typeof useAnimatedStyle>;
}

export interface UseHabitCardEntranceReturn extends HabitCardEntranceStyles {
  triggerEntrance: () => void;
  resetAnimation: () => void;
  isAnimating: SharedValue<boolean>;
}

export interface EntranceAnimationValues {
  cardOpacity: SharedValue<number>;
  cardTranslateY: SharedValue<number>;
  accentScaleY: SharedValue<number>;
  accentWidth: SharedValue<number>;
  accentOpacity: SharedValue<number>;
  contentOpacity: SharedValue<number>;
  contentTranslateX: SharedValue<number>;
  isAnimating: SharedValue<boolean>;
}

export interface UseEntranceHandlersOptions {
  delay: number;
  onAnimationComplete?: () => void;
  reduceMotion: boolean;
  values: EntranceAnimationValues;
  variant: HabitCardEntranceVariant;
}

export interface UseEntranceHandlersReturn {
  resetAnimation: () => void;
  setInstantVisible: () => void;
  triggerEntrance: () => void;
}
