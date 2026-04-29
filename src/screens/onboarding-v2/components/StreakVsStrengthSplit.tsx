import { Text, View } from 'react-native';

const CARD = '#FAF6EE';
const BORDER = '#ECE6D9';
const MUTED = '#888';
const STRIKE = '#999';
const POP = '#B45309';
const EM = '#059669';

export function StreakVsStrengthSplit() {
  return (
    <View style={{ flexDirection: 'row', gap: 10, marginTop: 18 }}>
      <Column
        deltaColor={POP}
        deltaText="→ 0 (resets)"
        label="Streak"
        numColor={STRIKE}
        numStrike
        numText="30"
      />
      <Column
        deltaColor={EM}
        deltaText="→ 76 (dents)"
        label="Strength"
        numColor={EM}
        numText="78"
      />
    </View>
  );
}

interface ColumnProps {
  deltaColor: string;
  deltaText: string;
  label: string;
  numColor: string;
  numStrike?: boolean;
  numText: string;
}

function Column({
  deltaColor,
  deltaText,
  label,
  numColor,
  numStrike,
  numText,
}: ColumnProps) {
  return (
    <View
      style={{
        backgroundColor: CARD,
        borderColor: BORDER,
        borderRadius: 10,
        borderWidth: 1,
        flex: 1,
        padding: 14,
      }}
    >
      <Text
        style={{
          color: MUTED,
          fontSize: 11,
          fontWeight: '600',
          letterSpacing: 0.6,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          color: numColor,
          fontSize: 40,
          fontWeight: '800',
          letterSpacing: -1,
          marginTop: 2,
          textDecorationLine: numStrike ? 'line-through' : 'none',
        }}
      >
        {numText}
      </Text>
      <Text
        style={{
          color: deltaColor,
          fontSize: 12,
          fontWeight: '700',
          marginTop: 8,
        }}
      >
        {deltaText}
      </Text>
    </View>
  );
}
