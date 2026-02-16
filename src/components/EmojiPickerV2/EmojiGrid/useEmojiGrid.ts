import { useCallback, useMemo, useRef } from 'react';
import type { FlatList } from 'react-native';

import { EMOJIS_PER_ROW } from './types';

/**
 * Custom hook for EmojiGrid logic
 * Handles emoji grouping and FlatList optimizations
 */
export function useEmojiGrid(emojis: string[], selectedEmoji?: string | null) {
  const flatListRef = useRef<FlatList>(null);

  // Inject selected emoji into the middle if not already in the list
  const emojisWithSelection = useMemo(() => {
    if (!selectedEmoji || emojis.includes(selectedEmoji)) return emojis;
    const midIndex = Math.floor(emojis.length / 2);
    return [
      ...emojis.slice(0, midIndex),
      selectedEmoji,
      ...emojis.slice(midIndex),
    ];
  }, [emojis, selectedEmoji]);

  // Group emojis into rows
  const emojiRows = useMemo(() => {
    const rows: string[][] = [];
    for (let i = 0; i < emojisWithSelection.length; i += EMOJIS_PER_ROW) {
      rows.push(emojisWithSelection.slice(i, i + EMOJIS_PER_ROW));
    }
    return rows;
  }, [emojisWithSelection]);

  const keyExtractor = useCallback(
    (_: string[], index: number) => `emoji-row-${index}`,
    []
  );

  const getItemLayout = useCallback(
    (_: ArrayLike<string[]> | null | undefined, index: number) => ({
      index,
      length: 56, // Row height (cell + gap)
      offset: 56 * index,
    }),
    []
  );

  return {
    emojiRows,
    flatListRef,
    getItemLayout,
    keyExtractor,
  };
}
