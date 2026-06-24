/** WeeklyCompletionRing — small weekly-consistency ring for the profile hero */
import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { durations } from '@/theme/animations';
import { useThemeColors } from '../../theme/ThemeContext';
import { typography, fontWeights } from '../../theme/typography';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface WeeklyCompletionRingProps {
  /** Completion rate 0–100. */
  rate: number;
  size?: number;
  strokeWidth?: number;
}

export function WeeklyCompletionRing({
  rate,
  size = 48,
  strokeWidth = 5,
}: WeeklyCompletionRingProps) {
  const { colors: themeColors } = useThemeColors();
  const reduceMotion = useReducedMotion();
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const clamped = Math.max(0, Math.min(100, Math.round(rate)));
  const progress = useSharedValue(reduceMotion ? clamped : 0);

  useEffect(() => {
    progress.value = reduceMotion
      ? clamped
      : withTiming(clamped, { duration: durations.progress });
  }, [clamped, reduceMotion, progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value / 100),
  }));

  return (
    <View className='items-center' style={{ gap: 3 }}>
      <View style={{ width: size, height: size }}>
        <Svg height={size} width={size}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            fill='none'
            r={radius}
            stroke={themeColors.primary[100]}
            strokeWidth={strokeWidth}
          />
          <AnimatedCircle
            animatedProps={animatedProps}
            cx={size / 2}
            cy={size / 2}
            fill='none'
            origin={`${size / 2}, ${size / 2}`}
            r={radius}
            rotation={-90}
            stroke={themeColors.primary[600]}
            strokeDasharray={circumference}
            strokeLinecap='round'
            strokeWidth={strokeWidth}
          />
        </Svg>
        <View
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              ...typography.caption,
              fontSize: 12.5,
              fontWeight: fontWeights.bold,
              color: themeColors.text.primary,
            }}
          >
            {clamped}%
          </Text>
        </View>
      </View>
      <Text
        style={{
          ...typography.caption,
          fontSize: 11,
          color: themeColors.text.secondary,
        }}
      >
        this week
      </Text>
    </View>
  );
}
