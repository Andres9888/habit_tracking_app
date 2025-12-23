import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import useHapticFeedback from '../../../hooks/useHapticFeedback';
import STRINGS from '../../../constants/strings';
import { EmojiPickerSheet } from '../../EmojiPicker';

interface EmojiPickerProps {
  emojis?: string[]; // kept for backwards compatibility but not used
  selectedEmoji: string | null;
  onSelect: (emoji: string | null) => void;
  habitName?: string;
}

export const EmojiPicker = ({ selectedEmoji, onSelect, habitName }: EmojiPickerProps) => {
  const { triggerSelection } = useHapticFeedback();
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <View className='mb-6'>
      <Text className='mb-3 text-base font-semibold text-[#1a1a1a]'>
        {STRINGS.CREATE_HABIT.iconLabel}
      </Text>
      <Pressable
        accessibilityLabel='Choose icon'
        accessibilityRole='button'
        className='flex-row items-center gap-3 rounded-xl bg-white p-4'
        onPress={() => {
          triggerSelection();
          setIsModalVisible(true);
        }}
      >
        <View
          className='h-12 w-12 items-center justify-center rounded-xl bg-stone-100'
        >
          <Text className='text-2xl'>{selectedEmoji || '➕'}</Text>
        </View>
        <Text className='flex-1 text-base text-[#1a1a1a]'>
          {selectedEmoji ? 'Change icon' : 'Choose an icon'}
        </Text>
        <Text className='text-sm text-[#3B82F6]'>Edit</Text>
      </Pressable>

      <EmojiPickerSheet
        visible={isModalVisible}
        selectedEmoji={selectedEmoji}
        habitName={habitName || ''}
        onSelect={(emoji) => {
          onSelect(emoji);
          triggerSelection();
        }}
        onClose={() => setIsModalVisible(false)}
      />
    </View>
  );
};
