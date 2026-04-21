/**
 * GoalWhyAnchor — Surfaces the user's own motivation above the goal card.
 * Renders nothing when no why / identity / woopWish is set.
 */
import { Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { typography, fontWeights } from '../../../../theme/typography';
import type { Habit } from '../../../../features/habits/types';
import { useResolveWhy } from './GoalWhyAnchor.hooks';

interface GoalWhyAnchorProps {
  habit: Habit;
}

export function GoalWhyAnchor({ habit }: GoalWhyAnchorProps) {
  const resolved = useResolveWhy(habit);
  if (resolved === null) return null;

  return (
    <Animated.View
      accessibilityLabel={`${resolved.label}: ${resolved.value}`}
      accessibilityRole='summary'
      className='mx-0 mb-3 flex-row items-start gap-3 rounded-2xl px-4 py-3.5'
      entering={FadeInDown.duration(260).springify().damping(22)}
      style={{
        backgroundColor: '#FFF5E8',
        borderColor: '#FED7AA',
        borderWidth: 1,
      }}
    >
      <View
        className='h-9 w-9 items-center justify-center rounded-lg'
        style={{ backgroundColor: '#FFFFFF' }}
      >
        <Text style={{ fontSize: 18 }}>{resolved.icon}</Text>
      </View>
      <View className='flex-1'>
        <Text
          style={{
            ...typography.caption,
            color: '#B45309',
            fontWeight: fontWeights.bold,
            letterSpacing: 0.6,
            textTransform: 'uppercase',
          }}
        >
          {resolved.label}
        </Text>
        <Text
          className='mt-0.5'
          style={{
            ...typography.bodySmall,
            color: '#44312A',
            fontFamily: 'Literata',
            fontSize: 15,
            fontStyle: 'italic',
            lineHeight: 21,
          }}
        >
          “{resolved.value}”
        </Text>
      </View>
    </Animated.View>
  );
}
