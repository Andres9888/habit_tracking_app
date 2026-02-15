/**
 * EmojiGrid Component
 * Displays emojis in 5-4 triangle layout with animations
 */

import { View } from 'react-native';

import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from 'react-native-reanimated';

import { EmojiChip } from './EmojiChip';

interface EmojiGridProps {
  suggestedEmojis: string[];
  selectedEmoji: string | null;
  reduceMotion: boolean;
  onEmojiSelect: (emoji: string) => void;
}

const layoutTransition = LinearTransition.springify()
  .damping(15)
  .stiffness(120);

export function EmojiGrid({
  suggestedEmojis,
  selectedEmoji,
  reduceMotion,
  onEmojiSelect,
}: EmojiGridProps) {
  return (
    <View className='items-center'>
      {/* Row 1: First 5 emojis */}
      <Animated.View
        className='flex-row justify-center'
        layout={layoutTransition}
      >
        {suggestedEmojis.slice(0, 5).map((emoji) => (
          <Animated.View
            key={emoji}
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(150)}
            layout={layoutTransition}
          >
            <EmojiChip
              emoji={emoji}
              isSelected={selectedEmoji === emoji}
              reduceMotion={reduceMotion}
              onPress={() => onEmojiSelect(emoji)}
            />
          </Animated.View>
        ))}
      </Animated.View>

      {/* Row 2: Last 4 emojis */}
      <Animated.View
        className='flex-row justify-center'
        layout={layoutTransition}
      >
        {suggestedEmojis.slice(5, 9).map((emoji) => (
          <Animated.View
            key={emoji}
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(150)}
            layout={layoutTransition}
          >
            <EmojiChip
              emoji={emoji}
              isSelected={selectedEmoji === emoji}
              reduceMotion={reduceMotion}
              onPress={() => onEmojiSelect(emoji)}
            />
          </Animated.View>
        ))}
      </Animated.View>
    </View>
  );
}
