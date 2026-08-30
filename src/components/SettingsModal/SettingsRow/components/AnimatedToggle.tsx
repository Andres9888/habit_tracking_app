/** AnimatedToggle — Reanimated switch (spring travel + crossfade track) */
import { Pressable } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useReducedMotion,
  withSpring,
} from 'react-native-reanimated';
import { springs } from '@/theme/animations';

// Spec 4a toggle: 50×30 pill, 26px knob, 2px inset.
const W = 50;
const H = 30;
const PAD = 2;
const THUMB = H - PAD * 2;
const TRAVEL = W - THUMB - PAD * 2;

interface Props {
  value: boolean;
  onValueChange: (v: boolean) => void;
  label: string;
  trackOff: string;
  trackOn: string;
  thumb: string;
}

export function AnimatedToggle({
  value,
  onValueChange,
  label,
  trackOff,
  trackOn,
  thumb,
}: Props) {
  const reduce = useReducedMotion();
  const p = useDerivedValue(() =>
    reduce ? (value ? 1 : 0) : withSpring(value ? 1 : 0, springs.standard)
  );
  const track = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(p.value, [0, 1], [trackOff, trackOn]),
  }));
  const knob = useAnimatedStyle(() => ({
    transform: [{ translateX: p.value * TRAVEL }],
  }));
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole='switch'
      accessibilityState={{ checked: value }}
      accessibilityValue={{ text: value ? 'On' : 'Off' }}
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
              shadowColor: '#000',
              shadowOpacity: 0.25,
              shadowRadius: 2,
              shadowOffset: { width: 0, height: 1 },
              elevation: 2,
            },
            knob,
          ]}
        />
      </Animated.View>
    </Pressable>
  );
}
