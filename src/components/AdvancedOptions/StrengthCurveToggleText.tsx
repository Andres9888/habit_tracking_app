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
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: 8,
          marginTop: 2,
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
          numberOfLines={1}
          style={{
            ...typography.caption,
            fontSize: 13,
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
