import { StyleSheet } from 'react-native';
import {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { triggerHaptic } from '@/utils/haptics';
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

export function useSettingsRowWash(isDark: boolean) {
  const washOpacity = useSharedValue(0);
  const washColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(45,42,38,0.05)';
  const washStyle = useAnimatedStyle(() => ({
    ...StyleSheet.absoluteFillObject,
    backgroundColor: washColor,
    opacity: washOpacity.value,
  }));

  const handlePressIn = () => {
    washOpacity.value = withTiming(1, { duration: 180 });
  };
  const handlePressOut = () => {
    washOpacity.value = withTiming(0, { duration: 180 });
  };

  return { washStyle, handlePressIn, handlePressOut };
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
