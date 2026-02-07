/** NotesEmptyState - OPTIMIZED: Better animation, haptics, engaging illustration */
import React from 'react';
import { Text, View } from 'react-native';
import { StickyNote, Plus } from 'lucide-react-native';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface NotesEmptyStateProps {
  onAddNote: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(View);

export function NotesEmptyState({ onAddNote }: NotesEmptyStateProps) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onAddNote();
  };

  return (
    <Animated.View entering={FadeIn.duration(250)}>
      <AnimatedPressable
        accessibilityLabel='Add your first note'
        accessibilityRole='button'
        className='items-center rounded-2xl bg-amber-50 py-8'
        style={[
          animatedStyle,
          {
            shadowColor: '#f59e0b',
            shadowOffset: { height: 4, width: 0 },
            shadowOpacity: 0.08,
            shadowRadius: 12,
          },
        ]}
        onTouchCancel={handlePressOut}
        onTouchEnd={() => {
          handlePressOut();
          handlePress();
        }}
        onTouchStart={handlePressIn}
      >
        {/* Icon */}
        <View className='mb-3 h-14 w-14 items-center justify-center rounded-xl bg-amber-100'>
          <StickyNote color='#d97706' size={28} strokeWidth={1.5} />
        </View>

        {/* Text */}
        <Text className='mb-1 text-center text-[15px] text-stone-600'>
          Record insights to learn what works best
        </Text>

        {/* CTA */}
        <View className='mt-3 flex-row items-center gap-1.5 rounded-full bg-amber-500 px-4 py-2'>
          <Plus color='#ffffff' size={16} strokeWidth={2.5} />
          <Text className='text-[13px] font-semibold text-white'>Add Note</Text>
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
}
