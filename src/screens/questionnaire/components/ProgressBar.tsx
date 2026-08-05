/**
 * ProgressBar - Animated horizontal bar showing questionnaire progress.
 *
 * Renders a 4px track with an animated fill representing
 * the user's position in the 13-screen onboarding flow.
 */

import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { durations } from '@/theme/animations';
import { useThemeColors } from '@/theme/ThemeContext';

export interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const { colors } = useThemeColors();

  const progress = useSharedValue(0);

  useEffect(() => {
    const target = total > 0 ? Math.min(current / total, 1) : 0;
    progress.value = withTiming(target, { duration: durations.enter });
  }, [current, total, progress]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <View
      accessible
      accessibilityLabel={`Step ${current} of ${total}`}
      accessibilityRole="progressbar"
      accessibilityValue={{ max: total, min: 0, now: current }}
      className="mx-6"
    >
      <View
        className="h-1 w-full overflow-hidden rounded-full"
        style={{ backgroundColor: colors.border }}
      >
        <Animated.View
          className="h-full rounded-full"
          style={[
            { backgroundColor: colors.primary[600] },
            fillStyle,
          ]}
        />
      </View>
    </View>
  );
}
