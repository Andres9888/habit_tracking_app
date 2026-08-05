import React from 'react';
import { Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Flame } from 'lucide-react-native';

import { useThemeColors } from '@/theme/ThemeContext';

interface StrengthMilestoneStatProps {
  longestStreak: number;
  totalCompletions: number;
  daysTracked: number;
  color?: string;
}

const FALLBACK_COLOR = '#f97316';

function hexToRgba(hex: string, alpha: number): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result === null) return `rgba(249, 115, 22, ${alpha})`;
  const r = Number.parseInt(result[1], 16);
  const g = Number.parseInt(result[2], 16);
  const b = Number.parseInt(result[3], 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function pluralizeDay(n: number): string {
  return n === 1 ? 'day' : 'days';
}

function pluralizeCompletion(n: number): string {
  return n === 1 ? 'completion' : 'completions';
}

export const StrengthMilestoneStat = React.memo(function StrengthMilestoneStat({
  longestStreak,
  totalCompletions,
  daysTracked,
  color = FALLBACK_COLOR,
}: StrengthMilestoneStatProps) {
  const { colors: themeColors } = useThemeColors();

  const headline = `${longestStreak}-${pluralizeDay(longestStreak)} longest streak`;
  const subline = `${totalCompletions} ${pluralizeCompletion(totalCompletions)} over ${daysTracked} ${pluralizeDay(daysTracked)} tracked`;
  const a11yLabel = `${headline}. ${subline}.`;

  return (
    <View
      accessible
      accessibilityLabel={a11yLabel}
      accessibilityRole='summary'
      style={{ borderRadius: 14, overflow: 'hidden' }}
    >
      <LinearGradient
        colors={[hexToRgba(color, 0.08), hexToRgba(color, 0.2)]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          gap: 12,
          paddingHorizontal: 16,
          paddingVertical: 14,
        }}
      >
        <View
          style={{
            alignItems: 'center',
            backgroundColor: themeColors.card,
            borderRadius: 12,
            height: 38,
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: { height: 1, width: 0 },
            shadowOpacity: 0.06,
            shadowRadius: 2,
            width: 38,
          }}
        >
          <Flame color={color} size={20} />
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <Text
            numberOfLines={1}
            style={{
              color: themeColors.text.primary,
              fontSize: 17,
              fontWeight: '700',
              lineHeight: 20,
            }}
          >
            {headline}
          </Text>
          <Text
            numberOfLines={1}
            style={{
              color: themeColors.text.secondary,
              fontSize: 12,
              fontWeight: '500',
            }}
          >
            {subline}
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
});
