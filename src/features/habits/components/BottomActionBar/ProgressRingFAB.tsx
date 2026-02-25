/**
 * ProgressRingFAB — SVG progress ring wrapping the center FAB button.
 *
 * Shows an emerald ring that fills as habits are completed today.
 * On all-done: glow shadow appears, + icon crossfades to ✓ with bounce.
 */

import { Pressable, Text, View } from 'react-native';
import Animated, {
  useAnimatedProps,
  type SharedValue,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { Plus, Check } from 'lucide-react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import {
  GLOW_SHADOW,
  RING_COLORS,
} from '../../../../components/CalendarTimeline/components/CompletionRing.helpers';
import {
  CIRCUMFERENCE,
  RADIUS,
  RING_SIZE,
  STROKE_WIDTH,
  fabRingStyles as s,
} from './ProgressRingFAB.styles';
import type { CelebrationAnimStyles } from './useBarAnimations';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const FAB_BORDER_LIGHT = 'rgba(245,241,237,0.9)';
const FAB_BORDER_DARK = 'rgba(17,24,39,0.9)';

interface ProgressRingFABProps {
  completedToday: number;
  totalHabits: number;
  isAllDone: boolean;
  justCompleted: boolean;
  progress: SharedValue<number>;
  celebrationAnim: CelebrationAnimStyles;
  onPress: () => void;
  onPressIn: () => void;
  onPressOut: () => void;
}

export function ProgressRingFAB(props: ProgressRingFABProps) {
  const { colors, isDark } = useThemeColors();

  const animatedRingProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCUMFERENCE * (1 - props.progress.value),
  }));

  const mutedColor = colors.text.tertiary;
  const countColor =
    props.completedToday > 0 ? colors.primary[700] : mutedColor;

  return (
    <View style={s.container}>
      <Animated.View style={[s.ringWrapper, props.isAllDone && GLOW_SHADOW]}>
        <Svg
          height={RING_SIZE}
          width={RING_SIZE}
          style={{ transform: [{ rotate: '-90deg' }] }}
        >
          <Circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            fill='transparent'
            r={RADIUS}
            stroke={RING_COLORS.track}
            strokeWidth={STROKE_WIDTH}
          />
          <AnimatedCircle
            animatedProps={animatedRingProps}
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            fill='transparent'
            r={RADIUS}
            stroke={RING_COLORS.progress}
            strokeDasharray={CIRCUMFERENCE}
            strokeLinecap='round'
            strokeWidth={STROKE_WIDTH}
          />
        </Svg>
        <View style={s.ringOverlay}>
          <Pressable
            accessibilityLabel='Add new habit'
            accessibilityRole='button'
            style={[
              s.fabButton,
              {
                backgroundColor: colors.primary[600],
                borderColor: isDark ? FAB_BORDER_DARK : FAB_BORDER_LIGHT,
              },
            ]}
            onPress={props.onPress}
            onPressIn={props.onPressIn}
            onPressOut={props.onPressOut}
          >
            <View style={s.iconContainer}>
              <Animated.View
                style={[
                  { position: 'absolute' },
                  props.celebrationAnim.plusStyle,
                ]}
              >
                <Plus color='#ffffff' size={24} strokeWidth={2.5} />
              </Animated.View>
              <Animated.View
                style={[
                  { position: 'absolute' },
                  props.celebrationAnim.checkStyle,
                ]}
              >
                <Check color='#ffffff' size={24} strokeWidth={2.5} />
              </Animated.View>
            </View>
          </Pressable>
        </View>
      </Animated.View>
      {props.totalHabits > 0 && (
        <Text style={[s.progressLabel, { color: mutedColor }]}>
          {props.isAllDone ? (
            <Text
              style={{ color: RING_COLORS.completeText, fontWeight: '700' }}
            >
              All done!
            </Text>
          ) : (
            <>
              <Text style={{ color: countColor, fontWeight: '700' }}>
                {props.completedToday}
              </Text>
              {` of ${props.totalHabits}`}
            </>
          )}
        </Text>
      )}
    </View>
  );
}
