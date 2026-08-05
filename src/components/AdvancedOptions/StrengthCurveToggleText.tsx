/** Title/value-chip/hint text stack for the Strength Curve trigger row. */
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
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Text
          style={{
            ...typography.body,
            fontSize: 15,
            fontWeight: fontWeights.semibold,
            color: t.fg,
            flex: 1,
          }}
        >
          Strength Curve
        </Text>
        <View
          style={{
            borderRadius: 999,
            paddingHorizontal: 10,
            paddingVertical: 4,
            backgroundColor: t.tile,
          }}
        >
          <Text
            numberOfLines={1}
            style={{
              ...typography.caption,
              fontSize: 12,
              fontWeight: fontWeights.semibold,
              color: t.muted,
              fontVariant: ['tabular-nums'],
            }}
          >
            {collapsedValue}
          </Text>
        </View>
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
