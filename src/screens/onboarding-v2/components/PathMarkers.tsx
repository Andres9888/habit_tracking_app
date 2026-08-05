import { View } from 'react-native';

export const COPPER = '#B87333';
export const IRON = '#6B7280';
export const GOLD = '#D4A23F';

export function TierMarker({
  tier,
  leftPercent,
}: {
  tier: 'copper' | 'iron' | 'gold';
  leftPercent: number;
}) {
  const color = tier === 'copper' ? COPPER : tier === 'iron' ? IRON : GOLD;
  return (
    <View
      style={{
        backgroundColor: color,
        borderRadius: 2,
        height: 10,
        left: `${leftPercent}%`,
        position: 'absolute',
        top: -1,
        transform: [{ translateX: -5 }],
        width: 10,
      }}
    />
  );
}

export function DayOneMarker() {
  return (
    <View
      style={{
        backgroundColor: '#fff',
        borderColor: '#059669',
        borderRadius: 8,
        borderWidth: 2.5,
        height: 14,
        left: 0,
        position: 'absolute',
        top: -3,
        width: 14,
        zIndex: 2,
      }}
    />
  );
}
