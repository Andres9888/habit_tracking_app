import { Text, View } from 'react-native';

interface StrengthBarProps {
  dayLabel: string;
  detourLabel: string;
  endLabel: string;
  strengthValue: number; // 0-100
  startLabel: string;
}

export function StrengthBar({
  dayLabel,
  detourLabel,
  endLabel,
  startLabel,
  strengthValue,
}: StrengthBarProps) {
  return (
    <View
      style={{
        backgroundColor: '#FAF6EE',
        borderRadius: 12,
        marginVertical: 20,
        padding: 16,
      }}
    >
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 10,
        }}
      >
        <Text style={{ color: '#111', fontSize: 14, fontWeight: '700' }}>{dayLabel}</Text>
        <Text style={{ color: '#059669', fontSize: 14, fontWeight: '700' }}>
          strength {strengthValue}
        </Text>
      </View>
      <View
        style={{
          backgroundColor: '#E5E1D8',
          borderRadius: 5,
          height: 10,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <View
          style={{
            backgroundColor: '#10b981',
            bottom: 0,
            left: 0,
            position: 'absolute',
            top: 0,
            width: `${strengthValue}%`,
          }}
        />
        <View
          style={{
            backgroundColor: '#FAF6EE',
            bottom: 0,
            left: '38%',
            position: 'absolute',
            top: 0,
            width: '6%',
          }}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 8,
        }}
      >
        <Text style={{ color: '#888', fontSize: 11 }}>{startLabel}</Text>
        <Text style={{ color: '#888', fontSize: 11 }}>{detourLabel}</Text>
        <Text style={{ color: '#059669', fontSize: 11, fontWeight: '700' }}>{endLabel}</Text>
      </View>
    </View>
  );
}
