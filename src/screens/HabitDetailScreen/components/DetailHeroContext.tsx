/** DetailHeroContext - One-line motivational note under the habit name. */
import { Text } from 'react-native';
import { useThemeColors } from '../../../theme';
import { fontWeights, typography } from '../../../theme/typography';
import { getHeroContext, type HeroContextInput } from './DetailHeroContext.utils';

interface DetailHeroContextProps extends HeroContextInput {
  /** Appended as "· best N" to the plain ongoing-streak line only — the
   *  goal/milestone lines already carry their own single clear note. */
  bestStreak?: number;
}

export function DetailHeroContext(props: DetailHeroContextProps) {
  const { colors } = useThemeColors();
  const ctx = getHeroContext(props);
  if (!ctx) return null;

  // Amber/gold for streaks and milestone celebrations; green only for goal progress.
  const useStreakColor = ctx.tone !== 'goal' || ctx.milestone === true;
  const textColor = useStreakColor
    ? colors.status.streakText
    : colors.status.success;
  const currentStreak = props.currentStreak ?? 0;
  const bestStreak = props.bestStreak ?? 0;
  // Only the plain ongoing-streak line gets a "· best N" suffix — the
  // personal-best line already says "Longest streak yet" (current === best),
  // and goal/milestone lines carry their own single clear note.
  const showBest =
    ctx.tone === 'streak' &&
    !ctx.milestone &&
    bestStreak > 0 &&
    currentStreak < bestStreak;

  return (
    <Text
      accessibilityRole='text'
      numberOfLines={1}
      style={{
        ...typography.bodySmall,
        color: textColor,
        fontWeight: fontWeights.semibold,
        marginTop: 2,
      }}
    >
      {ctx.emoji} {ctx.text}
      {showBest ? ` · best ${bestStreak}` : ''}
    </Text>
  );
}
