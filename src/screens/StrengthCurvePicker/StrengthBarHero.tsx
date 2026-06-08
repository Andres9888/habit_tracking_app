/** StrengthBarHero — V5 giant bar with milestones, animated fill. */
import type { AlgorithmMode } from '@/components/AlgorithmPicker';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import { useThemeColors } from '@/theme/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { MODE_STYLES } from './strengthCurveModeStyles';
import {
  STRENGTH_CURVE_PICKER_COPY,
  TIER_COPY,
} from './StrengthCurvePicker.copy';

const FILL_PERCENT = 50;

export function StrengthBarHero({
  mode,
  scale = 1,
}: {
  mode: AlgorithmMode;
  scale?: number;
}) {
  const { colors, isDark } = useThemeColors();
  const reduceMotion = useReduceMotion();
  const tier = TIER_COPY[mode];
  const accent = MODE_STYLES[mode].curveColor;
  const empty = isDark ? 'rgba(255,255,255,0.10)' : '#E8E5DD';
  const fillWidth = useSharedValue(reduceMotion ? FILL_PERCENT : 0);

  useEffect(() => {
    if (reduceMotion) {
      fillWidth.value = FILL_PERCENT;
      return;
    }
    fillWidth.value = 0;
    fillWidth.value = withDelay(
      180,
      withTiming(FILL_PERCENT, { duration: 620 })
    );
  }, [fillWidth, mode, reduceMotion]);

  const fillStyle = useAnimatedStyle(() => ({ width: `${fillWidth.value}%` }));

  return (
    <View
      className='mx-4 rounded-2xl'
      style={{
        backgroundColor: colors.card,
        borderColor: colors.border,
        borderWidth: 1,
        marginTop: 8 * scale,
        padding: 16 * scale,
      }}
    >
      <View
        className='flex-row items-start'
        style={{ marginBottom: 10 * scale, minHeight: 34 * scale }}
      >
        <View className='flex-1 items-start'>
          <Text
            className='font-extrabold tracking-wider'
            style={{ color: colors.text.tertiary, fontSize: 12 * scale }}
          >
            DAY 1
          </Text>
          <Text
            style={{
              color: colors.text.tertiary,
              fontSize: 11 * scale,
              marginTop: 1 * scale,
            }}
          >
            {STRENGTH_CURVE_PICKER_COPY.freshStartLabel}
          </Text>
        </View>
        <View className='flex-1 items-center'>
          <Text
            className='font-extrabold tracking-wider'
            style={{ color: colors.text.tertiary, fontSize: 12 * scale }}
          >
            {tier.midpointLabel}
          </Text>
          <Text
            className='font-semibold'
            style={{
              color: colors.text.primary,
              fontSize: 11 * scale,
              marginTop: 1 * scale,
            }}
          >
            {tier.midpointSub}
          </Text>
        </View>
        <View className='flex-1 items-end'>
          <Text
            className='font-extrabold tracking-wider'
            style={{ color: accent, fontSize: 12 * scale }}
          >
            {tier.automaticMilestone}
          </Text>
          <Text
            style={{
              color: accent,
              fontSize: 11 * scale,
              marginTop: 1 * scale,
            }}
          >
            {STRENGTH_CURVE_PICKER_COPY.automaticLabel}
          </Text>
        </View>
      </View>

      <View
        style={{
          height: 28 * scale,
          backgroundColor: empty,
          borderRadius: 999,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Animated.View
          style={[
            {
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              borderRadius: 999,
              overflow: 'hidden',
            },
            fillStyle,
          ]}
        >
          <LinearGradient
            colors={[accent, accent]}
            end={{ x: 1, y: 0 }}
            start={{ x: 0, y: 0 }}
            style={{ flex: 1 }}
          />
        </Animated.View>
      </View>
    </View>
  );
}
