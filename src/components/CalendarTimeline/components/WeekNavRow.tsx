import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { ArrowRight, Calendar, ChevronDown } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';

import { AnimatedPressable } from '../../ui/AnimatedPressable';
import { colors as palette } from '../../../theme/colors';
import { useThemeColors } from '../../../theme/ThemeContext';
import { durations } from '../../../theme/animations';
import { typography, fontFamilies, fontWeights } from '../../../theme/typography';
import { borderRadius } from '../../../theme/spacing';
import { getDatePillColors } from '../theme';

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
const ENTRANCE_DURATION = durations.enter;
const EXIT_TIMING = { duration: durations.transition, easing: Easing.in(Easing.cubic) };
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

  const [shouldRender, setShouldRender] = useState(showToday);
  const spacerFlex = useSharedValue(showToday ? 0 : 1);
  const todayOpacity = useSharedValue(0);
  const todayTranslateX = useSharedValue(SLIDE_OFFSET);
  const todayScale = useSharedValue(0.9);

  useEffect(() => {
    if (showToday) {
      setShouldRender(true);
      const timing = { duration: ENTRANCE_DURATION };
      spacerFlex.value = withTiming(0, timing);
      todayOpacity.value = withTiming(1, timing);
      todayTranslateX.value = withTiming(0, timing);
      todayScale.value = withTiming(1, timing);
    } else {
      todayOpacity.value = withTiming(0, EXIT_TIMING, (finished) => {
        if (finished) runOnJS(setShouldRender)(false);
      });
      todayScale.value = withTiming(0.85, EXIT_TIMING);
      todayTranslateX.value = withTiming(SLIDE_OFFSET, EXIT_TIMING);
      spacerFlex.value = withTiming(1, EXIT_TIMING);
    }
  }, [showToday, spacerFlex, todayOpacity, todayTranslateX, todayScale]);

  const spacerStyle = useAnimatedStyle(() => ({ flex: spacerFlex.value }));
  const todayEntranceStyle = useAnimatedStyle(() => ({
    opacity: todayOpacity.value,
    transform: [{ translateX: todayTranslateX.value }, { scale: todayScale.value }],
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
          style={[s.pill, getDatePillColors(isDark)]}
        >
          <Calendar
            color={isDark ? palette.primary[500] : palette.primary[600]}
            size={iconSizes.small}
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
          <ChevronDown color={colors.gray[300]} size={iconSizes.micro} strokeWidth={2} />
        </View>
      </AnimatedPressable>

      <View style={s.sideColumnRight}>
        {shouldRender && onJumpToToday ? <Animated.View style={todayEntranceStyle}>
            <AnimatedPressable
              accessibilityHint='Jump back to the current week'
              accessibilityLabel='Today'
              accessibilityRole='button'
              animationConfig={PRESS.today}
              onPress={onJumpToToday}
            >
              <View style={[s.solidChip, { backgroundColor: chipBg }]}>
                <Text style={[s.chipText, { color: chipText }]}>Today</Text>
                <ArrowRight color={chipText} size={iconSizes.micro} strokeWidth={2.5} />
              </View>
            </AnimatedPressable>
          </Animated.View> : null}
      </View>
    </View>
  );
};

const CHIP_BASE = {
  alignItems: 'center',
  borderRadius: borderRadius.full,
  flexDirection: 'row',
  paddingHorizontal: 12,
  paddingVertical: 4,
} as const;

const s = StyleSheet.create({
  chipText: {
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.tabBar.fontSize,
    fontWeight: fontWeights.bold,
    letterSpacing: 0.3,
  },
  dateText: {
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.bodySmall.fontSize,
    fontWeight: fontWeights.medium,
  },
  monthText: {
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.bodySmall.fontSize,
    fontWeight: fontWeights.bold,
  },
  pill: { ...CHIP_BASE, borderWidth: 1, gap: 5 },
  row: { alignItems: 'center', flexDirection: 'row', marginTop: 2 },
  sideColumnRight: { alignItems: 'flex-end', flex: 1 },
  solidChip: { ...CHIP_BASE, gap: 4 },
});
