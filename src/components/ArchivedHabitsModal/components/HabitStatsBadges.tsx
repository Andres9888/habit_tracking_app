import { Text, View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';
import { fontFamilies, fontWeights } from '@/theme/typography';
import { getStrengthGradientColor } from '../utils';
import type { ArchivedHabit } from '../types';

interface HabitStatsBadgesProps {
  habit: ArchivedHabit;
  strength: number;
}

export function HabitStatsBadges({ habit, strength }: HabitStatsBadgesProps) {
  const { colors } = useThemeColors();
  const barColor = getStrengthGradientColor(strength);
  const streak = habit.currentStreak ?? 0;
  const completions = habit.totalCompletions ?? 0;
  const muted = colors.text.tertiary;
  const label = colors.text.secondary;
  const trackBg = colors.gray[200];

  const statText = { fontFamily: fontFamilies.primary.text, fontSize: 12, lineHeight: 16, letterSpacing: 0 } as const;
  const statValue = { ...statText, fontWeight: fontWeights.semibold, color: label } as const;

  return (
    <View style={{ marginBottom: 14 }}>
      {/* Strength bar */}
      <View style={{ height: 3, borderRadius: 2, backgroundColor: trackBg, marginBottom: 10 }}>
        <View style={{ height: 3, borderRadius: 2, width: `${Math.min(strength, 100)}%`, backgroundColor: barColor }} />
      </View>
      {/* Stat line */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
        <Text style={{ fontFamily: fontFamilies.monospace, fontSize: 12, lineHeight: 16, fontWeight: fontWeights.semibold, color: label }}>
          {Math.round(strength)}%
        </Text>
        <Text style={{ ...statText, color: muted }}> strength</Text>
        <Dot color={trackBg} />
        <Text style={streak > 0 ? statValue : { ...statText, color: muted }}>
          {streak > 0 ? `${streak}d streak` : 'no streak'}
        </Text>
        {completions > 0 && (<>
          <Dot color={trackBg} />
          <Text style={statValue}>{completions}</Text>
          <Text style={{ ...statText, color: muted }}> done</Text>
        </>)}
      </View>
    </View>
  );
}

function Dot({ color }: { color: string }) {
  return <View style={{ width: 3, height: 3, borderRadius: 2, backgroundColor: color, marginHorizontal: 4 }} />;
}
