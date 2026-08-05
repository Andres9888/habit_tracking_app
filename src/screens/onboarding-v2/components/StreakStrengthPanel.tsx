import { Text, View } from 'react-native';

const CARD = '#FAF6EE';
const BORDER = '#ECE6D9';
const TRACK = '#E5E1D8';
const POP = '#B45309';
const EM = '#059669';
const STRIKE = '#999';
const HEAD = '#555';
const META = '#777';

export function StreakStrengthPanel() {
  return (
    <View
      style={{
        backgroundColor: CARD,
        borderColor: BORDER,
        borderRadius: 12,
        borderWidth: 1,
        marginTop: 18,
        overflow: 'hidden',
      }}
    >
      <Row
        barColor={POP}
        barWidth={95}
        deltaAccent="resets to zero"
        deltaColor={POP}
        deltaPlain="One missed day · "
        fromValue="30"
        label="Streak"
        showCross
        toColor={POP}
        toValue="0"
      />
      <View style={{ borderTopColor: BORDER, borderTopWidth: 1 }}>
        <Row
          barColor={EM}
          barWidth={76}
          deltaAccent="just a dent"
          deltaColor={EM}
          deltaPlain="Same missed day · "
          fromColor="#111"
          fromValue="78"
          label="Strength"
          notchPos={78}
          toColor={EM}
          toValue="76"
        />
      </View>
    </View>
  );
}

interface RowProps {
  barColor: string;
  barWidth: number;
  deltaAccent: string;
  deltaColor: string;
  deltaPlain: string;
  fromColor?: string;
  fromValue: string;
  label: string;
  notchPos?: number;
  showCross?: boolean;
  toColor: string;
  toValue: string;
}

function Row({
  barColor, barWidth, deltaAccent, deltaColor, deltaPlain,
  fromColor, fromValue, label, notchPos, showCross, toColor, toValue,
}: RowProps) {
  return (
    <View style={{ paddingHorizontal: 16, paddingVertical: 14 }}>
      <View style={{ alignItems: 'baseline', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
        <Text style={{ color: HEAD, fontFamily: 'DMSans', fontSize: 12, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' }}>{label}</Text>
        <Text style={{ fontFamily: 'JetBrainsMono', fontSize: 22, fontWeight: '700', letterSpacing: -0.4 }}>
          <Text style={{ color: fromColor ?? STRIKE, textDecorationLine: fromColor === undefined ? 'line-through' : 'none' }}>{fromValue}</Text>
          <Text style={{ color: META, fontWeight: '500' }}>{'  →  '}</Text>
          <Text style={{ color: toColor }}>{toValue}</Text>
        </Text>
      </View>
      <View style={{ backgroundColor: TRACK, borderRadius: 4, height: 8, position: 'relative' }}>
        <View style={{ backgroundColor: barColor, borderRadius: 4, height: 8, width: `${barWidth}%` }} />
        {showCross ? (
          <Text style={{ color: POP, fontSize: 16, fontWeight: '700', position: 'absolute', right: -4, top: -7 }}>✕</Text>
        ) : null}
        {notchPos === undefined ? null : (
          <View style={{ backgroundColor: CARD, height: 12, left: `${notchPos}%`, position: 'absolute', top: -2, width: 2 }} />
        )}
      </View>
      <Text style={{ color: META, fontFamily: 'DMSans', fontSize: 13, fontWeight: '500', marginTop: 10 }}>
        {deltaPlain}
        <Text style={{ color: deltaColor, fontWeight: '700' }}>{deltaAccent}</Text>
      </Text>
    </View>
  );
}
