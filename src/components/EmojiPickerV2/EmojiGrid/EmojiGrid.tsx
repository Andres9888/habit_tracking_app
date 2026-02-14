import { memo, useCallback } from 'react';
import { FlatList, View, Text, type ListRenderItemInfo } from 'react-native';

import { EmojiRow } from './EmojiRow';
import { EmptyState } from './EmptyState';
import { styles } from './styles';
import type { EmojiGridProps } from './types';
import { useEmojiGrid } from './useEmojiGrid';

/**
 * EmojiGrid - A virtualized 6-column emoji grid with press animations
 * Theme-aware with dark mode support
 */
export const EmojiGrid = memo(
  ({
    emojis,
    selectedEmoji,
    onEmojiSelect,
    categoryName,
    showCategoryHeader = true,
    themeColors,
  }: EmojiGridProps) => {
    const { flatListRef, emojiRows, keyExtractor, getItemLayout } =
      useEmojiGrid(emojis, selectedEmoji);

    const renderRow = useCallback(
      ({ item }: ListRenderItemInfo<string[]>) => (
        <EmojiRow
          emojis={item}
          selectedEmoji={selectedEmoji}
          themeColors={themeColors}
          onEmojiSelect={onEmojiSelect}
        />
      ),
      [selectedEmoji, onEmojiSelect, themeColors]
    );

    if (emojis.length === 0) {
      return <EmptyState themeColors={themeColors} />;
    }

    return (
      <View
        style={[
          styles.container,
          themeColors && { backgroundColor: themeColors.surface },
        ]}
      >
        {showCategoryHeader && categoryName && (
          <View style={styles.categoryHeader}>
            <Text
              style={[
                styles.categoryHeaderText,
                themeColors && { color: themeColors.gray[500] },
              ]}
            >
              {categoryName}
            </Text>
          </View>
        )}

        <FlatList
          ref={flatListRef}
          removeClippedSubviews
          showsVerticalScrollIndicator
          contentContainerStyle={styles.gridContent}
          data={emojiRows}
          getItemLayout={getItemLayout}
          initialNumToRender={10}
          keyExtractor={keyExtractor}
          maintainVisibleContentPosition={{ minIndexForVisible: 0 }}
          maxToRenderPerBatch={10}
          renderItem={renderRow}
          windowSize={5}
        />
      </View>
    );
  }
);

EmojiGrid.displayName = 'EmojiGrid';
