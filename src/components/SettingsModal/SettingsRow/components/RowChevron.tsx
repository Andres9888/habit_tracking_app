import { ChevronRight } from 'lucide-react-native';
import { useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { iconSizes } from '@/theme/iconSizes';
import { durations, enterEasing } from '@/theme/animations';

interface RowChevronProps {
  color: string;
  /** Rotates to point down while an inline picker is open. */
  expanded?: boolean;
}

export function RowChevron({ color, expanded }: RowChevronProps) {
  const reduceMotion = useReducedMotion();
  const progress = useSharedValue(expanded ? 1 : 0);

  useEffect(() => {
    const next = expanded ? 1 : 0;
    progress.value = reduceMotion
      ? next
      : withTiming(next, {
          duration: durations.standard,
          easing: enterEasing,
        });
  }, [expanded, progress, reduceMotion]);

  const style = useAnimatedStyle(() => ({
    transform: [{ rotate: `${progress.value * 90}deg` }],
  }));

  // Static rows skip the Animated wrapper entirely — navigation chevrons never
  // rotate, and this is the most-rendered node in Settings.
  if (expanded === undefined) {
    return <ChevronRight color={color} size={iconSizes.small} strokeWidth={2} />;
  }

  return (
    <Animated.View style={style}>
      <ChevronRight color={color} size={iconSizes.small} strokeWidth={2} />
    </Animated.View>
  );
}
