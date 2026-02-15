/**
 * DailyProgressRing — Circular progress indicator for daily habit completion.
 *
 * Shows completed/total as an animated SVG ring with percentage text.
 * Design system: #059669 fill, theme-aware track, springify().damping(18).
 */

import { memo, useEffect } from 'react';
import { View, Text, Platform } from 'react-native';
import { useThemeColors } from '../../theme/ThemeContext';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  withSpring,
  withSequence,
  FadeIn,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { useThemeColors } from '../../theme/ThemeContext';

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
<<<<<<< HEAD
  const { colors: themeColors } = useThemeColors();
=======
  const { colors, isDark } = useThemeColors();
>>>>>>> 618ea1d3 (ui: polish home screen widgets — dark mode, consistent cards, animations)
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = useSharedValue(0);
  const ringScale = useSharedValue(1);

  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  useEffect(() => {
    const target = total > 0 ? completed / total : 0;
    // Spring-physics fill with design system values
    progress.value = withSpring(target, { damping: 18, stiffness: 150 });

    // Subtle scale pulse when progress changes (premium micro-interaction)
    if (target > 0) {
      ringScale.value = withSequence(
        withSpring(1.04, { damping: 12, stiffness: 200 }),
        withSpring(1, { damping: 18, stiffness: 150 })
      );
    }
  }, [completed, total, progress, ringScale]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value),
  }));

<<<<<<< HEAD
  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
  }));
=======
  const trackColor = isDark ? colors.gray[300] : '#e7e5e4';
  const progressColor = isDark ? '#34D399' : '#059669';
  const textColor = isDark ? '#6EE7B7' : '#047857';
>>>>>>> 618ea1d3 (ui: polish home screen widgets — dark mode, consistent cards, animations)

  return (
    <Animated.View
      entering={FadeIn.duration(280).springify().damping(18)}
      style={scaleStyle}
    >
      <View
        accessible
        accessibilityLabel={`${completed} of ${total} habits completed, ${percentage} percent`}
        accessibilityRole='progressbar'
        accessibilityValue={{ max: total, min: 0, now: completed }}
        style={{
          alignItems: 'center',
          height: size,
          justifyContent: 'center',
          width: size,
        }}
      >
        <Svg height={size} style={{ position: 'absolute' }} width={size}>
          {/* Track */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            fill='none'
            r={radius}
<<<<<<< HEAD
            stroke={themeColors.border ?? '#e7e5e4'}
=======
            stroke={trackColor}
>>>>>>> 618ea1d3 (ui: polish home screen widgets — dark mode, consistent cards, animations)
            strokeWidth={strokeWidth}
          />
          {/* Progress */}
          <AnimatedCircle
            animatedProps={animatedProps}
            cx={size / 2}
            cy={size / 2}
            fill='none'
            origin={`${size / 2}, ${size / 2}`}
            r={radius}
<<<<<<< HEAD
            rotation='-90'
            stroke={themeColors.primary?.[500] ?? '#059669'}
=======
            rotation="-90"
            stroke={progressColor}
>>>>>>> 618ea1d3 (ui: polish home screen widgets — dark mode, consistent cards, animations)
            strokeDasharray={circumference}
            strokeLinecap='round'
            strokeWidth={strokeWidth}
          />
        </Svg>
        <Text
          style={{
<<<<<<< HEAD
            color: themeColors.primary?.[700] ?? '#047857',
=======
            color: textColor,
>>>>>>> 618ea1d3 (ui: polish home screen widgets — dark mode, consistent cards, animations)
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
