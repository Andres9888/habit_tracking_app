/**
 * DetailHeroStreakHero — the current streak as the card's centerpiece: flame,
 * one big serif numeral, and a calm sublabel. A recently-reset streak reads
 * "day streak · rebuilding" instead of being scored against best (the old
 * side-by-side band made 1-next-to-139 read as failure).
 */
import { Text, View } from 'react-native';
import { useThemeColors } from '../../../theme';
import { typography, fontFamilies, fontWeights } from '../../../theme/typography';
import { MAX_FONT_SIZE_MULTIPLIER_STRICT } from '../../../utils/accessibility/textScaling';

const NUMERAL_SIZE = 48;
const FLAME_SIZE = 32;

/**
 * Reset signal: streak history exists but the live streak is at 0 (just broke)
 * or 1 (first day back). Extends the goal section's `current === 0 && best > 0`
 * convention by one day so the first rebuilt day still gets the calm framing.
 */
export function isRebuilding(currentStreak: number, bestStreak: number): boolean {
  return currentStreak <= 1 && bestStreak > currentStreak;
}

interface DetailHeroStreakHeroProps {
  bestStreak: number;
  currentStreak: number;
}

export function DetailHeroStreakHero({
  bestStreak,
  currentStreak,
}: DetailHeroStreakHeroProps) {
  const { colors } = useThemeColors();
  const rebuilding = isRebuilding(currentStreak, bestStreak);
  const sublabel = rebuilding ? 'day streak · rebuilding' : 'day streak';

  return (
    <View
      accessibilityLabel={`${currentStreak}-day streak${rebuilding ? ', rebuilding' : ''}`}
      accessibilityRole='summary'
      className='items-center'
    >
      <Text
        maxFontSizeMultiplier={MAX_FONT_SIZE_MULTIPLIER_STRICT}
        style={{ fontSize: FLAME_SIZE, lineHeight: FLAME_SIZE + 6 }}
      >
        🔥
      </Text>
      <Text
        maxFontSizeMultiplier={MAX_FONT_SIZE_MULTIPLIER_STRICT}
        style={{
          color: colors.text.primary,
          fontFamily: fontFamilies.primary.display,
          fontSize: NUMERAL_SIZE,
          fontWeight: fontWeights.bold,
          lineHeight: NUMERAL_SIZE + 4,
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
          letterSpacing: 0.3,
          marginTop: 2,
        }}
      >
        {sublabel}
      </Text>
    </View>
  );
}
