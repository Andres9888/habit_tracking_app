import { memo } from 'react';
import { TextInput, View } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { useThemeColors } from '@/theme/ThemeContext';
import { shadows } from '@/theme/spacing';
import { buildTextInputHintProps } from '@/utils/textInputHintProps';
import { iconSizes } from '@/theme/iconSizes';

interface EmojiPickerSearchProps {
  searchQuery: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
}

export const EmojiPickerSearch = memo(
  ({ searchQuery, onChangeText, onClear }: EmojiPickerSearchProps) => {
    const { colors } = useThemeColors();

    return (
    <View className='px-4 pb-3 pt-3'>
      <View className='flex-row items-center rounded-xl bg-white px-3 py-2' style={shadows.card}>
        <Search color='#78716c' size={iconSizes.medium} />
        <TextInput
          accessibilityHint='Type keywords like run, water, or sleep to find emojis'
          accessibilityLabel='Search emojis'
          className='ml-2 flex-1 text-base'
          style={{ color: colors.text.primary }}
          returnKeyType='search'
          value={searchQuery}
          {...buildTextInputHintProps(
            'Search "run", "water", "sleep"...',
            '#a8a29e'
          )}
          onChangeText={onChangeText}
        />
        {searchQuery.length > 0 ? <AnimatedPressable
            accessibilityLabel='Clear search'
            accessibilityRole='button'
            onPress={onClear}
          >
            <X color='#78716c' size={iconSizes.medium} />
          </AnimatedPressable> : null}
      </View>
    </View>
    );
  }
);

EmojiPickerSearch.displayName = 'EmojiPickerSearch';
