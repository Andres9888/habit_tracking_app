import { useCallback, useRef } from 'react';
import { Animated, Pressable, Text } from 'react-native';
import { Motion } from '../../../../constants/motion';
import useHapticFeedback from '../../../../hooks/useHapticFeedback';

interface SuggestionButtonProps {
  suggestion: string;
  onPress: () => void;
}

export const SuggestionButton = ({
  suggestion,
  onPress,
}: SuggestionButtonProps) => {
  const scale = useRef(new Animated.Value(1)).current;
  const { triggerLightImpact } = useHapticFeedback();

  const handlePressIn = useCallback(() => {
    Animated.timing(scale, {
      duration: Motion.duration.fast,
      easing: Motion.easing.inEase,
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scale, {
      damping: 12,
      stiffness: 200,
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  const handlePress = useCallback(() => {
    triggerLightImpact();
    onPress();
  }, [triggerLightImpact, onPress]);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        accessibilityLabel={`Add ${suggestion} to habit name`}
        accessibilityRole='button'
        className='mb-2 mr-2 flex-row items-center rounded-full px-3 py-1.5'
        style={{
          backgroundColor: '#EDE9FE',
          borderColor: '#C4B5FD',
          borderWidth: 1,
        }}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Text className='mr-1 text-xs text-violet-600'>+</Text>
        <Text className='text-sm font-medium text-violet-700'>
          {suggestion}
        </Text>
      </Pressable>
    </Animated.View>
  );
};
