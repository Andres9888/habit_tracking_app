import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { useThemeColors } from '../../../theme/ThemeContext';
import { durations } from '@/theme/animations';

interface MicroProgressBarProps {
  completed: number;
  total: number;
}

const BAR_HEIGHT = 3;
const FILL_DURATION = durations.complex;
const BORDER_RADIUS = 1.5;

/** Thin progress bar showing weekly completion ratio */
export function MicroProgressBar({ completed, total }: MicroProgressBarProps) {
  const { colors, isDark } = useThemeColors();
  const reduceMotion = useReducedMotion();
  const progress = useSharedValue(0);

  const targetPercent = total > 0 ? Math.min(completed / total, 1) * 100 : 0;

  useEffect(() => {
    progress.value = reduceMotion
      ? targetPercent
      : withTiming(targetPercent, { duration: FILL_DURATION });
  }, [targetPercent, reduceMotion, progress]);

  const trackColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

  const isComplete = completed >= total && total > 0;
  const fillColor = isComplete ? colors.primary[400] : colors.primary[500];

  const fillStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
  }));

  if (total === 0) return null;

  return (
    <View
      accessibilityLabel={`${completed} of ${total} completed`}
      accessibilityRole='progressbar'
      style={{
        backgroundColor: trackColor,
        borderRadius: BORDER_RADIUS,
        height: BAR_HEIGHT,
        marginTop: 6,
        overflow: 'hidden',
      }}
    >
      <Animated.View
        style={[
          {
            backgroundColor: fillColor,
            borderRadius: BORDER_RADIUS,
            height: BAR_HEIGHT,
          },
          fillStyle,
        ]}
      />
    </View>
  );
}
