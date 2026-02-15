/**
 * DailyProgressRing — Circular progress indicator for daily habit completion.
 *
 * Shows completed/total as an animated SVG ring with percentage text.
 * Design system: #059669 fill, #e7e5e4 track, springify().damping(18).
 */

import { View, Text, Platform } from 'react-native';
import { memo, useEffect } from 'react';

import Animated, {
  useSharedValue,
  useAnimatedProps,
  withSpring,
  FadeIn,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const FONT_FAMILY = Platform.OS === 'ios' ? 'System' : 'Roboto';

interface DailyProgressRingProps {
  /** Number of habits completed today */
  completed: number;
  /** Total number of habits */
  total: number;
  /** Ring size in pixels (default 64) */
  size?: number;
  /** Stroke width (default 6) */
  strokeWidth?: number;
}

function DailyProgressRingComponent({
  completed,
  total,
  size = 64,
  strokeWidth = 6,
}: DailyProgressRingProps): React.ReactElement {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = useSharedValue(0);

  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  useEffect(() => {
    const target = total > 0 ? completed / total : 0;
    progress.value = withSpring(target, { damping: 18 });
  }, [completed, total, progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value),
  }));

  return (
    <Animated.View entering={FadeIn.duration(280).springify().damping(18)}>
      <View
        style={{ alignItems: 'center', height: size, justifyContent: 'center', width: size }}
      >
        <Svg
          height={size}
          style={{ position: 'absolute' }}
          width={size}
        >
          {/* Track */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            fill="none"
            r={radius}
            stroke="#e7e5e4"
            strokeWidth={strokeWidth}
          />
          {/* Progress */}
          <AnimatedCircle
            animatedProps={animatedProps}
            cx={size / 2}
            cy={size / 2}
            fill="none"
            origin={`${size / 2}, ${size / 2}`}
            r={radius}
            rotation="-90"
            stroke="#059669"
            strokeDasharray={circumference}
            strokeLinecap="round"
            strokeWidth={strokeWidth}
          />
        </Svg>
        <Text
          style={{
            color: '#047857',
            fontFamily: FONT_FAMILY,
            fontSize: 13,
            fontWeight: '700',
            letterSpacing: -0.3,
          }}
        >
          {percentage}%
        </Text>
      </View>
    </Animated.View>
  );
}

export const DailyProgressRing = memo(DailyProgressRingComponent);
export default DailyProgressRing;
