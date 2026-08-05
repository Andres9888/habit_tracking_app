/* eslint-disable max-lines -- the chart, legend, caption, and disclosure are one visual */
/** DetailInsightsCard - Mock-parity weekly pattern, not a percentage dashboard. */
import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { ChevronDown } from 'lucide-react-native';
import { useThemeColors } from '../../../theme';
import { durations, enterEasing } from '../../../theme/animations';
import { colors as palette, withAlpha } from '../../../theme/colors';
import { borderRadius, shadows, spacing } from '../../../theme/spacing';
import { fontWeights, typography } from '../../../theme/typography';
import { DetailInsightsChart } from './DetailInsightsChart';
import { compareWeeks, computeWeekdayInsights } from './weekdayInsights';

interface DetailInsightsCardProps {
  completedDates: Set<string>;
  habitColor: string;
}

function labelList(labels: string[]): string {
  if (labels.length <= 1) return labels[0] ?? '';
  return `${labels.slice(0, -1).join(', ')} & ${labels.at(-1)}`;
}

export function DetailInsightsCard({
  completedDates,
  habitColor,
}: DetailInsightsCardProps) {
  const { colors, isDark } = useThemeColors();
  const [expanded, setExpanded] = useState(false);
  const insights = useMemo(
    () => computeWeekdayInsights(completedDates),
    [completedDates]
  );
  const comparison = useMemo(
    () => compareWeeks(completedDates),
    [completedDates]
  );
  if (insights.total < 1) return null;

  const goodDays = labelList(insights.goodLabels);
  const surface = isDark ? colors.card : palette.light.cardElevated;
  const hardColor = colors.status.error;

  return (
    <Animated.View
      entering={FadeIn.duration(durations.standard).easing(enterEasing)}
    >
      <Text
        style={{
          ...typography.overline,
          color: colors.primary[700],
          fontWeight: fontWeights.bold,
          marginBottom: spacing.sm,
          marginLeft: spacing.xs,
        }}
      >
        Insights
      </Text>

      <View
        style={{
          ...shadows.subtle,
          backgroundColor: surface,
          borderColor: colors.border,
          borderRadius: borderRadius.large,
          borderWidth: 1,
          paddingHorizontal: spacing.base,
          paddingVertical: spacing.base,
        }}
      >
        <View className='items-center' style={{ gap: spacing.sm }}>
          <Text
            accessibilityRole='header'
            style={{
              ...typography.bodyBold,
              color: colors.text.primary,
              fontSize: 18,
            }}
          >
            This week
          </Text>
          <View
            style={{
              backgroundColor: withAlpha(colors.primary[600], 0.09),
              borderRadius: borderRadius.full,
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.xs + 1,
            }}
          >
            <Text
              style={{
                ...typography.caption,
                color: colors.primary[700],
                fontWeight: fontWeights.semibold,
              }}
            >
              {comparison}
            </Text>
          </View>
        </View>

        <View style={{ marginTop: spacing.base }}>
          <DetailInsightsChart bars={insights.bars} habitColor={habitColor} />
        </View>

        <View
          className='flex-row flex-wrap justify-center'
          style={{ gap: spacing.sm, marginTop: spacing.base }}
        >
          <View
            className='flex-row items-center'
            style={{
              backgroundColor: withAlpha(habitColor, 0.1),
              borderRadius: borderRadius.full,
              gap: 6,
              paddingHorizontal: spacing.md,
              paddingVertical: 6,
            }}
          >
            <View
              style={{
                backgroundColor: habitColor,
                borderRadius: borderRadius.full,
                height: 8,
                width: 8,
              }}
            />
            <Text
              style={{
                ...typography.caption,
                color: colors.primary[700],
                fontWeight: fontWeights.semibold,
              }}
            >
              Good day · {goodDays}
            </Text>
          </View>
          {insights.hardLabel ? (
            <View
              className='flex-row items-center'
              style={{
                backgroundColor: withAlpha(hardColor, 0.09),
                borderRadius: borderRadius.full,
                gap: 6,
                paddingHorizontal: spacing.md,
                paddingVertical: 6,
              }}
            >
              <View
                style={{
                  backgroundColor: hardColor,
                  borderRadius: borderRadius.full,
                  height: 8,
                  width: 8,
                }}
              />
              <Text
                style={{
                  ...typography.caption,
                  color: hardColor,
                  fontWeight: fontWeights.semibold,
                }}
              >
                Harder day · {insights.hardLabel}
              </Text>
            </View>
          ) : null}
        </View>

        <Text
          style={{
            ...typography.bodySmall,
            color: colors.text.secondary,
            lineHeight: 21,
            marginTop: spacing.md,
            textAlign: 'center',
          }}
        >
          <Text
            style={{
              color: colors.text.primary,
              fontWeight: fontWeights.semibold,
            }}
          >
            Good {insights.goodLabels.length === 1 ? 'day' : 'days'}:
          </Text>{' '}
          {goodDays}.
          {insights.hardLabel ? (
            <>
              {' '}
              <Text
                style={{
                  color: colors.text.primary,
                  fontWeight: fontWeights.semibold,
                }}
              >
                Harder day:
              </Text>{' '}
              {insights.hardLabel} — protect that one.
            </>
          ) : (
            ' More history will reveal your harder day.'
          )}
        </Text>
      </View>

      <Pressable
        accessibilityRole='button'
        accessibilityState={{ expanded }}
        className='flex-row items-center'
        hitSlop={6}
        style={{ gap: 4, minHeight: 44, paddingHorizontal: spacing.xs }}
        onPress={() => setExpanded((value) => !value)}
      >
        <Text
          style={{
            ...typography.caption,
            color: colors.primary[700],
            fontWeight: fontWeights.bold,
          }}
        >
          {expanded ? 'Show fewer patterns' : 'See more patterns'}
        </Text>
        <ChevronDown
          color={colors.primary[700]}
          size={15}
          style={{ transform: [{ rotate: expanded ? '180deg' : '0deg' }] }}
        />
      </Pressable>

      {expanded ? (
        <View
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: borderRadius.medium,
            borderWidth: 1,
            padding: spacing.md,
          }}
        >
          <Text style={{ ...typography.overline, color: colors.text.tertiary }}>
            Week shape
          </Text>
          <Text
            style={{
              ...typography.bodySmall,
              color: colors.text.secondary,
              lineHeight: 21,
              marginTop: spacing.sm,
            }}
          >
            {comparison}. This view looks for a repeatable rhythm, not a
            perfect-week score.
          </Text>
        </View>
      ) : null}
    </Animated.View>
  );
}
