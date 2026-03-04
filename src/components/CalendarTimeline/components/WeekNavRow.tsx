import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CalendarDays, ChevronDown } from 'lucide-react-native';

import { AnimatedPressable } from '../../ui/AnimatedPressable';
import { colors as palette } from '../../../theme/colors';
import { useThemeColors } from '../../../theme/ThemeContext';
import { fontFamilies } from '../../../theme/typography';

interface WeekNavRowProps {
  dateLabel: string;
  isViewingPast: boolean;
  onJumpToToday?: () => void;
  onDateRangePress?: () => void;
  badge?: { emoji: string; text: string };
  variant?: string;
}

const PRESS = { date: { pressScale: 0.97 }, today: { pressScale: 0.95 } } as const;

function getPillColors(variant: string | undefined, isDark: boolean) {
  if (variant === 'risk') {
    return { bg: isDark ? 'rgba(181,48,48,0.15)' : palette.errorLight, text: palette.error };
  }
  if (variant === 'almostDone') {
    return { bg: isDark ? 'rgba(16,185,129,0.12)' : palette.primary[100], text: palette.primary[700] };
  }
  return {
    bg: isDark ? 'rgba(232,185,77,0.15)' : palette.streak[100],
    text: isDark ? palette.streak[300] : palette.streak[700],
  };
}

/** Date row — tappable date (left) · streak pill or "Today →" (right) */
export const WeekNavRow: React.FC<WeekNavRowProps> = ({
  dateLabel,
  isViewingPast,
  onJumpToToday,
  onDateRangePress,
  badge,
  variant,
}) => {
  const { colors, isDark } = useThemeColors();
  const pill = badge ? getPillColors(variant, isDark) : undefined;

  return (
    <View style={s.row}>
      <AnimatedPressable
        accessibilityHint='Tap to open calendar'
        accessibilityLabel={dateLabel}
        accessibilityRole='button'
        animationConfig={PRESS.date}
        onPress={onDateRangePress}
      >
        <View style={s.dateRow}>
          <CalendarDays color={colors.text.tertiary} size={14} strokeWidth={2} />
          <Text style={[s.dateText, { color: colors.text.secondary }]}>{dateLabel}</Text>
          <ChevronDown color={colors.gray[300]} size={11} strokeWidth={2} />
        </View>
      </AnimatedPressable>

      {isViewingPast && onJumpToToday ? (
        <AnimatedPressable animationConfig={PRESS.today} onPress={onJumpToToday}>
          <Text style={[s.todayLink, { color: isDark ? palette.streak[300] : palette.streak[500] }]}>
            Today →
          </Text>
        </AnimatedPressable>
      ) : pill && badge ? (
        <View style={[s.pill, { backgroundColor: pill.bg }]}>
          <Text style={[s.pillText, { color: pill.text }]}>
            {badge.emoji} {badge.text}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

const s = StyleSheet.create({
  dateRow: { alignItems: 'center', flexDirection: 'row', gap: 5, paddingVertical: 2 },
  dateText: { fontFamily: fontFamilies.primary.text, fontSize: 14, fontWeight: '500' },
  pill: { borderRadius: 99, paddingHorizontal: 10, paddingVertical: 3 },
  pillText: { fontFamily: fontFamilies.primary.text, fontSize: 12, fontWeight: '700' },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  todayLink: { fontFamily: fontFamilies.primary.text, fontSize: 12, fontWeight: '600' },
});
