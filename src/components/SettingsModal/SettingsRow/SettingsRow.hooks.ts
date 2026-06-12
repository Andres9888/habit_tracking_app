import { StyleSheet } from 'react-native';
import {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
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

export function useSettingsRowHandlers(
  props: Pick<SettingsRowProps, 'hapticStyle' | 'onPress' | 'onToggle'>,
  triggerPulse: () => void
) {
  const handleToggle = (v: boolean) => {
    void Haptics.impactAsync(
      v ? Haptics.ImpactFeedbackStyle.Medium : Haptics.ImpactFeedbackStyle.Light
    );
    triggerPulse();
    props.onToggle?.(v);
  };

  const handleNavPress = () => {
    const style = props.hapticStyle ?? 'light';
    if (style === 'selection') {
      void Haptics.selectionAsync();
    } else {
      const map = {
        light: Haptics.ImpactFeedbackStyle.Light,
        medium: Haptics.ImpactFeedbackStyle.Medium,
        heavy: Haptics.ImpactFeedbackStyle.Heavy,
      } as const;
      void Haptics.impactAsync(map[style]);
    }
    props.onPress?.();
  };

  return { handleNavPress, handleToggle };
}
