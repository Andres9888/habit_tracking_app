import { memo } from 'react';
import { View } from 'react-native';

import { EmojiCell } from './EmojiCell';
import { styles } from './styles';
import { EMOJIS_PER_ROW, type EmojiRowProps } from './types';

/**
 * Memoized emoji row component
 * PERF: Pass onEmojiSelect directly to cells to avoid creating inline handlers
 */
function EmojiRowComponent({ emojis, selectedEmoji, onEmojiSelect }: EmojiRowProps) {
  return (
    <View style={styles.emojiRow}>
      {emojis.map((emoji, index) => (
        <View key={`${emoji}-${index}`} style={styles.emojiCellWrapper}>
          <EmojiCell
            emoji={emoji}
            isSelected={selectedEmoji === emoji}
            onPress={onEmojiSelect}
          />
        </View>
      ))}
      {/* Fill remaining cells with empty placeholders to maintain grid */}
      {emojis.length < EMOJIS_PER_ROW &&
        Array.from({ length: EMOJIS_PER_ROW - emojis.length }).map((_, i) => (
          <View key={`placeholder-${i}`} style={styles.emojiCellWrapper}>
            <View style={styles.placeholderCell} />
          </View>
        ))}
    </View>
  );
}

export const EmojiRow = memo(EmojiRowComponent);

EmojiRow.displayName = 'EmojiRow';
