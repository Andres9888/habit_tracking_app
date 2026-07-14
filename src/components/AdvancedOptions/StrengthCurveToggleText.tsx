/** Kicker/title/value/hint text stack for the Strength Curve trigger row. */
import { Text, View } from 'react-native';
import { fontWeights, typography } from '@/theme/typography';
import { useAdvancedTokens } from './useAdvancedTokens';

interface Props {
  collapsedValue: string;
}

export function StrengthCurveToggleText({ collapsedValue }: Props) {
  const t = useAdvancedTokens();
  return (
    <View style={{ flex: 1, minWidth: 0, paddingRight: 4 }}>
      <Text
        style={{
          fontSize: 11,
          fontWeight: fontWeights.bold,
          letterSpacing: 0.5,
          textTransform: 'uppercase',
          color: t.muted,
        }}
      >
        Strength Curve
      </Text>
      {/* Title + value may wrap so "Average · +3%…" never clips the chevron. */}
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'baseline',
          columnGap: 8,
          rowGap: 2,
          marginTop: 2,
          minWidth: 0,
        }}
      >
        <Text
          style={{
            ...typography.body,
            fontSize: 15,
            fontWeight: fontWeights.semibold,
            color: t.fg,
          }}
        >
          Growth rate
        </Text>
        <Text
          numberOfLines={2}
          style={{
            ...typography.caption,
            // Claim a full line so a long "Average · +3% per check-in" wraps to
            // its own row instead of shrinking under / clipping past the chevron.
            flexBasis: '100%',
            flexShrink: 1,
            minWidth: 0,
            fontSize: 13,
            lineHeight: 18,
            fontWeight: fontWeights.bold,
            color: t.accentText,
            fontVariant: ['tabular-nums'],
          }}
        >
          {collapsedValue}
        </Text>
      </View>
      <Text
        style={{
          ...typography.caption,
          fontSize: 12,
          color: t.meta,
          marginTop: 2,
        }}
      >
        How fast strength rises each check-in
      </Text>
    </View>
  );
}
