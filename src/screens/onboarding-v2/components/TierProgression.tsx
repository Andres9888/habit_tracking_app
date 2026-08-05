import { Text, View } from 'react-native';

const TIERS = [
  { color: '#B87333', gradientEnd: '#d2935a', label: 'Copper' },
  { color: '#6B7280', gradientEnd: '#94a3b8', label: 'Iron' },
  { color: '#D4A23F', gradientEnd: '#f1c563', label: 'Gold' },
] as const;

export function TierProgression() {
  return (
    <View
      style={{
        alignItems: 'center',
        flexDirection: 'row',
        gap: 6,
        justifyContent: 'center',
        marginVertical: 24,
      }}
    >
      {TIERS.map((tier, idx) => (
        <View key={tier.label} style={{ alignItems: 'center', flex: 1, flexDirection: 'row' }}>
          <View
            style={{
              alignItems: 'center',
              backgroundColor: tier.color,
              borderRadius: 12,
              flex: 1,
              justifyContent: 'center',
              paddingHorizontal: 6,
              paddingVertical: 18,
            }}
          >
            <Text
              style={{
                color: '#fff',
                fontSize: 14,
                fontWeight: '800',
                letterSpacing: -0.2,
              }}
            >
              {tier.label}
            </Text>
          </View>
          {idx < TIERS.length - 1 ? (
            <Text style={{ color: '#C8C4B8', fontSize: 14, fontWeight: '700', marginHorizontal: 4 }}>
              →
            </Text>
          ) : null}
        </View>
      ))}
    </View>
  );
}
