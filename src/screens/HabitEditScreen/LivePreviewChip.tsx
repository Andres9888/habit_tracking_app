/**
 * LivePreviewChip Component
 *
 * Shows a live preview of the habit being edited with emoji and name.
 * Provides immediate visual feedback as the user makes changes.
 */

import { View, Text } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

interface LivePreviewChipProps {
  emoji: string | null;
  name: string;
  color: string;
}

export function LivePreviewChip({ emoji, name, color }: LivePreviewChipProps) {
  const displayName = name.trim() || 'Your habit';
  const displayEmoji = emoji || '✨';

  return (
    <Animated.View
      className='items-center'
      entering={FadeIn.duration(250).delay(50)}
      style={{ marginBottom: 16, marginTop: 24 }}
    >
      <Text
        className='mb-3 text-center text-[28px] font-bold text-stone-900'
        style={{ letterSpacing: -0.5 }}
      >
        Edit Habit
      </Text>

      <View
        className='flex-row items-center rounded-full px-4 py-2'
        style={{ backgroundColor: `${color}15` }}
      >
        <Text className='mr-2 text-xl'>{displayEmoji}</Text>
        <Text
          className='text-base font-medium'
          numberOfLines={1}
          style={{ color, maxWidth: 200 }}
        >
          {displayName}
        </Text>
      </View>
    </Animated.View>
  );
}
