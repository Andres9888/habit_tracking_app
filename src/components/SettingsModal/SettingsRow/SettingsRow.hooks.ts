import { absoluteFillObject } from '@/theme/absoluteFillObject';
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
    ...absoluteFillObject,
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
