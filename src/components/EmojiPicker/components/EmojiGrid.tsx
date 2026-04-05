import { memo, useCallback, useMemo } from 'react';
import { FlatList, Text, View } from 'react-native';
import { Search } from 'lucide-react-native';
import { useThemeColors } from '@/theme/ThemeContext';
import { iconSizes } from '@/theme/iconSizes';
import { EmojiItem } from './EmojiItem';
import { EMOJIS_PER_ROW } from '../EmojiPicker.constants';

interface EmojiGridProps {
  displayedEmojis: string[];
  selectedEmoji?: string | null;
  categoryName: string;
  isSearching: boolean;
  onEmojiSelect: (emoji: string) => void;
}

export const EmojiGrid = memo(
  ({
    displayedEmojis,
    selectedEmoji,
    categoryName,
    isSearching,
    onEmojiSelect,
  }: EmojiGridProps) => {
    const { colors } = useThemeColors();
    const emojiRows = useMemo(() => {
      const rows: string[][] = [];
      for (let i = 0; i < displayedEmojis.length; i += EMOJIS_PER_ROW) {
        rows.push(displayedEmojis.slice(i, i + EMOJIS_PER_ROW));
      }
      return rows;
    }, [displayedEmojis]);

    const renderEmojiItem = useCallback(
      ({ item }: { item: string[] }) => (
        <View style={{ flexDirection: 'row' }}>
          {item.map((emoji) => (
            <EmojiItem
              key={emoji}
              emoji={emoji}
              isSelected={selectedEmoji === emoji}
              onPress={() => onEmojiSelect(emoji)}
            />
          ))}
        </View>
      ),
      [selectedEmoji, onEmojiSelect]
    );

    if (displayedEmojis.length === 0) {
      return (
        <View className='flex-1 items-center justify-center bg-white'>
          <Search color='#78716c' size={iconSizes.xxl} />
          <Text className='mt-3 text-base font-medium' style={{ color: colors.text.primary }}>
            No emojis found
          </Text>
          <Text className='mt-1 text-sm' style={{ color: colors.text.secondary }}>
            Try a different search term
          </Text>
        </View>
      );
    }

    return (
      <View className='flex-1 bg-white'>
        {isSearching ? null : <View className='px-4 pb-2 pt-3'>
            <Text className='text-xs font-semibold uppercase tracking-wider' style={{ color: colors.text.secondary }}>
              {categoryName}
            </Text>
          </View>}
        <FlatList
          removeClippedSubviews
          showsVerticalScrollIndicator
          contentContainerStyle={{
            paddingBottom: 16,
            paddingHorizontal: 8,
          }}
          data={emojiRows}
          initialNumToRender={10}
          keyExtractor={(_, index) => `row-${index}`}
          maxToRenderPerBatch={10}
          renderItem={renderEmojiItem}
          windowSize={5}
        />
      </View>
    );
  }
);

EmojiGrid.displayName = 'EmojiGrid';
