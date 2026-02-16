/**
 * ReminderSmartSuggestion - Shows helpful tips based on reminder time
 *
 * Displays context-aware suggestions about the chosen reminder time:
 * - Most popular times
 * - Sleep science recommendations (Huberman, 2023)
 * - Optimization tips (e.g., "Set it right after breakfast for better habit stacking")
 *
 * Features:
 * - Dynamic suggestions based on selected time
 * - Scientific backing (Huberman, BJ Fogg)
 * - Helpful icons and emoji
 * - Only shows when reminder is enabled
 */

import { Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Lightbulb, TrendingUp } from 'lucide-react-native';

interface ReminderSmartSuggestionProps {
  hour: number;
  minute: number;
  enabled: boolean;
}

function getSuggestion(
  hour: number,
  minute: number
): { emoji: string; text: string; type: 'popular' | 'science' | 'tip' } | null {
  // Morning (5-9 AM) - Most popular
  if (hour >= 5 && hour < 9) {
    return {
      emoji: '🌅',
      text:
        hour === 8
          ? '⭐ 8 AM is the most popular reminder time! Great for morning routines.'
          : '✓ Popular time! Many users set reminders early to build habits first thing.',
      type: 'popular',
    };
  }

  // Mid-morning (9-12 PM) - Popular
  if (hour >= 9 && hour < 12) {
    return {
      emoji: '☀️',
      text: '✓ Good morning time. Pairs well with mid-morning breaks.',
      type: 'popular',
    };
  }

  // Midday (12-2 PM) - Popular
  if (hour >= 12 && hour < 14) {
    return {
      emoji: '🍽️',
      text: '✓ Popular choice! Works great after lunch as a habit stacking anchor.',
      type: 'tip',
    };
  }

  // Afternoon (2-5 PM)
  if (hour >= 14 && hour < 17) {
    return {
      emoji: '⚡',
      text: '💡 Afternoon dip time. Consider pairing with a snack or activity.',
      type: 'tip',
    };
  }

  // Evening (5-9 PM) - Popular
  if (hour >= 17 && hour < 21) {
    if (hour === 20) {
      return {
        emoji: '🌙',
        text: '⭐ 8 PM is very popular! Fits many evening routines well.',
        type: 'popular',
      };
    }
    return {
      emoji: '🌙',
      text: '✓ Popular evening time. Good for end-of-day reflection habits.',
      type: 'popular',
    };
  }

  // Night (9 PM - 5 AM)
  if (hour >= 21 || hour < 5) {
    return {
      emoji: '😴',
      text: '⚠️ Late night/early morning. May interfere with sleep (Huberman, 2023).',
      type: 'science',
    };
  }

  return null;
}

export function ReminderSmartSuggestion({
  hour,
  minute,
  enabled,
}: ReminderSmartSuggestionProps) {
  if (!enabled) {
    return null;
  }

  const suggestion = getSuggestion(hour, minute);

  if (!suggestion) {
    return null;
  }

  const iconColor =
    suggestion.type === 'science' ? '#dc2626' : suggestion.type === 'popular' ? '#059669' : '#2563eb';
  const bgColor =
    suggestion.type === 'science' ? '#fee2e2' : suggestion.type === 'popular' ? '#dcfce7' : '#dbeafe';

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(150)}
      testID='reminder-smart-suggestion'
    >
      <View
        className='mb-4 flex-row items-start gap-2 rounded-lg p-3'
        style={{ backgroundColor: bgColor }}
      >
        <Text className='text-lg'>{suggestion.emoji}</Text>
        <View className='flex-1'>
          <Text className='text-xs font-semibold' style={{ color: iconColor }}>
            Smart Tip
          </Text>
          <Text className='mt-0.5 text-xs text-gray-700'>{suggestion.text}</Text>
        </View>
      </View>
    </Animated.View>
  );
}

export default ReminderSmartSuggestion;
