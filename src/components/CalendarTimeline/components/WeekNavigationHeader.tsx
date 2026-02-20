import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

import type { CalendarColors } from '../CalendarTimeline.types';
import { CompletionRing } from './CompletionRing';

interface WeekNavigationHeaderProps {
  dateRangeText: string;
  onPreviousWeek?: () => void;
  onNextWeek?: () => void;
  canNavigateForward: boolean;
  colors: CalendarColors;
  onJumpToToday?: () => void;
  onDateRangePress?: () => void;
  completedToday?: number;
  totalHabits?: number;
  reduceMotion?: boolean;
}

/** Header row: ◀ [Title] ▶ on left, completion ring on right */
export const WeekNavigationHeader: React.FC<WeekNavigationHeaderProps> = ({
  dateRangeText,
  onPreviousWeek,
  onNextWeek,
  canNavigateForward,
  colors,
  onJumpToToday,
  onDateRangePress,
  completedToday = 0,
  totalHabits = 0,
  reduceMotion = false,
}) => {
  const isViewingPast = canNavigateForward && !!onJumpToToday;

  return (
    <View className='mb-3 flex-row items-center justify-between'>
      {/* LEFT: nav arrows flanking title */}
      <View className='flex-row items-center' style={{ gap: 6 }}>
        <Pressable
          accessibilityLabel='Previous week'
          accessibilityRole='button'
          className='h-7 w-7 items-center justify-center rounded-full'
          style={{
            backgroundColor: '#fafaf9',
            borderWidth: 1,
            borderColor: '#e7e5e4',
          }}
          hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}
          onPress={onPreviousWeek}
        >
          <ChevronLeft color='#57534e' size={14} strokeWidth={2.5} />
        </Pressable>

        <Pressable
          accessibilityHint={
            isViewingPast ? 'Tap to return to today' : 'Tap to open calendar'
          }
          accessibilityLabel={dateRangeText}
          onPress={isViewingPast ? onJumpToToday : onDateRangePress}
        >
          <Text
            className='text-[17px] font-extrabold leading-[22px]'
            style={{ color: colors.primaryText, letterSpacing: -0.3 }}
          >
            {dateRangeText}
          </Text>
          {isViewingPast && (
            <Text
              className='text-[11px] font-medium'
              style={{ color: '#f59e0b' }}
            >
              Today →
            </Text>
          )}
        </Pressable>

        <Pressable
          accessibilityLabel='Next week'
          accessibilityRole='button'
          accessibilityState={{ disabled: !canNavigateForward }}
          className='h-7 w-7 items-center justify-center rounded-full'
          style={{
            backgroundColor: '#fafaf9',
            borderWidth: 1,
            borderColor: '#e7e5e4',
            opacity: canNavigateForward ? 1 : 0.3,
          }}
          disabled={!canNavigateForward}
          hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}
          onPress={onNextWeek}
        >
          <ChevronRight
            color={canNavigateForward ? '#57534e' : '#a8a29e'}
            size={14}
            strokeWidth={2.5}
          />
        </Pressable>
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
