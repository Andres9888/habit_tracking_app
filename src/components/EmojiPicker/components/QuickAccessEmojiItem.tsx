import { memo, useCallback, useRef } from 'react';
import { Animated, Pressable, Text } from 'react-native';
import { shadows } from '../../../theme/spacing';
import { useThemeColors } from '../../../theme/ThemeContext';
import type { QuickAccessEmojiItemProps } from '../EmojiPicker.types';

export const QuickAccessEmojiItem = memo(
  ({
    emoji,
    isSelected,
    onPress,
    accessibilityLabelSuffix = '',
  }: QuickAccessEmojiItemProps) => {
    const { colors } = useThemeColors();
    const scaleAnim = useRef(new Animated.Value(isSelected ? 1.1 : 1)).current;

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

    const accessibilityLabel = accessibilityLabelSuffix
      ? `Select ${emoji} emoji ${accessibilityLabelSuffix}`
      : `Select ${emoji} emoji`;

    return (
      <Pressable
        accessibilityLabel={accessibilityLabel}
        accessibilityRole='button'
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.View
          style={[
            {
              ...shadows.subtle,
              alignItems: 'center',
              backgroundColor: isSelected ? '#f5f5f4' : 'white',
              borderColor: isSelected ? colors.borders.selected : 'transparent',
              borderRadius: 12,
              borderWidth: isSelected ? 2 : 0,
              height: 44,
              justifyContent: 'center',
              width: 44,
            },
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Text style={{ fontSize: 24 }}>{emoji}</Text>
        </Animated.View>
      </Pressable>
    );
  }
);

QuickAccessEmojiItem.displayName = 'QuickAccessEmojiItem';

// Alias for backward compatibility in tests
export const RecentEmojiItem = QuickAccessEmojiItem;
