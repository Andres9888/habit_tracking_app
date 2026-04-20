import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

import { useThemeColors } from '@/theme';

import { useSwipeCardGesture } from './useSwipeCardGesture';

interface Props {
  children: ReactNode;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  dismissLabel?: string;
  acceptLabel?: string;
}

export function SwipeCard({
  children,
  onSwipeLeft,
  onSwipeRight,
  dismissLabel = "That's not me",
  acceptLabel = "Yep, that's me",
}: Props) {
  const { colors } = useThemeColors();
  const { panGesture, cardStyle, swipeLeft, swipeRight } = useSwipeCardGesture({
    onSwipeLeft,
    onSwipeRight,
  });

  return (
    <View style={{ alignItems: 'center', gap: 24 }}>
      <GestureDetector gesture={panGesture}>
        <Animated.View
          accessibilityRole='adjustable'
          style={[
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderRadius: 18,
              borderWidth: 1,
              minHeight: 240,
              padding: 28,
              width: '100%',
            },
            cardStyle,
          ]}
        >
          {children}
        </Animated.View>
      </GestureDetector>
      <View style={{ flexDirection: 'row', gap: 16 }}>
        <Pressable
          accessibilityLabel={dismissLabel}
          accessibilityRole='button'
          hitSlop={12}
          style={({ pressed }) => ({
            alignItems: 'center',
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderRadius: 999,
            borderWidth: 1,
            height: 56,
            justifyContent: 'center',
            opacity: pressed ? 0.85 : 1,
            width: 56,
          })}
          onPress={swipeLeft}
        >
          <Text style={{ color: colors.text.secondary, fontSize: 22 }}>✗</Text>
        </Pressable>
        <Pressable
          accessibilityLabel={acceptLabel}
          accessibilityRole='button'
          hitSlop={12}
          style={({ pressed }) => ({
            alignItems: 'center',
            backgroundColor: colors.primary[600],
            borderRadius: 999,
            height: 56,
            justifyContent: 'center',
            opacity: pressed ? 0.85 : 1,
            width: 56,
          })}
          onPress={swipeRight}
        >
          <Text style={{ color: colors.text.inverse, fontSize: 22 }}>✓</Text>
        </Pressable>
      </View>
    </View>
  );
}
