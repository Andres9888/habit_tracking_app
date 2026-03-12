import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { ArrowRight, Calendar, ChevronDown } from 'lucide-react-native';

import { AnimatedPressable } from '../../ui/AnimatedPressable';
import { colors as palette } from '../../../theme/colors';
import { useThemeColors } from '../../../theme/ThemeContext';
import { fontFamilies, fontWeights } from '../../../theme/typography';

interface WeekNavRowProps {
  monthName: string;
  dateSuffix: string;
  isViewingPast: boolean;
  onJumpToToday?: () => void;
  onDateRangePress?: () => void;
}

const PRESS = {
  date: { pressScale: 0.97 },
  today: { pressScale: 0.95 },
} as const;
const ENTRANCE_DURATION = 300;
const SLIDE_OFFSET = 16;

/** Date row — centered date pill with optional "Today" pill on past weeks */
export const WeekNavRow: React.FC<WeekNavRowProps> = ({
  monthName,
  dateSuffix,
  isViewingPast,
  onJumpToToday,
  onDateRangePress,
}) => {
  const { colors, isDark } = useThemeColors();
  const dateLabel = `${monthName} ${dateSuffix}`;
  const showToday = isViewingPast && !!onJumpToToday;

  const spacerFlex = useSharedValue(showToday ? 0 : 1);
  const todayOpacity = useSharedValue(0);
  const todayTranslateX = useSharedValue(SLIDE_OFFSET);

  useEffect(() => {
    const timing = { duration: ENTRANCE_DURATION };
    spacerFlex.value = withTiming(showToday ? 0 : 1, timing);
    todayOpacity.value = withTiming(showToday ? 1 : 0, timing);
    todayTranslateX.value = withTiming(showToday ? 0 : SLIDE_OFFSET, timing);
  }, [showToday, spacerFlex, todayOpacity, todayTranslateX]);

  const spacerStyle = useAnimatedStyle(() => ({ flex: spacerFlex.value }));
  const todayEntranceStyle = useAnimatedStyle(() => ({
    opacity: todayOpacity.value,
    transform: [{ translateX: todayTranslateX.value }],
  }));

  const chipBg = palette.streak[300];
  const chipText = '#3D2E00';

  return (
    <View style={s.row}>
      <Animated.View style={spacerStyle} />

      <AnimatedPressable
        accessibilityHint='Tap to open calendar'
        accessibilityLabel={dateLabel}
        accessibilityRole='button'
        animationConfig={PRESS.date}
        onPress={onDateRangePress}
      >
        <View
          style={[
            s.pill,
            {
              backgroundColor: isDark
                ? 'rgba(5,150,105,0.08)'
                : 'rgba(5,150,105,0.06)',
              borderColor: isDark
                ? 'rgba(5,150,105,0.20)'
                : 'rgba(5,150,105,0.15)',
            },
          ]}
        >
          <Calendar
            color={isDark ? palette.primary[500] : palette.primary[600]}
            size={16}
            strokeWidth={2}
          />
          <Text
            style={[
              s.monthText,
              { color: isDark ? palette.primary[500] : palette.primary[700] },
            ]}
          >
            {monthName}
          </Text>
          <Text style={[s.dateText, { color: colors.text.secondary }]}>
            {dateSuffix}
          </Text>
          <ChevronDown color={colors.gray[300]} size={11} strokeWidth={2} />
        </View>
      </AnimatedPressable>

      <View style={s.sideColumnRight}>
        {showToday && onJumpToToday ? <Animated.View style={todayEntranceStyle}>
            <AnimatedPressable
              accessibilityHint='Jump back to the current week'
              accessibilityLabel='Today'
              accessibilityRole='button'
              animationConfig={PRESS.today}
              onPress={onJumpToToday}
            >
              <View style={[s.solidChip, { backgroundColor: chipBg }]}>
                <Text style={[s.chipText, { color: chipText }]}>Today</Text>
                <ArrowRight color={chipText} size={11} strokeWidth={2.5} />
              </View>
            </AnimatedPressable>
          </Animated.View> : null}
      </View>
    </View>
  );
};

const CHIP_BASE = {
  alignItems: 'center',
  borderRadius: 20,
  flexDirection: 'row',
  paddingHorizontal: 12,
  paddingVertical: 4,
} as const;

const s = StyleSheet.create({
  chipText: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  dateText: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 14,
    fontWeight: fontWeights.medium,
  },
  monthText: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 15,
    fontWeight: fontWeights.bold,
  },
  pill: { ...CHIP_BASE, borderWidth: 1, gap: 5 },
  row: { alignItems: 'center', flexDirection: 'row', marginTop: 2 },
  sideColumnRight: { alignItems: 'flex-end', flex: 1 },
  solidChip: { ...CHIP_BASE, gap: 4 },
});
