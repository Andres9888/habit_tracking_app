/** Path-to-best SVG ring around the streak centerpiece (OD mock). */
import { useEffect, type ReactNode } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { useThemeColors } from '../../../theme';
import { useReduceMotion } from '../../../hooks/useReduceMotion';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const SIZE = 152;
const STROKE = 8;
const R = (SIZE - STROKE) / 2;
const C = 2 * Math.PI * R;
const CENTER = SIZE / 2;

interface DetailHeroPathRingProps {
  bestStreak: number;
  children: ReactNode;
  currentStreak: number;
  glow?: boolean;
}

export function DetailHeroPathRing({
  bestStreak,
  children,
  currentStreak,
  glow = false,
}: DetailHeroPathRingProps) {
  const { colors } = useThemeColors();
  const reduceMotion = useReduceMotion();
  const target = Math.max(bestStreak, 1);
  const pct = Math.min(currentStreak / target, 1);
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(pct, {
      duration: reduceMotion ? 0 : 700,
    });
  }, [pct, progress, reduceMotion]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: C * (1 - progress.value),
  }));

  return (
    <View
      accessibilityLabel={`Streak ${currentStreak} days, personal best ${bestStreak}`}
      className='items-center justify-center'
      style={{ height: SIZE, width: SIZE }}
    >
      <Svg
        height={SIZE}
        style={{ position: 'absolute' }}
        width={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
      >
        <Circle
          cx={CENTER}
          cy={CENTER}
          fill='none'
          r={R}
          stroke={colors.border}
          strokeWidth={STROKE}
        />
        <AnimatedCircle
          animatedProps={animatedProps}
          cx={CENTER}
          cy={CENTER}
          fill='none'
          origin={`${CENTER}, ${CENTER}`}
          r={R}
          rotation='-90'
          stroke={colors.status.streak}
          strokeDasharray={C}
          strokeLinecap='round'
          strokeWidth={STROKE}
          // Soft glow when complete lands (OD ring glow)
          opacity={glow ? 1 : 0.95}
        />
      </Svg>
      <View className='items-center justify-center' style={{ zIndex: 1 }}>
        {children}
      </View>
    </View>
  );
}
