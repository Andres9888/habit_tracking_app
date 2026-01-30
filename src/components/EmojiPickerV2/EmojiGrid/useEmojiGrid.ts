import { useCallback, useMemo, useRef } from 'react';
import type { FlatList, ListRenderItemInfo } from 'react-native';

import { EMOJIS_PER_ROW } from './types';

/**
 * Custom hook for EmojiGrid logic
 * Handles emoji grouping and FlatList optimizations
 */
export function useEmojiGrid(emojis: string[]) {
  const flatListRef = useRef<FlatList>(null);

  // Group emojis into rows
  const emojiRows = useMemo(() => {
    const rows: string[][] = [];
    for (let i = 0; i < emojis.length; i += EMOJIS_PER_ROW) {
      rows.push(emojis.slice(i, i + EMOJIS_PER_ROW));
    }
    return rows;
  }, [emojis]);

  const keyExtractor = useCallback((_: string[], index: number) => `emoji-row-${index}`, []);

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
