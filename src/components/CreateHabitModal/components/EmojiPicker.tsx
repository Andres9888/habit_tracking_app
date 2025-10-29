import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface EmojiPickerProps {
  emojis: string[];
  selectedEmoji: string | null;
  onSelect: (emoji: string | null) => void;
}

export const EmojiPicker = ({ emojis, selectedEmoji, onSelect }: EmojiPickerProps) => (
  <View className='mb-6'>
    <Text className='mb-3 text-base font-semibold text-[#1a1a1a]'>Icon</Text>
    <ScrollView
      horizontal
      className='flex-row'
      contentContainerClassName='gap-3'
      showsHorizontalScrollIndicator={false}
    >
      <TouchableOpacity
        accessibilityLabel='No icon'
        accessibilityRole='button'
        className='h-12 items-center justify-center rounded-xl bg-white px-3'
        style={{ borderColor: '#1a1a1a', borderWidth: selectedEmoji === null ? 2 : 0 }}
        onPress={() => onSelect(null)}
      >
        <Text className='text-xs font-medium text-[#8a8a8a]'>None</Text>
      </TouchableOpacity>
      {emojis.map((emoji) => (
        <TouchableOpacity
          key={emoji}
          accessibilityLabel={`Select ${emoji} icon`}
          accessibilityRole='button'
          className='h-12 w-12 items-center justify-center rounded-xl bg-white'
          style={{ borderColor: '#1a1a1a', borderWidth: selectedEmoji === emoji ? 2 : 0 }}
          onPress={() => onSelect(emoji)}
        >
          <Text className='text-2xl'>{emoji}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
);
