/** DetailHeroContext - Small pill that surfaces the habit's most notable fact. */
import { Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme';
import { borderRadius, spacing } from '../../../theme/spacing';
import { fontWeights, typography } from '../../../theme/typography';
import { getHeroContext, type HeroContextInput } from './DetailHeroContext.utils';

export function DetailHeroContext(props: HeroContextInput) {
  const { colors } = useThemeColors();
  const ctx = getHeroContext(props);
  if (!ctx) return null;

  // Amber/gold for streaks and milestone celebrations; green only for goal progress.
  const useStreakColor = ctx.tone !== 'goal' || ctx.milestone === true;
  const backgroundColor = useStreakColor
    ? colors.status.streakLight
    : colors.status.successLight;
  const textColor = useStreakColor
    ? colors.status.streakText
    : colors.status.successText;

  return (
    <Animated.View
      accessibilityLabel={ctx.text}
      accessibilityRole='text'
      entering={FadeIn.duration(220)}
      style={{
        alignItems: 'center',
        backgroundColor,
        borderRadius: borderRadius.full,
        flexDirection: 'row',
        gap: 6,
        marginTop: spacing.sm,
        paddingHorizontal: spacing.md,
        paddingVertical: 6,
      }}
    >
      <Text style={{ fontSize: 13 }}>{ctx.emoji}</Text>
      <Text
        style={{
          ...typography.caption,
          color: textColor,
          fontWeight: fontWeights.semibold,
          letterSpacing: 0,
        }}
      >
        {ctx.text}
      </Text>
    </Animated.View>
  );
}
