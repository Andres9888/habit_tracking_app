import React from 'react';
import { View, Text } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

import { AnimatedPressable } from '../../ui/AnimatedPressable';
import { colors } from '../../../theme/colors';
import type { WeekNavigationHeaderProps } from '../CalendarTimeline.types';
import { CompletionRing } from './CompletionRing';

const NAV_BUTTON_STYLE = {
  backgroundColor: colors.gray[50],
  borderWidth: 1,
  borderColor: colors.gray[200],
};

/** Header row: ◀ [Title] ▶ on left, completion ring on right */
export const WeekNavigationHeader: React.FC<WeekNavigationHeaderProps> = ({
  dateRangeText,
  onPreviousWeek,
  onNextWeek,
  canNavigateForward,
  colors: calColors,
  onJumpToToday,
  onDateRangePress,
  completedToday = 0,
  totalHabits = 0,
  reduceMotion = false,
}) => {
  const isViewingPast = canNavigateForward && !!onJumpToToday;

  return (
    <View className='mb-2.5 flex-row items-center justify-between'>
      {/* LEFT: nav arrows flanking title */}
      <View className='flex-row items-center' style={{ gap: 6 }}>
        <AnimatedPressable
          accessibilityLabel='Previous week'
          accessibilityRole='button'
          animationConfig={{ pressScale: 0.85 }}
          className='h-[26px] w-[26px] items-center justify-center rounded-full'
          style={NAV_BUTTON_STYLE}
          hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}
          onPress={onPreviousWeek}
        >
          <ChevronLeft color={colors.gray[600]} size={13} strokeWidth={2.5} />
        </AnimatedPressable>

        <AnimatedPressable
          accessibilityHint={isViewingPast ? 'Tap to return to today' : 'Tap to open calendar'}
          accessibilityLabel={dateRangeText}
          animationConfig={{ pressScale: 0.97 }}
          onPress={isViewingPast ? onJumpToToday : onDateRangePress}
        >
          <Text
            className='text-[16px] font-extrabold leading-[20px]'
            style={{ color: calColors.primaryText, letterSpacing: -0.3 }}
          >
            {dateRangeText}
          </Text>
          {isViewingPast && (
            <Text
              className='text-[11px] font-medium'
              style={{ color: colors.streak[300] }}
            >
              Today →
            </Text>
          )}
        </AnimatedPressable>

        <AnimatedPressable
          accessibilityLabel='Next week'
          accessibilityRole='button'
          accessibilityState={{ disabled: !canNavigateForward }}
          animationConfig={{ pressScale: 0.85 }}
          className='h-[26px] w-[26px] items-center justify-center rounded-full'
          style={{
            ...NAV_BUTTON_STYLE,
            opacity: canNavigateForward ? 1 : 0.3,
          }}
          disabled={!canNavigateForward}
          disableAnimation={!canNavigateForward}
          hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}
          onPress={onNextWeek}
        >
          <ChevronRight
            color={canNavigateForward ? colors.gray[600] : colors.gray[400]}
            size={13}
            strokeWidth={2.5}
          />
        </AnimatedPressable>
      </View>

      {/* RIGHT: completion ring */}
      <CompletionRing
        completed={completedToday}
        reduceMotion={reduceMotion}
        total={totalHabits}
      />
    </View>
  );
};
