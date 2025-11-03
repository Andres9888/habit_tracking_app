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
        <EmojiButton
          emoji={null}
          selected={selectedEmoji === null}
          onSelect={onSelect}
          triggerSelection={triggerSelection}
        />
        {emojis.map((emoji) => (
          <EmojiButton
            key={emoji}
            emoji={emoji}
            selected={selectedEmoji === emoji}
            onSelect={onSelect}
            triggerSelection={triggerSelection}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const EmojiButton = ({ emoji, selected, onSelect, triggerSelection }: { emoji: string | null; selected: boolean; onSelect: (emoji: string | null) => void; triggerSelection: () => void }) => {
  const scale = useRef(new Animated.Value(1)).current;

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        accessibilityLabel={emoji ? `Select ${emoji} icon` : 'No icon'}
        accessibilityRole='button'
        className={`h-12 items-center justify-center rounded-xl bg-white ${emoji ? 'w-12' : 'px-3'}`}
        style={{ borderColor: '#1a1a1a', borderWidth: selected ? 2 : 0 }}
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
        onPress={() => {
          triggerSelection();
          onSelect(emoji);
        }}
      >
        {emoji ? (
          <Text className='text-2xl'>{emoji}</Text>
        ) : (
          <Text className='text-xs font-medium text-[#8a8a8a]'>None</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};
