/** Quiet bordered pill for card meta ("~N days to full", miss cost). */
import { Text, View } from 'react-native';
import { fontWeights, typography } from '@/theme/typography';
import type { useAdvancedTokens } from './useAdvancedTokens';

type Tokens = ReturnType<typeof useAdvancedTokens>;

export function StrengthCurveMetaChip({
  label,
  t,
}: {
  label: string;
  t: Tokens;
}) {
  return (
    <View
      style={{
        borderRadius: 999,
        borderWidth: 1,
        borderColor: t.border,
        backgroundColor: t.card,
        paddingHorizontal: 8,
        paddingVertical: 3,
      }}
    >
      <Text
        style={{
          ...typography.caption,
          fontSize: 11,
          fontWeight: fontWeights.semibold,
          color: t.muted,
          fontVariant: ['tabular-nums'],
        }}
      >
        {label}
      </Text>
    </View>
  );
}
