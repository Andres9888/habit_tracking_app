import { Text, View } from 'react-native';

import { TIER_POSITIONS } from '../data/pathLength';
import { COPPER, DayOneMarker, GOLD, IRON, TierMarker } from './PathMarkers';

export function SolutionMapPreview() {
  return (
    <View
      style={{
        backgroundColor: '#FAF6EE',
        borderRadius: 14,
        marginTop: 24,
        padding: 14,
      }}
    >
      <View style={{ alignItems: 'center', flexDirection: 'row', gap: 8, marginBottom: 10 }}>
        <View
          style={{
            alignItems: 'center',
            backgroundColor: '#FEF3C7',
            borderRadius: 8,
            height: 28,
            justifyContent: 'center',
            width: 28,
          }}
        >
          <Text style={{ fontSize: 14 }}>🚶</Text>
        </View>
        <Text style={{ color: '#111', flex: 1, fontSize: 14, fontWeight: '700' }}>
          10-minute walk
        </Text>
        <Text style={{ color: COPPER, fontSize: 11, fontWeight: '700' }}>21 days</Text>
      </View>
      <View
        style={{
          backgroundColor: '#E5E1D8',
          borderRadius: 4,
          height: 8,
          marginVertical: 8,
        }}
      >
        <TierMarker leftPercent={TIER_POSITIONS.copper * 100} tier="copper" />
        <TierMarker leftPercent={TIER_POSITIONS.iron * 100} tier="iron" />
        <TierMarker leftPercent={TIER_POSITIONS.gold * 100} tier="gold" />
        <DayOneMarker />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
        <Text style={{ color: COPPER, fontSize: 10, fontWeight: '700' }}>Copper</Text>
        <Text style={{ color: IRON, fontSize: 10, fontWeight: '700' }}>Iron</Text>
        <Text style={{ color: GOLD, fontSize: 10, fontWeight: '700' }}>Gold</Text>
      </View>
    </View>
  );
}
