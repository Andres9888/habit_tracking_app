/**
 * EmojiBox - Pressable emoji button for InlineEmojiInput
 */

import { Animated, Text, Pressable } from 'react-native';

interface EmojiBoxProps {
  displayEmoji: string;
  isDefaultEmoji: boolean;
  color: string;
  emojiScale: Animated.Value;
  emojiBoxScale: Animated.Value;
  onPress: () => void;
  onPressIn: () => void;
  onPressOut: () => void;
}

export function EmojiBox({
  displayEmoji,
  isDefaultEmoji,
  color,
  emojiScale,
  emojiBoxScale,
  onPress,
  onPressIn,
  onPressOut,
}: EmojiBoxProps) {
  return (
    <Animated.View
      className='absolute left-3 top-1/2 z-10'
      style={{ transform: [{ translateY: -20 }, { scale: emojiBoxScale }] }}
    >
      <Pressable
        accessibilityHint='Opens emoji picker'
        accessibilityLabel='Choose habit icon'
        accessibilityRole='button'
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        <Animated.View
          className='h-10 w-10 items-center justify-center rounded-xl'
          style={{
            backgroundColor: isDefaultEmoji ? '#f5f5f4' : `${color}30`,
            transform: [{ scale: emojiScale }],
          }}
        >
          <Text
            className='text-xl'
            style={{ opacity: isDefaultEmoji ? 0.4 : 1 }}
          >
            {displayEmoji}
          </Text>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}
