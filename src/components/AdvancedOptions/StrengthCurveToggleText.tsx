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
    <View style={{ flex: 1, minWidth: 0 }}>
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
      {/* Value flex-shrinks so green "Average · +3%…" never clips the card. */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'baseline',
          gap: 8,
          marginTop: 2,
        }}
      >
        <Text
          numberOfLines={1}
          style={{
            ...typography.body,
            fontSize: 15,
            fontWeight: fontWeights.semibold,
            color: t.fg,
            flexShrink: 0,
          }}
        >
          Growth rate
        </Text>
        <Text
          adjustsFontSizeToFit
          minimumFontScale={0.85}
          numberOfLines={1}
          style={{
            ...typography.caption,
            flex: 1,
            minWidth: 0,
            flexShrink: 1,
            fontSize: 13,
            fontWeight: fontWeights.bold,
            color: t.accentText,
            fontVariant: ['tabular-nums'],
            textAlign: 'right',
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
