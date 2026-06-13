/** TierPickerTile — single tier tile with spring press scale. */
import { Pressable, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import type { AlgorithmMode } from '@/components/AlgorithmPicker';
import { triggerHaptic } from '@/utils/haptics';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import { springs } from '@/theme/animations';
import { useThemeColors } from '@/theme/ThemeContext';
import type { TierCopy } from './StrengthCurvePicker.copy';
import type { ModeStyle } from './strengthCurveModeStyles';

interface Props {
  mode: AlgorithmMode;
  tier: TierCopy;
  style: ModeStyle;
  isSelected: boolean;
  onSelect: (mode: AlgorithmMode) => void;
  scale?: number;
}

export function TierPickerTile({ mode, tier, style, isSelected, onSelect, scale = 1 }: Props) {
  const { colors } = useThemeColors();
  const reduceMotion = useReduceMotion();
  const pressScale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: pressScale.value }] }));

  return (
    <Pressable
      accessibilityLabel={tier.tierName}
      accessibilityRole='radio'
      accessibilityState={{ selected: isSelected }}
      style={{ width: '100%' }}
      onPress={() => {
        if (!isSelected) void triggerHaptic('selection');
        onSelect(mode);
      }}
      onPressIn={() => {
        if (!reduceMotion) pressScale.value = withSpring(0.96, springs.responsive);
      }}
      onPressOut={() => {
        if (!reduceMotion) pressScale.value = withSpring(1, springs.responsive);
      }}
    >
      <Animated.View
        className='items-center rounded-2xl'
        style={[
          {
            backgroundColor: isSelected ? style.tierPillBg : colors.card,
            borderColor: isSelected ? style.curveColor : colors.border,
            borderWidth: 1.5,
            minHeight: 72 * scale,
            padding: 10 * scale,
            width: '100%',
          },
          animatedStyle,
        ]}
      >
        <View
          className='flex-row items-center rounded-full'
          style={{ backgroundColor: isSelected ? colors.card : style.tierPillBg, gap: 3 * scale, paddingHorizontal: 6 * scale, paddingVertical: 2 * scale }}
        >
          <style.Icon
            color={style.tierPillFg}
            size={12 * scale}
            strokeWidth={isSelected ? 2.5 : 2}
          />
          <Text
            adjustsFontSizeToFit
            className='font-bold'
            numberOfLines={1}
            style={{ color: style.tierPillFg, fontSize: 12 * scale }}
          >
            {tier.tierName}
          </Text>
        </View>
        <Text className='font-extrabold' style={{ color: colors.text.primary, fontSize: 15 * scale, marginTop: 6 * scale }}>
          {tier.formationWeeks}
        </Text>
      </Animated.View>
    </Pressable>
  );
}
