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
  ({ emojis, selectedEmoji, onEmojiSelect, categoryName, showCategoryHeader = true }: EmojiGridProps) => {
    const { flatListRef, emojiRows, keyExtractor, getItemLayout } = useEmojiGrid(emojis);

    const renderRow = useCallback(
      ({ item }: ListRenderItemInfo<string[]>) => (
        <EmojiRow emojis={item} selectedEmoji={selectedEmoji} onEmojiSelect={onEmojiSelect} />
      ),
      [selectedEmoji, onEmojiSelect]
    );

    if (emojis.length === 0) {
      return <EmptyState />;
    }

    return (
      <View style={styles.container}>
        {showCategoryHeader && categoryName && (
          <View style={styles.categoryHeader}>
            <Text style={styles.categoryHeaderText}>{categoryName}</Text>
          </View>
        )}

        <FlatList
          ref={flatListRef}
          data={emojiRows}
          keyExtractor={keyExtractor}
          renderItem={renderRow}
          contentContainerStyle={styles.gridContent}
          showsVerticalScrollIndicator
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews
          getItemLayout={getItemLayout}
          maintainVisibleContentPosition={{ minIndexForVisible: 0 }}
        />
      </View>
    );
  }
);

EmojiGrid.displayName = 'EmojiGrid';
