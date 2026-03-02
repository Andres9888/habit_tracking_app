import { useEffect } from 'react';
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

interface UseTodayGlowParams {
  isCurrentDay: boolean;
  isComplete: boolean;
  reduceMotion: boolean;
  isDark: boolean;
}

const GLOW_MIN = 0.15;
const GLOW_MAX = 0.4;
const HALF_CYCLE_MS = 1250;
const SHADOW_RADIUS = 8;

const SHADOW_COLOR_LIGHT = '#E8B94D';
const SHADOW_COLOR_DARK = '#B8860B';

const SHADOW_OFFSET = { width: 0, height: 0 };

/**
 * Returns an animated shadow style that "breathes" on today's
 * incomplete day cell. No-ops when complete, not today, or reduceMotion.
 */
export function useTodayGlow({
  isCurrentDay,
  isComplete,
  reduceMotion,
  isDark,
}: UseTodayGlowParams) {
  const active = isCurrentDay && !isComplete && !reduceMotion;
  const shadowOpacity = useSharedValue(active ? GLOW_MIN : 0);
  const shadowColor = isDark ? SHADOW_COLOR_DARK : SHADOW_COLOR_LIGHT;

  useEffect(() => {
    if (!active) {
      shadowOpacity.value = 0;
      return;
    }

    shadowOpacity.value = withRepeat(
      withSequence(
        withTiming(GLOW_MAX, {
          duration: HALF_CYCLE_MS,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(GLOW_MIN, {
          duration: HALF_CYCLE_MS,
          easing: Easing.inOut(Easing.ease),
        }),
      ),
      -1,
    );
  }, [active, shadowOpacity]);

  return useAnimatedStyle(() => {
    if (shadowOpacity.value <= 0) return {};

    return {
      elevation: 4,
      shadowColor,
      shadowOffset: SHADOW_OFFSET,
      shadowOpacity: shadowOpacity.value,
      shadowRadius: SHADOW_RADIUS,
    };
  });
}
