/** Wrapping title row — minWidth:0 so Average +3% never clips the check. */
import { Text, View } from 'react-native';
import { fontWeights } from '@/theme/typography';
import { CheckCircle, PctBadge, SuggestedPill } from './StrengthCurveCardBits';
import type { useAdvancedTokens } from './useAdvancedTokens';

type Tokens = ReturnType<typeof useAdvancedTokens>;

export function StrengthCurveCompareHeader({
  name,
  growthPct,
  active,
  suggested,
  t,
}: {
  name: string;
  growthPct: number;
  active: boolean;
  suggested?: boolean;
  t: Tokens;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
        minWidth: 0,
      }}
    >
      <View
        style={{
          flex: 1,
          minWidth: 0,
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
          columnGap: 6,
          rowGap: 5,
        }}
      >
        <Text
          numberOfLines={1}
          style={{
            fontSize: 15,
            lineHeight: 20,
            fontWeight: fontWeights.bold,
            color: active ? t.accentText : t.fg,
            flexShrink: 1,
            minWidth: 0,
          }}
        >
          {name}
        </Text>
        <PctBadge active={active} growthPct={growthPct} t={t} />
        {suggested ? <SuggestedPill bg={t.accentText} /> : null}
      </View>
      <View style={{ paddingTop: 1 }}>
        <CheckCircle active={active} t={t} />
      </View>
    </View>
  );
}
