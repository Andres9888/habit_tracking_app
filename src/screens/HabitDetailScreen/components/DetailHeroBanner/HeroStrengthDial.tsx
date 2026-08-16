/**
 * HeroStrengthDial — 120px strength ring on the hero wash.
 *
 * WHY THIS ISN'T `components/StrengthRing`: the shared ring renders its centre
 * through `RingCenter`, which is built around emoji / percentage / trend-arrow.
 * The design needs a serif numeral with an uppercase level word stacked under it,
 * and the arc has to take the band's colours (the shared ring derives arc colour
 * from `getLevelInfo` and hardcodes its track). Reworking `RingCenter` would
 * touch habit cards and the progress section, so this keeps its own markup —
 * but it now shares `useStrengthRingAnimation`, so the fill animates like every
 * other ring in the app rather than snapping in.
 *
 * Arc colour carries the day's state: burnished gold while today is open,
 * success green once it's logged.
 */
import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { useStrengthRingAnimation } from '../../../../components/StrengthRing/useStrengthRingAnimation';
import { useReduceMotion } from '../../../../hooks/useReduceMotion';
import { HeroDialCenter } from './HeroDialCenter';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const SIZE = 120;
const RADIUS = 49;
const STROKE = 8.5;
const CENTER = SIZE / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface HeroStrengthDialProps {
  /** 0-100. */
  strengthPercent: number;
  /** Short level word shown under the score ("Steady", "Strong"). */
  levelLabel: string;
  arcColor: string;
  trackColor: string;
  textColor: string;
  mutedColor: string;
}

export function HeroStrengthDial({
  arcColor,
  levelLabel,
  mutedColor,
  strengthPercent,
  textColor,
  trackColor,
}: HeroStrengthDialProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(strengthPercent)));
  const reduceMotion = useReduceMotion();
  const { animatedProps } = useStrengthRingAnimation({
    circumference: CIRCUMFERENCE,
    levelLabel,
    strength: clamped,
  });
  const staticOffset = CIRCUMFERENCE * (1 - clamped / 100);

  return (
    <View
      accessibilityLabel={`Habit strength ${clamped} percent, ${levelLabel}`}
      accessibilityRole='progressbar'
      accessibilityValue={{ max: 100, min: 0, now: clamped }}
      style={{ flex: 0, height: SIZE, position: 'relative', width: SIZE }}
    >
      <Svg height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} width={SIZE}>
        <Circle
          cx={CENTER}
          cy={CENTER}
          fill='none'
          r={RADIUS}
          stroke={trackColor}
          strokeWidth={STROKE}
        />
        <AnimatedCircle
          animatedProps={reduceMotion ? undefined : animatedProps}
          cx={CENTER}
          cy={CENTER}
          fill='none'
          origin={`${CENTER}, ${CENTER}`}
          r={RADIUS}
          rotation='-90'
          stroke={arcColor}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={reduceMotion ? staticOffset : CIRCUMFERENCE}
          strokeLinecap='round'
          strokeWidth={STROKE}
        />
      </Svg>
      <HeroDialCenter
        levelLabel={levelLabel}
        mutedColor={mutedColor}
        score={clamped}
        textColor={textColor}
      />
    </View>
  );
}
