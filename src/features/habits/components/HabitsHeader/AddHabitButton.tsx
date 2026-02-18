import { Plus } from 'lucide-react-native';
import { Pressable, Text } from 'react-native';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import type { ViewStyle } from 'react-native';
import { SHADOW_OPACITY } from '../../../../constants';
import { useThemeColors } from '../../../../theme/ThemeContext';

interface AddHabitButtonProps {
  animatedStyle: AnimatedStyle<ViewStyle>;
  onPress: () => void;
  onPressIn: () => void;
  onPressOut: () => void;
}

/**
 * Primary "Add Habit" button with gradient background and press animations.
 */
export function AddHabitButton({
  animatedStyle,
  onPress,
  onPressIn,
  onPressOut,
}: AddHabitButtonProps) {
  const { colors: themeColors } = useThemeColors();
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
          colors={['#101828', '#1a2332']}
          end={{ x: 1, y: 1 }}
          start={{ x: 0, y: 0 }}
          style={{
            elevation: 3,
            shadowColor: '#1c1917',
            shadowOffset: { height: 4, width: 0 },
            shadowOpacity: SHADOW_OPACITY.minimal,
            shadowRadius: 16,
          }}
        >
          <Plus color={themeColors.text.inverse} size={18} strokeWidth={2.25} />
          <Text className='text-[15px] font-normal leading-[20px] tracking-tight' style={{ color: themeColors.text.inverse }}>
            Add Habit
          </Text>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}
