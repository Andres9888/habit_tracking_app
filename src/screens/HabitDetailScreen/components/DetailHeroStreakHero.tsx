/**
 * DetailHeroStreakHero — path-to-best ring + flame + big numeral + caption.
 * Rebuilding streaks get calm framing (no fail against best).
 * "rebuilding" lives outside the ring so the long label never clips the 152pt circle.
 */
import { Flame } from 'lucide-react-native';
import { Text, View } from 'react-native';
import { useThemeColors } from '../../../theme';
import { spacing } from '../../../theme/spacing';
import { fontFamilies, fontWeights, typography } from '../../../theme/typography';
import { MAX_FONT_SIZE_MULTIPLIER_STRICT } from '../../../utils/accessibility/textScaling';
import { DetailHeroPathRing } from './DetailHeroPathRing';

const NUMERAL_SIZE = 52;

export function isRebuilding(currentStreak: number, bestStreak: number): boolean {
  return currentStreak <= 1 && bestStreak > currentStreak;
}

interface DetailHeroStreakHeroProps {
  bestStreak: number;
  currentStreak: number;
  glow?: boolean;
}

export function DetailHeroStreakHero({
  bestStreak,
  currentStreak,
  glow = false,
}: DetailHeroStreakHeroProps) {
  const { colors } = useThemeColors();
  const rebuilding = isRebuilding(currentStreak, bestStreak);

  return (
    <View className='items-center' style={{ paddingTop: spacing.sm }}>
      <DetailHeroPathRing
        bestStreak={bestStreak}
        currentStreak={currentStreak}
        glow={glow}
      >
        <Flame color={colors.status.streak} size={26} strokeWidth={1.7} />
        <Text
          maxFontSizeMultiplier={MAX_FONT_SIZE_MULTIPLIER_STRICT}
          style={{
            color: colors.text.primary,
            fontFamily: fontFamilies.primary.display,
            fontSize: NUMERAL_SIZE,
            fontWeight: fontWeights.bold,
            letterSpacing: -1.5,
            lineHeight: NUMERAL_SIZE + 2,
            marginTop: 2,
          }}
        >
          {currentStreak}
        </Text>
        <Text
          maxFontSizeMultiplier={MAX_FONT_SIZE_MULTIPLIER_STRICT}
          style={{
            ...typography.bodySmall,
            color: colors.text.secondary,
            fontWeight: fontWeights.semibold,
            marginTop: 2,
            textAlign: 'center',
          }}
        >
          day streak
        </Text>
      </DetailHeroPathRing>

      {rebuilding ? (
        <Text
          maxFontSizeMultiplier={MAX_FONT_SIZE_MULTIPLIER_STRICT}
          style={{
            color: colors.status.streak,
            fontSize: 12,
            fontWeight: fontWeights.bold,
            letterSpacing: 0.4,
            marginTop: spacing.sm,
            textAlign: 'center',
            textTransform: 'uppercase',
          }}
        >
          rebuilding
        </Text>
      ) : null}

      <Text
        maxFontSizeMultiplier={MAX_FONT_SIZE_MULTIPLIER_STRICT}
        style={{
          color: colors.text.tertiary,
          fontSize: 12,
          fontWeight: fontWeights.semibold,
          letterSpacing: 0.12,
          marginTop: rebuilding ? spacing.xs : spacing.sm,
          textAlign: 'center',
        }}
      >
        {rebuilding ? (
          'Start fresh · path to best opens after day 2'
        ) : (
          <>
            Path to best ·{' '}
            <Text style={{ color: colors.status.streakText, fontWeight: fontWeights.bold }}>
              {currentStreak}
            </Text>
            {' / '}
            {Math.max(bestStreak, currentStreak, 1)}
          </>
        )}
      </Text>
    </View>
  );
}
