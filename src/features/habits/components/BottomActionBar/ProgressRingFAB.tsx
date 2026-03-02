/**
 * ProgressRingFAB — SVG progress ring wrapping the center FAB button.
 *
 * Circular FAB sits inside a circular ring with a visible 4px gap.
 * Ring fills as habits are completed. On all-done: glow + icon crossfade.
 */

import { Pressable, View } from 'react-native';
import Animated, { useAnimatedProps, useAnimatedStyle } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { Plus, Check } from 'lucide-react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import {
  CIRCUMFERENCE, DARK_FAB_SHADOW, FAB_BORDER_DARK,
  FAB_BORDER_LIGHT, GLOW_SHADOW_BASE, RADIUS,
  RING_SIZE, STROKE_WIDTH, fabRingStyles as s,
} from './ProgressRingFAB.styles';
import type { ProgressRingFABProps } from './types';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export function ProgressRingFAB(props: ProgressRingFABProps) {
  const { colors, isDark } = useThemeColors();
  const safeCelebrationAnim = props.celebrationAnim ?? {
    plusStyle: { opacity: 1, transform: [{ scale: 1 }] },
    checkStyle: { opacity: 0, transform: [{ scale: 0 }] },
  };
  const animatedRingProps = useAnimatedProps(() => ({
    strokeDashoffset:
      CIRCUMFERENCE * (1 - (props.progress?.value ?? 0)),
  }));
  const ringPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: props.ringPulse?.value ?? 1 }],
  }));
  const glow = props.isAllDone
    ? { ...GLOW_SHADOW_BASE, shadowColor: colors.primary[500] }
    : undefined;
  const fabBg = {
    backgroundColor: colors.primary[600],
    borderColor: isDark ? FAB_BORDER_DARK : FAB_BORDER_LIGHT,
  };

  return (
    <View style={s.container}>
      <Animated.View style={[s.ringWrapper, glow, ringPulseStyle]}>
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
            stroke={colors.card}
            strokeWidth={STROKE_WIDTH}
          />
          <AnimatedCircle
            animatedProps={animatedRingProps}
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            fill='transparent'
            r={RADIUS}
            stroke={colors.primary[500]}
            strokeDasharray={CIRCUMFERENCE}
            strokeLinecap='round'
            strokeWidth={STROKE_WIDTH}
          />
        </Svg>
        <View style={s.ringOverlay}>
          <Pressable
            accessibilityLabel='Add new habit'
            accessibilityRole='button'
            style={[s.fabButton, fabBg, isDark ? DARK_FAB_SHADOW : undefined]}
            onPress={props.onPress}
            onPressIn={props.onPressIn}
            onPressOut={props.onPressOut}
          >
            <View style={s.iconContainer}>
              <Animated.View
                style={[s.iconAbsolute, safeCelebrationAnim.plusStyle]}
              >
                <Plus color='#ffffff' size={24} strokeWidth={2.5} />
              </Animated.View>
              <Animated.View
                style={[s.iconAbsolute, safeCelebrationAnim.checkStyle]}
              >
                <Check color='#ffffff' size={24} strokeWidth={2.5} />
              </Animated.View>
            </View>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}
