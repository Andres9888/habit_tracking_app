import { Text, View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';

import { TIER_POSITIONS } from '../data/pathLength';
import { DayOneMarker, TierMarker } from './PathMarkers';

interface PlanPathCardProps {
  days: number;
  difficultyLabel: string;
  icon: string;
  iconColor: string;
  name: string;
}

export function PlanPathCard({
  days,
  difficultyLabel,
  icon,
  iconColor,
  name,
}: PlanPathCardProps) {
  const { colors } = useThemeColors();
  const ironDay = Math.round(days * TIER_POSITIONS.iron);

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderColor: colors.border,
        borderRadius: 14,
        borderWidth: 1,
        marginBottom: 10,
        padding: 14,
      }}
    >
      <View style={{ alignItems: 'center', flexDirection: 'row', gap: 10, marginBottom: 12 }}>
        <View
          style={{
            alignItems: 'center',
            backgroundColor: iconColor,
            borderRadius: 10,
            height: 36,
            justifyContent: 'center',
            width: 36,
          }}
        >
          <Text style={{ fontSize: 18 }}>{icon}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: colors.text.tertiary,
              fontSize: 10,
              fontWeight: '600',
              letterSpacing: 1.2,
              textTransform: 'uppercase',
            }}
          >
            Route · {days} days · {difficultyLabel}
          </Text>
          <Text style={{ color: colors.text.primary, fontSize: 15, fontWeight: '700' }}>
            {name}
          </Text>
        </View>
      </View>
      <View style={{ backgroundColor: colors.border, borderRadius: 4, height: 8, position: 'relative' }}>
        <TierMarker leftPercent={TIER_POSITIONS.copper * 100} tier="copper" />
        <TierMarker leftPercent={TIER_POSITIONS.iron * 100} tier="iron" />
        <TierMarker leftPercent={TIER_POSITIONS.gold * 100} tier="gold" />
        <DayOneMarker />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
        <Text style={{ color: '#B87333', fontSize: 10, fontWeight: '700' }}>Copper</Text>
        <Text style={{ color: '#6B7280', fontSize: 10, fontWeight: '700' }}>Iron Ridge</Text>
        <Text style={{ color: '#D4A23F', fontSize: 10, fontWeight: '700' }}>Gold Summit</Text>
      </View>
      <Text style={{ color: colors.text.secondary, fontSize: 12, marginTop: 10 }}>
        📍 Day 1 · next stop: Iron Ridge in {ironDay} days
      </Text>
    </View>
  );
}
