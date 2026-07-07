/**
 * MilestoneBeat — one calm line that appears below the Complete button when
 * today's completion lands the streak on a round-number milestone (7/30/100/365).
 * Quiet FadeIn, never a modal/burst (honors the premium-not-cheap, calm-fade
 * invariant). Renders nothing on every other day.
 */
import Animated, { FadeIn } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme';
import { durations, enterEasing } from '../../../theme/animations';
import { spacing } from '../../../theme/spacing';
import { fontWeights, typography } from '../../../theme/typography';
import { useReduceMotion } from '../../../hooks/useReduceMotion';
import { milestoneMessage } from '../../../constants/milestones';

interface MilestoneBeatProps {
  currentStreak: number;
  isCompletedToday: boolean;
}

export function MilestoneBeat({
  currentStreak,
  isCompletedToday,
}: MilestoneBeatProps) {
  const { colors } = useThemeColors();
  const reduceMotion = useReduceMotion();

  if (!isCompletedToday) return null;
  const message = milestoneMessage(currentStreak);
  if (!message) return null;

  return (
    <Animated.Text
      accessibilityRole='text'
      entering={
        reduceMotion
          ? undefined
          : FadeIn.duration(durations.standard).easing(enterEasing)
      }
      style={{
        ...typography.caption,
        color: colors.status.streakText,
        fontWeight: fontWeights.semibold,
        marginHorizontal: spacing.base + spacing.xs,
        marginTop: spacing.sm,
        textAlign: 'center',
      }}
    >
      {message}
    </Animated.Text>
  );
}
