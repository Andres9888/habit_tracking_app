import { useCallback } from 'react';
import { Pressable, Text } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated';

import { useHapticFeedback } from '../../../../../hooks/useHapticFeedback';
import { useThemeColors } from '@/theme/ThemeContext';
import { BORDER_RADIUS, TOUCH_TARGETS } from '../constants';
import type { SuggestionChip } from '../types';
import { useChipAnimations } from './useChipAnimations';
import { SHADOW_OPACITY } from '../../../../../constants';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface ChipProps {
  chip: SuggestionChip;
  index: number;
  isSelected: boolean;
  onPress: () => void;
  staggerDelay: number;
}

export function Chip({ chip, isSelected, onPress, staggerDelay }: ChipProps) {
  const { triggerSelection } = useHapticFeedback();
  const { colors, isDark } = useThemeColors();
  const {
    scale,
    translateY,
    shadowOpacity,
    selectionProgress,
    entranceOpacity,
    entranceTranslateY,
    handlePressIn,
    handlePressOut,
    animatePressScale,
  } = useChipAnimations({ isSelected, staggerDelay });

  const chipBgDefault = isDark ? colors.card : '#ffffff';
  const chipBorderDefault = colors.border;
  const chipTextDefault = isDark ? colors.text.primary : colors.gray[700];
  const selectedBg = colors.primary[700];
  const selectedBorder = colors.primary[700];

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      selectionProgress.value,
      [0, 1],
      [chipBgDefault, selectedBg]
    ),
    borderColor: interpolateColor(
      selectionProgress.value,
      [0, 1],
      [chipBorderDefault, selectedBorder]
    ),
    opacity: entranceOpacity.value,
    shadowOpacity: shadowOpacity.value,
    transform: [
      { translateY: entranceTranslateY.value + translateY.value },
      { scale: scale.value },
    ],
  }));

  const textStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      selectionProgress.value,
      [0, 1],
      [chipTextDefault, '#ffffff']
    ),
  }));

  const handlePress = useCallback(() => {
    triggerSelection();
    animatePressScale();
    onPress();
  }, [onPress, animatePressScale, triggerSelection]);

  return (
    <AnimatedPressable
      accessibilityHint={`Select ${chip.fullName} habit category`}
      accessibilityLabel={`Select ${chip.fullName}`}
      accessibilityRole='button'
      accessibilityState={{ selected: isSelected }}
      style={[
        animatedStyle,
        {
          alignItems: 'center',
          borderRadius: BORDER_RADIUS.chip,
          borderWidth: 1,
          elevation: 1,
          flexDirection: 'row',
          gap: 4,
          minHeight: TOUCH_TARGETS.chipHeight,
          paddingHorizontal: 10,
          paddingVertical: 8,
          shadowColor: isDark ? '#000000' : '#1c1917',
          shadowOffset: { height: 4, width: 0 },
          shadowOpacity: SHADOW_OPACITY.minimal,
          shadowRadius: 16,
        },
      ]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Text style={{ fontSize: 17 }}>{chip.emoji}</Text>
      <Animated.Text style={[textStyle, { fontSize: 13, fontWeight: '600' }]}>
        {chip.label}
      </Animated.Text>
    </AnimatedPressable>
  );
}
