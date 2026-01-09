import { memo, useCallback, useRef } from 'react';
import { Animated, Pressable, Text } from 'react-native';
import { EMOJIS_PER_ROW } from '../EmojiPicker.constants';
import type { EmojiItemProps } from '../EmojiPicker.types';

export const EmojiItem = memo(
  ({ emoji, isSelected, onPress }: EmojiItemProps) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = useCallback(() => {
      Animated.spring(scaleAnim, {
        bounciness: 4,
        speed: 50,
        toValue: 0.9,
        useNativeDriver: true,
      }).start();
    }, [scaleAnim]);

    const handlePressOut = useCallback(() => {
      Animated.spring(scaleAnim, {
        bounciness: 4,
        speed: 50,
        toValue: isSelected ? 1.1 : 1,
        useNativeDriver: true,
      }).start();
    }, [scaleAnim, isSelected]);

    return (
      <Pressable
        accessibilityLabel={`Select ${emoji} emoji`}
        accessibilityRole='button'
        style={{
          aspectRatio: 1,
          padding: 2,
          width: `${100 / EMOJIS_PER_ROW}%`,
        }}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.View
          style={[
            {
              alignItems: 'center',
              backgroundColor: isSelected ? '#f5f5f4' : '#fafaf9',
              borderColor: isSelected ? '#10b981' : 'transparent',
              borderRadius: 12,
              borderWidth: isSelected ? 2 : 0,
              flex: 1,
              justifyContent: 'center',
              minHeight: 44,
              minWidth: 44,
            },
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Text style={{ fontSize: 28 }}>{emoji}</Text>
        </Animated.View>
      </Pressable>
    );
  }
);

EmojiItem.displayName = 'EmojiItem';
