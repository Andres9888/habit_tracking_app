/**
 * CategoryGridItem - A category tile for the 2-column grid on screen 7.
 *
 * Displays an emoji centered above a label with a colored background.
 * Shows a "PRO" badge for premium categories and a selection border.
 */

import { Pressable, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { springs } from '@/theme/animations';
import { useThemeColors } from '@/theme/ThemeContext';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface CategoryGridItemProps {
  bgColor: string;
  emoji: string;
  isPremium?: boolean;
  label: string;
  onPress: () => void;
  selected: boolean;
  textColor: string;
}

export function CategoryGridItem({
  bgColor,
  emoji,
  isPremium,
  label,
  onPress,
  selected,
  textColor,
}: CategoryGridItemProps) {
  const { colors } = useThemeColors();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, springs.button);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, springs.button);
  };

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      className="aspect-square items-center justify-center rounded-2xl p-3"
      style={[
        animatedStyle,
        {
          backgroundColor: bgColor,
          borderColor: selected ? colors.primary[600] : 'transparent',
          borderWidth: 2,
        },
      ]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      {isPremium ? <ProBadge /> : null}
      <Text className="text-3xl">{emoji}</Text>
      <Text
        className="mt-2 text-center text-sm font-semibold"
        numberOfLines={2}
        style={{ color: textColor }}
      >
        {label}
      </Text>
    </AnimatedPressable>
  );
}

function ProBadge() {
  return (
    <View className="absolute right-2 top-2 rounded-md bg-amber-500 px-1.5 py-0.5">
      <Text className="text-[10px] font-bold text-white">PRO</Text>
    </View>
  );
}
