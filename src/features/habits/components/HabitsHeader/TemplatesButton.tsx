import React from 'react';
import { Pressable, View } from 'react-native';
import { BookOpen } from 'lucide-react-native';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';
import { NotificationBadge } from '../../../../components/NotificationBadge';
import type { ViewStyle } from 'react-native';

interface TemplatesButtonProps {
  animatedStyle: AnimatedStyle<ViewStyle>;
  showBadge: boolean;
  isDark: boolean;
  violetColor: string;
  onPress: () => void;
  onPressIn: () => void;
  onPressOut: () => void;
}

export function TemplatesButton({
  animatedStyle,
  showBadge,
  isDark,
  violetColor,
  onPress,
  onPressIn,
  onPressOut,
}: TemplatesButtonProps) {
  return (
    <Animated.View style={animatedStyle}>
      <View style={{ position: 'relative' }}>
        <Pressable
          accessibilityHint='Browse habit templates to add'
          accessibilityLabel='Browse habit templates'
          accessibilityRole='button'
          className='h-11 w-11 items-center justify-center rounded-full bg-violet-50'
          style={({ pressed }) => ({
            backgroundColor: pressed
              ? 'rgba(139, 92, 246, 0.15)'
              : 'rgba(139, 92, 246, 0.08)',
          })}
          onPress={onPress}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
        >
          <BookOpen
            color={violetColor}
            size={18}
            strokeWidth={2.25}
          />
        </Pressable>
        <NotificationBadge count={1} visible={showBadge} />
      </View>
    </Animated.View>
  );
}
