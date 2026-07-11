/**
 * DetailHeroMomentum — the calm context under the streak hero: a celebratory
 * "Personal best" pill (an achievement, never a "N to beat" target) and the
 * total-completions count folded into an encouragement sentence.
 */
import { Trophy } from 'lucide-react-native';
import { Text, View } from 'react-native';
import { useThemeColors } from '../../../theme';
import { borderRadius, spacing } from '../../../theme/spacing';
import { typography, fontWeights } from '../../../theme/typography';
import { MAX_FONT_SIZE_MULTIPLIER_STRICT } from '../../../utils/accessibility/textScaling';
import { isRebuilding } from './DetailHeroStreakHero';

interface DetailHeroMomentumProps {
  bestStreak: number;
  currentStreak: number;
  totalCompletions: number;
}

export function DetailHeroMomentum({
  bestStreak,
  currentStreak,
  totalCompletions,
}: DetailHeroMomentumProps) {
  const { colors } = useThemeColors();
  const showPill = bestStreak > 0;
  const showEncouragement = totalCompletions > 0;
  if (!showPill && !showEncouragement) return null;

  const bestDays = bestStreak === 1 ? 'day' : 'days';
  const times = totalCompletions === 1 ? 'time' : 'times';

  return (
    <View className='items-center' style={{ marginTop: spacing.md }}>
      {showPill ? (
        <View
          className='flex-row items-center'
          style={{
            backgroundColor: colors.status.streakLight,
            borderRadius: borderRadius.full,
            gap: spacing.sm,
            paddingHorizontal: spacing.base,
            paddingVertical: spacing.sm,
          }}
        >
          <Trophy color={colors.status.streakText} size={14} strokeWidth={2.4} />
          <Text
            maxFontSizeMultiplier={MAX_FONT_SIZE_MULTIPLIER_STRICT}
            style={{
              ...typography.bodySmall,
              color: colors.status.streakText,
              fontWeight: fontWeights.bold,
            }}
          >
            Personal best · {bestStreak} {bestDays}
          </Text>
        </View>
      ) : null}
      {showEncouragement ? (
        <Text
          style={{
            ...typography.caption,
            color: colors.text.secondary,
            marginTop: showPill ? spacing.md : 0,
            textAlign: 'center',
          }}
        >
          You&apos;ve shown up{' '}
          <Text style={{ color: colors.text.primary, fontWeight: fontWeights.bold }}>
            {totalCompletions} {times}
          </Text>{' '}
          for this.
          {isRebuilding(currentStreak, bestStreak)
            ? '\nThe chain always starts again.'
            : ''}
        </Text>
      ) : null}
    </View>
  );
}
