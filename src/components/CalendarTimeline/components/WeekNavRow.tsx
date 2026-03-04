import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { CalendarDays, ChevronDown } from 'lucide-react-native';

import { AnimatedPressable } from '../../ui/AnimatedPressable';
import { colors as palette } from '../../../theme/colors';
import { useThemeColors } from '../../../theme/ThemeContext';
import { fontFamilies } from '../../../theme/typography';
import { shadows } from '../../../theme/spacing';

interface WeekNavRowProps {
  dateLabel: string;
  isViewingPast: boolean;
  onJumpToToday?: () => void;
  onDateRangePress?: () => void;
}

const PRESS = {
  chip: { pressScale: 0.97 },
  today: { pressScale: 0.95 },
} as const;

/** Glass chip date row — frosted pill opens mini calendar, "Today →" for past */
export const WeekNavRow: React.FC<WeekNavRowProps> = ({
  dateLabel,
  isViewingPast,
  onJumpToToday,
  onDateRangePress,
}) => {
  const { colors, isDark } = useThemeColors();

  return (
    <View style={s.row}>
      <AnimatedPressable
        accessibilityHint='Tap to open calendar'
        accessibilityLabel={dateLabel}
        accessibilityRole='button'
        animationConfig={PRESS.chip}
        onPress={onDateRangePress}
      >
        <View
          style={[
            s.chip,
            {
              borderColor: isDark ? GLASS.borderDark : GLASS.borderLight,
              backgroundColor: isDark ? GLASS.bgDark : GLASS.bgLight,
            },
            shadows.subtle,
          ]}
        >
          <BlurView
            intensity={isDark ? 40 : 50}
            tint={isDark ? 'dark' : 'light'}
            style={StyleSheet.absoluteFill}
          />
          <View style={s.chipContent}>
            <CalendarDays
              color={colors.text.tertiary}
              size={13}
              strokeWidth={2}
            />
            <Text style={[s.dateText, { color: colors.text.secondary }]}>
              {dateLabel}
            </Text>
            <ChevronDown color={colors.gray[300]} size={11} strokeWidth={2} />
          </View>
        </View>
      </AnimatedPressable>

      {isViewingPast && onJumpToToday && (
        <AnimatedPressable
          animationConfig={PRESS.today}
          style={s.todayWrap}
          onPress={onJumpToToday}
        >
          <Text
            style={[
              s.todayLink,
              { color: isDark ? palette.streak[300] : palette.streak[500] },
            ]}
          >
            Today →
          </Text>
        </AnimatedPressable>
      )}
    </View>
  );
};

const GLASS = {
  borderLight: 'rgba(45,42,38,0.12)',
  borderDark: 'rgba(255,255,255,0.10)',
  bgLight: 'rgba(255,255,255,0.65)',
  bgDark: 'rgba(31,41,55,0.7)',
};

const s = StyleSheet.create({
  chip: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  chipContent: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  dateText: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 12,
    fontWeight: '500' as const,
  },
  row: {
    alignItems: 'center' as const,
    flexDirection: 'row' as const,
    justifyContent: 'center' as const,
    marginTop: 6,
  },
  todayLink: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 12,
    fontWeight: '600' as const,
  },
  todayWrap: { position: 'absolute' as const, right: 0 },
});
