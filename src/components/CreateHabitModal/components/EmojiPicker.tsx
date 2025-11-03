import { Animated, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useRef } from 'react';
import useHapticFeedback from '../../../hooks/useHapticFeedback';
import STRINGS from '../../../constants/strings';
import { Motion } from '../../../constants/motion';

interface EmojiPickerProps {
  emojis: string[];
  selectedEmoji: string | null;
  onSelect: (emoji: string | null) => void;
}

export const EmojiPicker = ({ emojis, selectedEmoji, onSelect }: EmojiPickerProps) => {
  const { triggerSelection } = useHapticFeedback();
  return (
    <View className='mb-6'>
      <Text className='mb-3 text-base font-semibold text-[#1a1a1a]'>
        {STRINGS.CREATE_HABIT.iconLabel}
      </Text>
      <ScrollView
        horizontal
        className='flex-row'
        contentContainerClassName='gap-3'
        showsHorizontalScrollIndicator={false}
      >
        <AnimatedTouchable
          accessibilityLabel='No icon'
          accessibilityRole='button'
          className='h-12 items-center justify-center rounded-xl bg-white px-3'
          style={{ borderColor: '#1a1a1a', borderWidth: selectedEmoji === null ? 2 : 0 }}
          onPress={() => {
            triggerSelection();
            onSelect(null);
          }}
        >
          <Text className='text-xs font-medium text-[#8a8a8a]'>None</Text>
        </AnimatedTouchable>
        {emojis.map((emoji) => (
          <AnimatedTouchable
            key={emoji}
            accessibilityLabel={`Select ${emoji} icon`}
            accessibilityRole='button'
            className='h-12 w-12 items-center justify-center rounded-xl bg-white'
            style={{ borderColor: '#1a1a1a', borderWidth: selectedEmoji === emoji ? 2 : 0 }}
            onPress={() => {
              triggerSelection();
              onSelect(emoji);
            }}
          >
            <Text className='text-2xl'>{emoji}</Text>
          </AnimatedTouchable>
        ))}
      </ScrollView>
    </View>
  );
};

// Local helper adds press-in scale animation
const AnimatedTouchable = ({ children, onPress, style, ...rest }: any) => {
  const scale = useRef(new Animated.Value(1)).current;
  return (
    <Animated.View style={[{ transform: [{ scale }] }]}>
      <TouchableOpacity
        {...rest}
        style={style}
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
        onPress={onPress}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
};
