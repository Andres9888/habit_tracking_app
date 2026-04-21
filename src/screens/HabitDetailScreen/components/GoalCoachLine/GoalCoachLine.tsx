/**
 * GoalCoachLine — One-line state-aware encouragement below the ring.
 */
import { Text } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { typography, fontWeights } from '../../../../theme/typography';
import { useCoachMessage } from './GoalCoachLine.hooks';
import type { CoachTone } from './GoalCoachLine.hooks';

interface GoalCoachLineProps {
  currentStreak: number;
  streakGoal: number;
  bestStreak: number;
}

function toneColors(tone: CoachTone) {
  if (tone === 'done') {
    return { bg: '#E7F6EE', border: '#A7D9BE', text: '#0F5E2C' };
  }
  if (tone === 'reset') {
    return { bg: '#FFF1EE', border: '#FCD7CD', text: '#9A2C1A' };
  }
  if (tone === 'home') {
    return { bg: '#FFE8DE', border: '#F9B894', text: '#7A2E0A' };
  }
  return { bg: '#FFF8EE', border: '#FDE4BD', text: '#7C3F0A' };
}

export function GoalCoachLine({
  currentStreak,
  streakGoal,
  bestStreak,
}: GoalCoachLineProps) {
  const coach = useCoachMessage({ bestStreak, currentStreak, streakGoal });
  const palette = toneColors(coach.tone);

  return (
    <Animated.View
      accessibilityLabel={`Coach: ${coach.message}`}
      accessibilityRole='text'
      className='mt-3 flex-row items-center gap-2.5 rounded-xl px-3.5 py-2.5'
      entering={FadeIn.duration(220)}
      style={{
        backgroundColor: palette.bg,
        borderColor: palette.border,
        borderWidth: 1,
      }}
    >
      <Text style={{ fontSize: 18 }}>{coach.emoji}</Text>
      <Text
        className='flex-1'
        style={{
          ...typography.bodySmall,
          color: palette.text,
          fontWeight: fontWeights.medium,
        }}
      >
        {coach.message}
      </Text>
    </Animated.View>
  );
}
