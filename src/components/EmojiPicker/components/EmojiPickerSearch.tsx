import { memo } from 'react';
import { TextInput, View } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';

interface EmojiPickerSearchProps {
  searchQuery: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
}

export const EmojiPickerSearch = memo(
  ({ searchQuery, onChangeText, onClear }: EmojiPickerSearchProps) => (
    <View className='px-4 pb-3 pt-3'>
      <View className='flex-row items-center rounded-xl bg-white px-3 py-2 shadow-sm'>
        <Search color='#78716c' size={20} />
        <TextInput
          accessibilityHint='Type keywords like run, water, or sleep to find emojis'
          accessibilityLabel='Search emojis'
          className='ml-2 flex-1 text-base text-stone-800'
          placeholder='Search "run", "water", "sleep"...'
          placeholderTextColor='#a8a29e'
          returnKeyType='search'
          value={searchQuery}
          onChangeText={onChangeText}
        />
        {searchQuery.length > 0 && (
          <AnimatedPressable
            accessibilityLabel='Clear search'
            accessibilityRole='button'
            onPress={onClear}
          >
            <X color='#78716c' size={18} />
          </AnimatedPressable>
        )}
      </View>
    </View>
  )
);

EmojiPickerSearch.displayName = 'EmojiPickerSearch';
