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
import { useSettingsScale } from './useSettingsScale';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const OVERLAY = {
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  alignItems: 'center',
  justifyContent: 'center',
} as const;

interface WeeklyCompletionRingProps {
  /** Completion rate 0–100. */
  rate: number;
  size?: number;
  strokeWidth?: number;
}

export function WeeklyCompletionRing({
  rate,
  size,
  strokeWidth = 4.5,
}: WeeklyCompletionRingProps) {
  const { colors: themeColors } = useThemeColors();
  const reduceMotion = useReducedMotion();
  const k = useSettingsScale();
  const ringSize = size ?? k(44);
  const radius = (ringSize - strokeWidth) / 2;
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
      <View style={{ width: ringSize, height: ringSize }}>
        <Svg height={ringSize} width={ringSize}>
          <Circle
            cx={ringSize / 2}
            cy={ringSize / 2}
            fill='none'
            r={radius}
            stroke={themeColors.primary[100]}
            strokeWidth={strokeWidth}
          />
          <AnimatedCircle
            animatedProps={animatedProps}
            cx={ringSize / 2}
            cy={ringSize / 2}
            fill='none'
            origin={`${ringSize / 2}, ${ringSize / 2}`}
            r={radius}
            rotation={-90}
            stroke={themeColors.primary[600]}
            strokeDasharray={circumference}
            strokeLinecap='round'
            strokeWidth={strokeWidth}
          />
        </Svg>
        <View style={OVERLAY}>
          <Text
            style={{
              ...typography.caption,
              fontSize: k(12.5),
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
          fontSize: k(11),
          color: themeColors.text.secondary,
        }}
      >
        this week
      </Text>
    </View>
  );
}
