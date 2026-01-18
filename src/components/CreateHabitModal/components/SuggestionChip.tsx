import { useRef } from 'react';
import { Animated, Pressable, Text } from 'react-native';
import { Motion } from '../../../constants/motion';
import useHapticFeedback from '../../../hooks/useHapticFeedback';

interface SuggestionChipProps {
  emoji: string | null;
  name: string;
  color: string;
  onPick: (emoji: string | null, name: string, color: string) => void;
}

export const SuggestionChip = ({
  emoji,
  name,
  color,
  onPick,
}: SuggestionChipProps) => {
  const scale = useRef(new Animated.Value(1)).current;
  const { triggerSelection } = useHapticFeedback();

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        accessibilityLabel={`Use template ${name}`}
        accessibilityRole='button'
        className='flex-row items-center rounded-full bg-white px-3 py-2'
        style={{ borderColor: '#d6d3d1', borderWidth: 1 }}
        onPress={() => {
          triggerSelection();
          onPick(emoji, name, color);
        }}
        onPressIn={() => {
          Animated.timing(scale, {
            duration: Motion.duration.fast,
            easing: Motion.easing.inEase,
            toValue: 0.96,
            useNativeDriver: true,
          }).start();
        }}
        onPressOut={() => {
          Animated.timing(scale, {
            duration: Motion.duration.base,
            easing: Motion.easing.outEase,
            toValue: 1,
            useNativeDriver: true,
          }).start();
        }}
      >
        {emoji && <Text className='mr-2 text-base'>{emoji}</Text>}
        <Text className='text-sm font-medium text-[#1c1917]'>{name}</Text>
        <Text className='ml-1 text-xs'>✨</Text>
      </Pressable>
    </Animated.View>
  );
};
