/** One % node (+10% / +3% / +1%) in the Strength Curve teaching strip. */
import { Text, View } from 'react-native';
import { fontWeights } from '@/theme/typography';

interface Props {
  pct: string;
  active: boolean;
  activeBg: string;
  inactiveFg: string;
}

export function StrengthCurveStripCell({
  pct,
  active,
  activeBg,
  inactiveFg,
}: Props) {
  return (
    <View
      style={{
        flex: 1,
        minWidth: 0,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 5,
        paddingHorizontal: 4,
        borderRadius: 8,
        backgroundColor: active ? activeBg : 'transparent',
      }}
    >
      <Text
        adjustsFontSizeToFit
        minimumFontScale={0.85}
        numberOfLines={1}
        style={{
          fontSize: 13,
          fontWeight: fontWeights.bold,
          color: active ? '#fff' : inactiveFg,
          fontVariant: ['tabular-nums'],
          textAlign: 'center',
          width: '100%',
        }}
      >
        {pct}
      </Text>
    </View>
  );
}
