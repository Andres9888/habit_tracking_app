/** StrengthBarHero — V5 giant bar with milestones, animated fill. */
import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import type { AlgorithmMode } from '@/components/AlgorithmPicker';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import { useThemeColors } from '@/theme/ThemeContext';
import { STRENGTH_CURVE_PICKER_COPY, TIER_COPY } from './StrengthCurvePicker.copy';
import { MODE_STYLES } from './strengthCurveModeStyles';

const FILL_PERCENT = 50;

export function StrengthBarHero({ mode, scale = 1 }: { mode: AlgorithmMode; scale?: number }) {
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
    fillWidth.value = withDelay(180, withTiming(FILL_PERCENT, { duration: 620 }));
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
      <Animated.View
        key={`labels-${mode}`}
        className='flex-row items-start justify-between'
        entering={reduceMotion ? undefined : FadeInDown.duration(260)}
        style={{ marginBottom: 10 * scale }}
      >
        <View className='items-start'>
          <Text className='font-extrabold tracking-wider' style={{ color: colors.text.tertiary, fontSize: 12 * scale }}>DAY 1</Text>
          <Text style={{ color: colors.text.tertiary, fontSize: 11 * scale, marginTop: 1 * scale }}>{STRENGTH_CURVE_PICKER_COPY.freshStartLabel}</Text>
        </View>
        <View className='items-center'>
          <Text className='font-extrabold tracking-wider' style={{ color: colors.text.tertiary, fontSize: 12 * scale }}>{tier.midpointLabel}</Text>
          <Text className='font-semibold' style={{ color: colors.text.primary, fontSize: 11 * scale, marginTop: 1 * scale }}>{tier.midpointSub}</Text>
        </View>
        <View className='items-end'>
          <Text className='font-extrabold tracking-wider' style={{ color: accent, fontSize: 12 * scale }}>{tier.automaticMilestone}</Text>
          <Text style={{ color: accent, fontSize: 11 * scale, marginTop: 1 * scale }}>{STRENGTH_CURVE_PICKER_COPY.automaticLabel}</Text>
        </View>
      </Animated.View>

      <View style={{ height: 28 * scale, backgroundColor: empty, borderRadius: 999, position: 'relative', overflow: 'hidden' }}>
        <Animated.View key={`fill-${mode}`} style={[{ position: 'absolute', left: 0, top: 0, bottom: 0, borderRadius: 999, overflow: 'hidden' }, fillStyle]}>
          <LinearGradient colors={[accent, accent]} end={{ x: 1, y: 0 }} start={{ x: 0, y: 0 }} style={{ flex: 1 }} />
        </Animated.View>
      </View>
    </View>
  );
}
