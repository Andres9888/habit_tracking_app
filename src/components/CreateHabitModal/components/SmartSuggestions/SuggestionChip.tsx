import { useCallback, useRef } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { Motion } from '../../../../constants/motion';
import useHapticFeedback from '../../../../hooks/useHapticFeedback';
import type { SuggestionChipProps } from './types';

export const SuggestionChip = ({
  color,
  emoji,
  isHighlighted,
  name,
  onPick,
}: SuggestionChipProps) => {
  const scale = useRef(new Animated.Value(1)).current;
  const { triggerSelection } = useHapticFeedback();

  const handlePressIn = useCallback(() => {
    Animated.timing(scale, {
      duration: Motion.duration.fast,
      easing: Motion.easing.inEase,
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  const handlePressOut = useCallback(() => {
    Animated.timing(scale, {
      duration: Motion.duration.base,
      easing: Motion.easing.outEase,
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  const handlePress = useCallback(() => {
    triggerSelection();
    onPick(emoji, name, color);
  }, [color, emoji, name, onPick, triggerSelection]);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        accessibilityLabel={`Use habit: ${name}`}
        accessibilityRole='button'
        className={`flex-row items-center rounded-2xl px-4 py-3 ${
          isHighlighted ? 'bg-blue-50' : 'bg-white'
        }`}
        style={{
          borderColor: isHighlighted ? '#3b82f6' : '#e7e5e4',
          borderWidth: isHighlighted ? 2 : 1,
          shadowColor: '#000',
          shadowOffset: { height: 1, width: 0 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
        }}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <View
          className='mr-3 h-10 w-10 items-center justify-center rounded-xl'
          style={{ backgroundColor: color + '20' }}
        >
          <Text className='text-xl'>{emoji}</Text>
        </View>
        <Text className='text-sm font-semibold text-stone-700'>{name}</Text>
      </Pressable>
    </Animated.View>
  );
};
