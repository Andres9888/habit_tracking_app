import { memo, useCallback } from 'react';
import { FlatList, View, Text, type ListRenderItemInfo } from 'react-native';

import { EmojiRow } from './EmojiRow';
import { EmptyState } from './EmptyState';
import { styles } from './styles';
import type { EmojiGridProps } from './types';
import { useEmojiGrid } from './useEmojiGrid';

/**
 * EmojiGrid - A virtualized 6-column emoji grid with press animations
 *
 * Features:
 * - 6-column responsive layout
 * - Virtualized FlatList for performance
 * - Press animations (scale 0.92 on press, bounce on release)
 * - Selection state with blue ring
 * - Optional category header
 */
export const EmojiGrid = memo(
  ({
    emojis,
    selectedEmoji,
    onEmojiSelect,
    categoryName,
    showCategoryHeader = true,
  }: EmojiGridProps) => {
    const { flatListRef, emojiRows, keyExtractor, getItemLayout } =
      useEmojiGrid(emojis, selectedEmoji);

    const renderRow = useCallback(
      ({ item }: ListRenderItemInfo<string[]>) => (
        <EmojiRow
          emojis={item}
          selectedEmoji={selectedEmoji}
          onEmojiSelect={onEmojiSelect}
        />
      ),
      [selectedEmoji, onEmojiSelect]
    );

    if (emojis.length === 0) {
      return <EmptyState />;
    }

    return (
      <View style={styles.container}>
        {showCategoryHeader && categoryName ? <View style={styles.categoryHeader}>
            <Text style={styles.categoryHeaderText}>{categoryName}</Text>
          </View> : null}

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
