/**
 * EmojiChip Component
 * Individual emoji chip with press animation and green ring when selected.
 * Default (triangle layout) = fixed 56px chip in a 64px box. Pass `size` for the
 * 5-column grid layout, where the tile fills its measured square.
 */

import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import type { EmojiChipProps } from './types';
import { useEmojiPressScale } from './useEmojiPressScale';
import { useThemeColors } from '@/theme/ThemeContext';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const SELECTED_SHADOW = {
  elevation: 4,
  shadowColor: '#059669',
  shadowOffset: { height: 2, width: 0 },
  shadowOpacity: 0.25,
  shadowRadius: 4,
};

function EmojiChipComponent({
  emoji,
  isSelected,
  onPress,
  reduceMotion,
  size,
}: EmojiChipProps) {
  const { animatedStyle, onPressIn, onPressOut } =
    useEmojiPressScale(reduceMotion);
  const { colors: themeColors } = useThemeColors();
  const box = size ?? 64;
  const chipStyle = size
    ? { borderRadius: 16, height: size, width: size }
    : null;

  return (
    // Fixed-size container prevents layout shift during the scale animation
    <View
      style={{
        alignItems: 'center',
        height: box,
        justifyContent: 'center',
        width: box,
      }}
    >
      <AnimatedPressable
        accessibilityLabel={`Select emoji ${emoji}`}
        accessibilityRole='button'
        accessibilityState={{ selected: isSelected }}
        className={`items-center justify-center ${size ? '' : 'h-14 w-14 rounded-2xl'} ${
          isSelected ? 'border-2 border-[#059669] bg-[#D1FAE5]' : 'border'
        }`}
        style={[
          animatedStyle,
          chipStyle,
          isSelected
            ? SELECTED_SHADOW
            : {
                backgroundColor: themeColors.background,
                borderColor: themeColors.border,
              },
        ]}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        <Text className='text-3xl'>{emoji}</Text>
      </AnimatedPressable>
    </View>
  );
}

export const EmojiChip = memo(EmojiChipComponent);
