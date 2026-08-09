/**
 * ProvisionalInsightCard — warm amber science tip while personal data grows.
 */
import { Text, View } from 'react-native';
import { borderRadius } from '../../../../theme/spacing';
import { fontWeights } from '../../../../theme/typography';
import type { ProvisionalInsight } from '../../insights/buildProvisionalInsight';
import type { InsightPalette } from '../../insightPalette';

interface ProvisionalInsightCardProps {
  insight: ProvisionalInsight;
  palette: InsightPalette;
}

export function ProvisionalInsightCard({
  insight,
  palette,
}: ProvisionalInsightCardProps) {
  return (
    <View
      accessibilityLabel={`${insight.heading}. ${insight.body}. Your personal insights take over in ${insight.daysRemaining} days.`}
      style={{
        backgroundColor: palette.amberBg,
        borderColor: palette.amberBorder,
        borderRadius: borderRadius.large,
        borderWidth: 1,
        paddingHorizontal: 18,
        paddingVertical: 16,
      }}
    >
      <Text
        style={{
          color: '#B0723A',
          fontSize: 11,
          fontWeight: fontWeights.bold,
          letterSpacing: 1.4,
          textTransform: 'uppercase',
        }}
      >
        While your data grows
      </Text>
      <Text
        style={{
          color: palette.textPrimary,
          fontSize: 15,
          fontWeight: fontWeights.semibold,
          lineHeight: 21,
          marginTop: 8,
        }}
      >
        {insight.heading}
      </Text>
      <Text
        style={{
          color: palette.textSecondary,
          fontSize: 13,
          lineHeight: 19,
          marginTop: 6,
        }}
      >
        {insight.body}
      </Text>
      {insight.attribution ? (
        <Text
          style={{
            color: palette.textTertiary,
            fontSize: 12,
            fontStyle: 'italic',
            marginTop: 8,
          }}
        >
          {insight.attribution}
        </Text>
      ) : null}
      <Text
        style={{
          color: palette.textSecondary,
          fontSize: 12,
          marginTop: 12,
        }}
      >
        Your personal insights take over in {insight.daysRemaining}{' '}
        {insight.daysRemaining === 1 ? 'day' : 'days'}
      </Text>
      <View
        style={{
          backgroundColor: palette.cellEmpty,
          borderRadius: borderRadius.full,
          height: 4,
          marginTop: 6,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            backgroundColor: palette.amberBar,
            borderRadius: borderRadius.full,
            height: '100%',
            width: `${insight.fillPct}%`,
          }}
        />
      </View>
    </View>
  );
}
