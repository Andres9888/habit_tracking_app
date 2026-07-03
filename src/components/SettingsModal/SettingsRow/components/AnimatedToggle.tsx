/** AnimatedToggle — Reanimated switch (calm eased slide by default; spring travel + thumb stretch for the Streak Reminders exception) */
import { Pressable } from 'react-native';
import { Check } from 'lucide-react-native';
import Animated, { interpolateColor, useAnimatedStyle } from 'react-native-reanimated';
import { useSettingsScale } from '../../useSettingsScale';
import { useAnimatedToggleMotion, type ToggleVariant } from './useAnimatedToggleMotion';

const PAD = 2;

interface Props {
  value: boolean;
  onValueChange: (v: boolean) => void;
  label: string;
  trackOff: string;
  trackOn: string;
  thumb: string;
  /** 'calm' (default): eased slide + check glyph. 'spring': playful spring travel + thumb stretch — Streak Reminders row only. */
  variant?: ToggleVariant;
}

export function AnimatedToggle({
  value,
  onValueChange,
  label,
  trackOff,
  trackOn,
  thumb,
  variant = 'calm',
}: Props) {
  const k = useSettingsScale();
  const W = k(48);
  const H = k(28);
  const THUMB = H - PAD * 2;
  const TRAVEL = W - THUMB - PAD * 2;
  const { p, knob, check } = useAnimatedToggleMotion(value, variant, TRAVEL);
  const track = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(p.value, [0, 1], [trackOff, trackOn]),
  }));

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole='switch'
      accessibilityState={{ checked: value }}
      hitSlop={8}
      onPress={() => onValueChange(!value)}
    >
      <Animated.View
        style={[
          { width: W, height: H, borderRadius: H / 2, padding: PAD },
          track,
        ]}
      >
        <Animated.View
          style={[
            {
              width: THUMB,
              height: THUMB,
              borderRadius: THUMB / 2,
              backgroundColor: thumb,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#000',
              shadowOpacity: 0.25,
              shadowRadius: 2,
              shadowOffset: { width: 0, height: 1 },
              elevation: 2,
            },
            knob,
          ]}
        >
          <Animated.View style={check}>
            <Check color={trackOn} size={Math.max(10, k(11))} strokeWidth={3} />
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}
