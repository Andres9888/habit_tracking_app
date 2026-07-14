/**
 * DetailHeroMomentum — Best / Total / 30-day cells + encouragement line (OD).
 */
import { Text, View } from 'react-native';
import { useThemeColors } from '../../../theme';
import { spacing } from '../../../theme/spacing';
import { fontWeights, typography } from '../../../theme/typography';
import { DetailHeroStatCell } from './DetailHeroStatCell';
import { isRebuilding } from './DetailHeroStreakHero';

interface DetailHeroMomentumProps {
  bestStreak: number;
  currentStreak: number;
  rate30Day: number;
  totalCompletions: number;
}

export function DetailHeroMomentum({
  bestStreak,
  currentStreak,
  rate30Day,
  totalCompletions,
}: DetailHeroMomentumProps) {
  const { colors } = useThemeColors();
  const rebuilding = isRebuilding(currentStreak, bestStreak);
  const times = totalCompletions === 1 ? 'time' : 'times';

  return (
    <View style={{ marginTop: spacing.sm }}>
      <View className='flex-row' style={{ gap: spacing.sm }}>
        <DetailHeroStatCell highlight label='Best' value={String(bestStreak)} />
        <DetailHeroStatCell label='Total' value={String(totalCompletions)} />
        <DetailHeroStatCell label='30-day' value={`${rate30Day}%`} />
      </View>

      {totalCompletions > 0 ? (
        <Text
          style={{
            ...typography.caption,
            color: colors.text.secondary,
            marginTop: spacing.md,
            textAlign: 'center',
          }}
        >
          You&apos;ve shown up{' '}
          <Text style={{ color: colors.text.primary, fontWeight: fontWeights.bold }}>
            {totalCompletions} {times}
          </Text>{' '}
          for this.
          {rebuilding ? '\nThe chain always starts again.' : ''}
        </Text>
      ) : (
        <Text
          style={{
            ...typography.caption,
            color: colors.text.secondary,
            marginTop: spacing.md,
            textAlign: 'center',
          }}
        >
          Your first check-in starts the chain.
        </Text>
      )}
    </View>
  );
}
