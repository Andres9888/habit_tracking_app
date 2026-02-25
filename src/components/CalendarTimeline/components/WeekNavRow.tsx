import React from 'react';
import { View, Text } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

import { AnimatedPressable } from '../../ui/AnimatedPressable';
import { colors } from '../../../theme/colors';

interface WeekNavRowProps {
  dateLabel: string;
  isViewingPast: boolean;
  canNavigateForward: boolean;
  onPreviousWeek?: () => void;
  onNextWeek?: () => void;
  onJumpToToday?: () => void;
  onDateRangePress?: () => void;
}

const ARROW_SIZE = 12;
const ARROW_HIT = { top: 8, bottom: 8, left: 6, right: 6 };
const PRESS_CONFIG = { pressScale: 0.85 } as const;
const DATE_PRESS_CONFIG = { pressScale: 0.97 } as const;

/** Compact [<] date [>] navigation row with optional "Today" link */
export const WeekNavRow: React.FC<WeekNavRowProps> = ({
  dateLabel,
  isViewingPast,
  canNavigateForward,
  onPreviousWeek,
  onNextWeek,
  onJumpToToday,
  onDateRangePress,
}) => (
  <View className='flex-row items-center' style={{ gap: 4, marginTop: 3 }}>
    <AnimatedPressable
      accessibilityLabel='Previous week'
      accessibilityRole='button'
      animationConfig={PRESS_CONFIG}
      hitSlop={ARROW_HIT}
      onPress={onPreviousWeek}
    >
      <ChevronLeft color={colors.gray[400]} size={ARROW_SIZE} strokeWidth={2} />
    </AnimatedPressable>

    <AnimatedPressable
      accessibilityHint={
        isViewingPast ? 'Tap to return to today' : 'Tap to open calendar'
      }
      accessibilityLabel={dateLabel}
      animationConfig={DATE_PRESS_CONFIG}
      onPress={isViewingPast ? onJumpToToday : onDateRangePress}
    >
      <Text
        style={{ fontSize: 12, fontWeight: '500', color: colors.text.tertiary }}
      >
        {dateLabel}
      </Text>
    </AnimatedPressable>

    <AnimatedPressable
      accessibilityLabel='Next week'
      accessibilityRole='button'
      accessibilityState={{ disabled: !canNavigateForward }}
      animationConfig={PRESS_CONFIG}
      disabled={!canNavigateForward}
      hitSlop={ARROW_HIT}
      style={{ opacity: canNavigateForward ? 1 : 0.3 }}
      onPress={onNextWeek}
    >
      <ChevronRight
        color={canNavigateForward ? colors.gray[400] : colors.gray[300]}
        size={ARROW_SIZE}
        strokeWidth={2}
      />
    </AnimatedPressable>

    {isViewingPast && (
      <AnimatedPressable
        animationConfig={DATE_PRESS_CONFIG}
        onPress={onJumpToToday}
      >
        <Text
          style={{ fontSize: 12, fontWeight: '600', color: colors.streak[500] }}
        >
          Today →
        </Text>
      </AnimatedPressable>
    )}
  </View>
);
