/** TierPickerTile — single tier tile with spring press scale. */
import { Check, Lock } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import type { AlgorithmMode } from '@/components/AlgorithmPicker';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import { useThemeColors } from '@/theme/ThemeContext';
import type { TierCopy } from './StrengthCurvePicker.copy';
import type { ModeStyle } from './strengthCurveModeStyles';

interface Props { mode: AlgorithmMode; tier: TierCopy; style: ModeStyle; locked?: boolean; isSelected: boolean; onSelect: (mode: AlgorithmMode) => void; scale?: number; }

export function TierPickerTile({ mode, tier, style, locked = false, isSelected, onSelect, scale = 1 }: Props) {
  const { colors } = useThemeColors();
  const reduceMotion = useReduceMotion();
  const pressScale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: pressScale.value }] }));
  const TierIcon = style.Icon;
  const checkSize = 24 * scale;

  return (
    <Pressable
      accessibilityLabel={tier.tierName}
      accessibilityHint={locked ? 'Premium tier' : undefined}
      accessibilityRole='radio'
      accessibilityState={{ selected: isSelected }}
      style={{ width: '100%' }}
      onPress={() => {
        if (!isSelected) void Haptics.selectionAsync();
        onSelect(mode);
      }}
      onPressIn={() => {
        if (!reduceMotion) pressScale.value = withSpring(0.96, { damping: 14, stiffness: 360 });
      }}
      onPressOut={() => {
        if (!reduceMotion) pressScale.value = withSpring(1, { damping: 14, stiffness: 360 });
      }}
    >
      <Animated.View
        className='items-center rounded-2xl'
        style={[
          {
            backgroundColor: colors.card,
            borderColor: isSelected ? style.curveColor : colors.cardBorder,
            borderWidth: isSelected ? 2 : 1.5,
            padding: 10 * scale,
            width: '100%',
          },
          animatedStyle,
        ]}
      >
        <View
          className='flex-row items-center rounded-full'
          style={{ backgroundColor: style.tierPillBg, gap: 4 * scale, paddingHorizontal: 6 * scale, paddingVertical: 2 * scale }}
        >
          <TierIcon color={style.tierPillFg} size={12 * scale} strokeWidth={2.25} />
          <Text className='font-bold' style={{ color: style.tierPillFg, fontSize: 12 * scale }}>{tier.tierName}</Text>
        </View>
        <Text className='font-extrabold' style={{ color: colors.text.primary, fontSize: 15 * scale, marginTop: 6 * scale }}>{tier.formationWeeks}</Text>
        <Text style={{ color: colors.text.tertiary, fontSize: 11 * scale }}>{tier.formationDays}</Text>
        {locked ? (
          <View className='flex-row items-center rounded-full' style={{ backgroundColor: colors.status.premiumLight, gap: 3 * scale, marginTop: 6 * scale, paddingHorizontal: 7 * scale, paddingVertical: 2 * scale }}>
            <Lock color={colors.status.premiumText} size={10 * scale} strokeWidth={2.25} />
            <Text className='font-bold' style={{ color: colors.status.premiumText, fontSize: 10 * scale }}>PRO</Text>
          </View>
        ) : null}
        {isSelected ? (
          <View className='items-center justify-center rounded-full' style={{ backgroundColor: style.curveColor, height: checkSize, width: checkSize, marginTop: 6 * scale }}>
            <Check color={colors.text.inverse} size={14 * scale} strokeWidth={3} />
          </View>
        ) : (
          <View style={{ height: checkSize, width: checkSize, marginTop: 6 * scale }} />
        )}
      </Animated.View>
    </Pressable>
  );
}
