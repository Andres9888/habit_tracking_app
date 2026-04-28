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
        <Text style={{ color: colors.text.primary, flex: 1, fontSize: 15, fontWeight: '700' }}>
          {name}
        </Text>
        <View
          style={{
            backgroundColor: 'rgba(184, 115, 51, 0.12)',
            borderRadius: 8,
            paddingHorizontal: 8,
            paddingVertical: 2,
          }}
        >
          <Text style={{ color: '#8B5A2B', fontSize: 11, fontWeight: '700' }}>
            {days} DAYS
          </Text>
        </View>
      </View>
      <View style={{ backgroundColor: colors.border, borderRadius: 4, height: 8, position: 'relative' }}>
        <TierMarker leftPercent={TIER_POSITIONS.copper * 100} tier="copper" />
        <TierMarker leftPercent={TIER_POSITIONS.iron * 100} tier="iron" />
        <TierMarker leftPercent={TIER_POSITIONS.gold * 100} tier="gold" />
        <DayOneMarker />
      </View>
      <Text style={{ color: colors.text.tertiary, fontSize: 12, marginTop: 10 }}>
        Day 1 · iron in {ironDay} · habit formed in {days} ({difficultyLabel})
      </Text>
    </View>
  );
}
