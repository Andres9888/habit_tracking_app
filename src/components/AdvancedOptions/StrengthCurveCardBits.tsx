/** Small visual bits for Strength Curve compare cards. */
import { Text, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { fontWeights } from '@/theme/typography';
import type { useAdvancedTokens } from './useAdvancedTokens';

type Tokens = ReturnType<typeof useAdvancedTokens>;

export function SuggestedPill({ bg }: { bg: string }) {
  return (
    <View
      style={{
        backgroundColor: bg,
        borderRadius: 999,
        paddingHorizontal: 6,
        paddingVertical: 2,
        flexShrink: 0,
      }}
    >
      <Text
        numberOfLines={1}
        style={{
          fontSize: 9,
          lineHeight: 11,
          fontWeight: fontWeights.bold,
          color: '#fff',
          textTransform: 'uppercase',
          letterSpacing: 0.4,
        }}
      >
        Suggested
      </Text>
    </View>
  );
}

export function PctBadge({
  growthPct,
  active,
  t,
}: {
  growthPct: number;
  active: boolean;
  t: Tokens;
}) {
  return (
    <View
      style={{
        borderRadius: 11,
        borderWidth: 1,
        borderColor: active ? t.accentText : t.border,
        backgroundColor: active ? t.accentText : t.card,
        paddingHorizontal: 8,
        paddingVertical: 3,
        flexShrink: 0,
      }}
    >
      <Text
        numberOfLines={1}
        style={{
          fontSize: 12,
          lineHeight: 16,
          fontWeight: fontWeights.bold,
          color: active ? '#fff' : t.accentText,
          fontVariant: ['tabular-nums'],
        }}
      >
        {`+${growthPct}%`}
      </Text>
    </View>
  );
}

export function CheckCircle({ active, t }: { active: boolean; t: Tokens }) {
  return (
    <View
      style={{
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 1.5,
        borderColor: active ? t.accentText : t.border,
        backgroundColor: active ? t.accentText : t.card,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {active ? <Check color='#fff' size={13} strokeWidth={2.6} /> : null}
    </View>
  );
}
