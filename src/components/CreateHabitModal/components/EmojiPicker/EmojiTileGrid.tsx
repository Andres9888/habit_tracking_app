/**
 * 5-column icon grid (spec §2): 9 suggested emojis + a dashed "+" tile.
 * Tiles are exact squares — the container width is measured on layout and
 * divided by 5 (gap 8), so tiles stay square on every device width.
 */
import { useCallback, useState } from 'react';
import { View, type LayoutChangeEvent } from 'react-native';
import { BrowseTile } from './BrowseTile';
import { EmojiChip } from './EmojiChip';

const GAP = 8;
const COLUMNS = 5;

interface EmojiTileGridProps {
  suggestedEmojis: string[];
  selectedEmoji: string | null;
  reduceMotion: boolean;
  onEmojiSelect: (emoji: string) => void;
  onBrowse: () => void;
}

export function EmojiTileGrid({
  suggestedEmojis,
  selectedEmoji,
  reduceMotion,
  onEmojiSelect,
  onBrowse,
}: EmojiTileGridProps) {
  const [width, setWidth] = useState(0);
  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    setWidth(e.nativeEvent.layout.width);
  }, []);
  const tile = width > 0 ? (width - GAP * (COLUMNS - 1)) / COLUMNS : 0;

  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: GAP,
        opacity: tile > 0 ? 1 : 0,
      }}
      testID='emoji-tile-grid'
      onLayout={handleLayout}
    >
      {suggestedEmojis.slice(0, 9).map((emoji) => (
        <EmojiChip
          key={emoji}
          emoji={emoji}
          isSelected={selectedEmoji === emoji}
          reduceMotion={reduceMotion}
          size={tile}
          onPress={() => onEmojiSelect(emoji)}
        />
      ))}
      <BrowseTile size={tile} onPress={onBrowse} />
    </View>
  );
}
