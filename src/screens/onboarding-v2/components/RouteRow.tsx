import { Text, View } from 'react-native';

import { COPPER, TierMarker } from './PathMarkers';

interface RouteRowProps {
  copperPercent: number;
  days: string;
  goldPercent: number;
  ironPercent: number;
  name: string;
}

export function RouteRow({
  copperPercent,
  days,
  goldPercent,
  ironPercent,
  name,
}: RouteRowProps) {
  return (
    <View style={{ marginBottom: 14 }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 6,
        }}
      >
        <Text style={{ color: '#888', fontSize: 13, fontWeight: '600' }}>{name}</Text>
        <Text style={{ color: COPPER, fontSize: 13, fontWeight: '700' }}>{days}</Text>
      </View>
      <View
        style={{
          backgroundColor: '#E5E1D8',
          borderRadius: 4,
          height: 8,
          position: 'relative',
        }}
      >
        <TierMarker leftPercent={copperPercent} tier="copper" />
        <TierMarker leftPercent={ironPercent} tier="iron" />
        <TierMarker leftPercent={goldPercent} tier="gold" />
      </View>
    </View>
  );
}
