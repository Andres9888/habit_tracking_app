import React from 'react';
import { Text } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { AnimatedPressable } from '../../ui/AnimatedPressable';

interface ViewAllButtonProps {
  noteCount: number;
  onPress: () => void;
}

export function ViewAllButton({ noteCount, onPress }: ViewAllButtonProps) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <AnimatedPressable
      accessibilityLabel={`View all ${noteCount} notes`}
      accessibilityRole='button'
      className='flex-row items-center justify-center gap-1 rounded-xl border border-dashed border-stone-200 bg-white py-3 active:bg-stone-50'
      onPress={handlePress}
    >
      <Text className='text-sm font-medium text-stone-600'>
        View all ({noteCount})
      </Text>
      <ChevronRight className='text-stone-400' size={16} />
    </AnimatedPressable>
  );
}
