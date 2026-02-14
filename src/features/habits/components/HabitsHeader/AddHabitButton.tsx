import { Plus } from 'lucide-react-native';
import { Pressable, Text } from 'react-native';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import type { ViewStyle } from 'react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { shadows } from '../../../../theme/spacing';

interface AddHabitButtonProps {
  animatedStyle: AnimatedStyle<ViewStyle>;
  onPress: () => void;
  onPressIn: () => void;
  onPressOut: () => void;
}

/**
 * Primary "Add Habit" button with gradient background and press animations.
 * Uses theme tokens for dark mode compatibility.
 */
export function AddHabitButton({
  animatedStyle,
  onPress,
  onPressIn,
  onPressOut,
}: AddHabitButtonProps) {
  const { isDark } = useThemeColors();

  const gradientColors: [string, string] = isDark
    ? ['#374151', '#1F2937']
    : ['#101828', '#1a2332'];

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        accessibilityHint='Open create habit modal'
        accessibilityLabel='Add habit'
        accessibilityRole='button'
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        <LinearGradient
          className='h-12 flex-row items-center gap-2 rounded-full px-5'
          colors={gradientColors}
          end={{ x: 1, y: 1 }}
          start={{ x: 0, y: 0 }}
          style={shadows.floatingActionButton}
        >
          <Plus color='#ffffff' size={18} strokeWidth={2.25} />
          <Text className='text-[15px] font-normal leading-[20px] tracking-tight text-white'>
            Add Habit
          </Text>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}
