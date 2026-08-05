import { Text, View } from 'react-native';

import { COPPER, GOLD, IRON, TierMarker } from './PathMarkers';

export function FirstRouteCard() {
  return (
    <View
      style={{
        backgroundColor: '#FAF6EE',
        borderRadius: 14,
        marginVertical: 24,
        padding: 14,
      }}
    >
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          gap: 10,
          marginBottom: 12,
        }}
      >
        <View
          style={{
            alignItems: 'center',
            backgroundColor: '#FEF3C7',
            borderRadius: 8,
            height: 32,
            justifyContent: 'center',
            width: 32,
          }}
        >
          <Text style={{ fontSize: 16 }}>🚶</Text>
        </View>
        <Text style={{ color: '#111', flex: 1, fontSize: 16, fontWeight: '800' }}>
          10-minute walk
        </Text>
        <Text style={{ color: COPPER, fontSize: 12, fontWeight: '700' }}>21 days</Text>
      </View>
      <View
        style={{
          backgroundColor: '#E5E1D8',
          borderRadius: 4,
          height: 8,
          position: 'relative',
        }}
      >
        <TierMarker leftPercent={25} tier="copper" />
        <TierMarker leftPercent={65} tier="iron" />
        <TierMarker leftPercent={100} tier="gold" />
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 10,
        }}
      >
        <Text style={{ color: COPPER, fontSize: 11, fontWeight: '700' }}>Copper</Text>
        <Text style={{ color: IRON, fontSize: 11, fontWeight: '700' }}>Iron</Text>
        <Text style={{ color: GOLD, fontSize: 11, fontWeight: '700' }}>Gold</Text>
      </View>
    </View>
  );
}
