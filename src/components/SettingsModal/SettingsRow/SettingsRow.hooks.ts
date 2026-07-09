import { useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import {
  interpolateColor,
  useReducedMotion,
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { triggerHaptic } from '@/utils/haptics';
import { useThemeColors } from '../../../theme/ThemeContext';
import type { SettingsRowProps } from './SettingsRow.types';

export function useSettingsRowPulse(isDark: boolean) {
  const pulseOpacity = useSharedValue(0);
  const pulseColor = isDark ? 'rgba(52,211,153,0.08)' : 'rgba(5,150,105,0.06)';
  const pulseStyle = useAnimatedStyle(() => ({
    ...StyleSheet.absoluteFillObject,
    backgroundColor: pulseColor,
    opacity: pulseOpacity.value,
  }));

  const triggerPulse = () => {
    pulseOpacity.value = withSequence(
      withTiming(1, { duration: 150 }),
      withTiming(0, { duration: 250 })
    );
  };

  return { pulseStyle, triggerPulse };
}

/**
 * Green tint flash behind a row's value text when it changes, confirming the
 * new setting at a glance. Skips the initial mount (and undefined→value
 * hydration) and is disabled entirely under reduced motion.
 */
export function useValueFlash(value: string | undefined) {
  const { isDark } = useThemeColors();
  const progress = useSharedValue(0);
  const prev = useRef(value);
  const reduceMotion = useReducedMotion() ?? false;

  useEffect(() => {
    if (prev.current === value) return;
    const hadValue = prev.current !== undefined;
    prev.current = value;
    if (!hadValue || reduceMotion) return;
    progress.value = withSequence(
      withTiming(1, { duration: 120 }),
      withTiming(0, { duration: 900 })
    );
  }, [value, reduceMotion, progress]);

  const tint = isDark ? 'rgba(52,211,153,0.22)' : 'rgba(5,150,105,0.12)';
  return useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      ['rgba(0,0,0,0)', tint]
    ),
  }));
}

export function useSettingsRowHandlers(
  props: Pick<SettingsRowProps, 'hapticStyle' | 'onPress' | 'onToggle'>,
  triggerPulse: () => void
) {
  const handleToggle = (v: boolean) => {
    void triggerHaptic(v ? 'toggle' : 'tap');
    triggerPulse();
    props.onToggle?.(v);
  };

  const handleNavPress = () => {
    const style = props.hapticStyle ?? 'light';
    const map = {
      selection: 'selection',
      light: 'tap',
      medium: 'toggle',
      heavy: 'heavy',
    } as const;
    void triggerHaptic(map[style]);
    props.onPress?.();
  };

  return { handleNavPress, handleToggle };
}
