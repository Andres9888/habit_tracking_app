/**
 * EmojiGrid Component
 * Displays emojis in 5-4 triangle layout. Chips appear and disappear with the
 * sheet — no layout transitions, no entrance fades. Each chip is in a fixed
 * 64x64 container so position swaps are key-based mounts, not reflows.
 */

import Animated, { FadeOut } from 'react-native-reanimated';
import { View } from 'react-native';
import { EmojiChip } from './EmojiChip';
import { durations } from '@/theme/animations';

interface EmojiGridProps {
  suggestedEmojis: string[];
  selectedEmoji: string | null;
  reduceMotion: boolean;
  onEmojiSelect: (emoji: string) => void;
}

export function EmojiGrid({
  suggestedEmojis,
  selectedEmoji,
  reduceMotion,
  onEmojiSelect,
}: EmojiGridProps) {
  return (
    <View className='items-center'>
      {/* Row 1: First 5 emojis */}
      <View
        className='flex-row justify-center'
        style={{ flexDirection: 'row', justifyContent: 'center' }}
      >
        {suggestedEmojis.slice(0, 5).map((emoji) => (
          <Animated.View
            key={emoji}
            exiting={FadeOut.duration(durations.quick)}
          >
            <EmojiChip
              emoji={emoji}
              isSelected={selectedEmoji === emoji}
              reduceMotion={reduceMotion}
              onPress={() => onEmojiSelect(emoji)}
            />
          </Animated.View>
        ))}
      </View>

      {/* Row 2: Last 4 emojis */}
      <View
        className='flex-row justify-center'
        style={{ flexDirection: 'row', justifyContent: 'center' }}
      >
        {suggestedEmojis.slice(5, 9).map((emoji) => (
          <Animated.View
            key={emoji}
            exiting={FadeOut.duration(durations.quick)}
          >
            <EmojiChip
              emoji={emoji}
              isSelected={selectedEmoji === emoji}
              reduceMotion={reduceMotion}
              onPress={() => onEmojiSelect(emoji)}
            />
          </Animated.View>
        ))}
      </View>
    </View>
  );
}
