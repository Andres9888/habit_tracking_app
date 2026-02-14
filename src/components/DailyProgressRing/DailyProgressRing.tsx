/**
 * DailyProgressRing — Circular progress indicator for daily habit completion.
 *
 * Shows completed/total as an animated SVG ring with percentage text.
 * Design system: primary fill, theme-aware track, springify().damping(18).
 * Dark mode aware — adapts track, stroke, and text to current theme.
 * Celebrates 100% completion with a golden glow effect.
 */

import { memo, useEffect } from 'react';
import { View, Text, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  FadeIn,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { useThemeColors } from '../../theme/ThemeContext';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const FONT_FAMILY = Platform.OS === 'ios' ? 'System' : 'Roboto';

/** Ring colors per theme */
const RING_COLORS = {
  light: {
    track: '#DDD8D2',
    stroke: '#059669',
    text: '#047857',
    completedStroke: '#D97706',
    completedText: '#B45309',
  },
  dark: {
    track: '#374151',
    stroke: '#34D399',
    text: '#6EE7B7',
    completedStroke: '#FBBF24',
    completedText: '#FCD34D',
  },
} as const;

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
  const celebrationScale = useSharedValue(1);
  const { isDark } = useThemeColors();

  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const isComplete = total > 0 && completed >= total;
  const palette = isDark ? RING_COLORS.dark : RING_COLORS.light;

  useEffect(() => {
    const target = total > 0 ? completed / total : 0;
    progress.value = withSpring(target, { damping: 18 });

    // Celebrate when hitting 100%
    if (total > 0 && completed >= total) {
      celebrationScale.value = withSequence(
        withSpring(1.12, { damping: 8, stiffness: 300 }),
        withSpring(1, { damping: 12 })
      );
    }
  }, [completed, total, progress, celebrationScale]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value),
  }));

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: celebrationScale.value }],
  }));

  return (
    <Animated.View entering={FadeIn.duration(280).springify().damping(18)}>
      <Animated.View
        style={[
          {
            alignItems: 'center',
            height: size,
            justifyContent: 'center',
            width: size,
          },
          containerAnimatedStyle,
        ]}
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
            stroke={palette.track}
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
            stroke={isComplete ? palette.completedStroke : palette.stroke}
            strokeDasharray={circumference}
            strokeLinecap="round"
            strokeWidth={strokeWidth}
          />
        </Svg>
        <Text
          style={{
            color: isComplete ? palette.completedText : palette.text,
            fontFamily: FONT_FAMILY,
            fontSize: 13,
            fontWeight: '700',
            letterSpacing: -0.3,
          }}
        >
          {isComplete ? '✓' : `${percentage}%`}
        </Text>
      </Animated.View>
    </Animated.View>
  );
}

export const DailyProgressRing = memo(DailyProgressRingComponent);
export default DailyProgressRing;
