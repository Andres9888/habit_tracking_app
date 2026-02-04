/**
 * EditHeader Component
 *
 * Header bar for the habit edit screen with cancel and save actions.
 * Features green (emerald) save button with press animation.
 */

import { View, Pressable, Text } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  FadeIn,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface EditHeaderProps {
  paddingTop: number;
  onCancel: () => void;
  onSave: () => void;
}

export function EditHeader({ paddingTop, onCancel, onSave }: EditHeaderProps) {
  const saveScale = useSharedValue(1);
  const savePressed = useSharedValue(false);

  const saveButtonStyle = useAnimatedStyle(() => ({
    backgroundColor: savePressed.value ? '#059669' : '#10B981',
    transform: [{ scale: saveScale.value }],
  }));

  const handleSavePressIn = () => {
    savePressed.value = true;
    saveScale.value = withTiming(0.96, { duration: 100 });
  };

  const handleSavePressOut = () => {
    savePressed.value = false;
    saveScale.value = withSpring(1, { damping: 10, stiffness: 400 });
  };

  return (
    <Animated.View
      className='flex-row items-center justify-between border-b border-stone-200 bg-stone-50 px-4 pb-3'
      entering={FadeIn.duration(250).delay(0)}
      style={{ paddingTop }}
    >
      <Pressable
        accessibilityLabel='Cancel'
        accessibilityRole='button'
        className='h-11 w-11 items-center justify-center rounded-full'
        onPress={onCancel}
      >
        <ChevronLeft color='#1c1917' size={24} strokeWidth={2} />
      </Pressable>

      <AnimatedPressable
        accessibilityLabel='Save changes'
        accessibilityRole='button'
        className='rounded-full px-5 py-2.5'
        style={saveButtonStyle}
        onPress={onSave}
        onPressIn={handleSavePressIn}
        onPressOut={handleSavePressOut}
      >
        <Text className='text-[15px] font-semibold text-white'>Save</Text>
      </AnimatedPressable>
    </Animated.View>
  );
}
