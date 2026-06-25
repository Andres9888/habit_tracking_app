/**
 * GoalCoachLine — One-line state-aware encouragement below the ring.
 */
import { Text } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { colors } from '../../../../theme/colors';
import { typography, fontWeights } from '../../../../theme/typography';
import { useCoachMessage } from './GoalCoachLine.hooks';
import type { CoachTone } from './GoalCoachLine.hooks';

interface GoalCoachLineProps {
  currentStreak: number;
  streakGoal: number;
  bestStreak: number;
}

function toneColors(tone: CoachTone) {
  if (tone === 'done') return colors.tone.green;
  if (tone === 'reset') return colors.tone.red;
  if (tone === 'home') return colors.tone.orange;
  return colors.tone.yellow;
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
      className='mt-3 flex-row items-center gap-2.5 rounded-[14px] px-3.5 py-2.5'
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
