/**
 * CalendarTimeline - DEBUG VERSION
 *
 * Super obvious colored gradients to verify the effect is working
 * Use this temporarily to see if gradients render, then switch back to subtle version
 */

import React, { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useCalendarTimelineLogic } from './CalendarTimeline.hooks';

export interface CalendarTimelineProps {
  dates: Date[];
  onPreviousWeek?: () => void;
  onNextWeek?: () => void;
  canNavigateForward?: boolean;
  showSeparator?: boolean;
  highContrastMode?: boolean;
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
}

const CalendarTimelineDebug: React.FC<CalendarTimelineProps> = ({
  dates,
  onPreviousWeek,
  onNextWeek,
  canNavigateForward = true,
  showSeparator = true,
  highContrastMode = false,
  selectedDate: _selectedDate,
  onDateSelect: _onDateSelect,
}) => {
  const { isToday, isFuture } = useCalendarTimelineLogic();

  if (dates.length === 0) {
    return null;
  }

  const firstDate = dates[0];
  const lastDate = dates.at(-1);
  const dateRangeText = `${format(firstDate, 'MMM d')} - ${format(lastDate, 'MMM d')}`;

  const colors = highContrastMode
    ? {
        currentDayBackground: '#facc15',
        currentDayText: '#000000',
        dayBackground: '#000000',
        dayBorder: '#facc15',
        dayText: '#ffffff',
        icon: '#facc15',
        primaryText: '#ffffff',
        secondaryText: '#facc15',
      }
    : {
        currentDayBackground: '#1a1a1a',
        currentDayText: '#ffffff',
        dayBackground: '#ffffff',
        dayBorder: 'transparent',
        dayText: '#1a1a1a',
        icon: '#1a1a1a',
        primaryText: '#1a1a1a',
        secondaryText: '#9ca3af',
      };

  const backgroundColor = highContrastMode ? 'transparent' : '#f9fafb';

  return (
    <View
      className='mb-0 rounded-2xl pb-3 pt-1'
      style={{ backgroundColor }}
    >
      {/* DEBUG: Bright colored gradients to verify they work */}
      <View className='relative mb-2.5 flex-row items-center justify-between'>
        {/* LEFT GRADIENT - BRIGHT BLUE for debugging */}
        <View
          className='absolute left-0 top-0 bottom-0 pointer-events-none'
          style={{ width: 80, zIndex: 5 }}
        >
          <LinearGradient
            colors={[
              'rgba(59, 130, 246, 0.8)',   // Bright blue
              'rgba(59, 130, 246, 0.5)',
              'rgba(59, 130, 246, 0.3)',
              'rgba(59, 130, 246, 0)',
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ flex: 1 }}
          />
        </View>

        <Pressable
          accessibilityLabel='Previous week'
          accessibilityRole='button'
          className='h-9 w-7 items-center justify-center rounded-full'
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          onPress={onPreviousWeek}
          style={{ zIndex: 20 }}
        >
          <ChevronLeft color={colors.icon} size={18} strokeWidth={2} />
        </Pressable>

        <Text
          className='text-[17px] font-semibold leading-[22px]'
          style={{ color: colors.primaryText }}
        >
          {dateRangeText} 🐛 DEBUG
        </Text>

        <Pressable
          accessibilityLabel='Next week'
          accessibilityRole='button'
          accessibilityState={{ disabled: !canNavigateForward }}
          className={`h-9 w-7 items-center justify-center rounded-full ${canNavigateForward ? '' : 'opacity-40'}`}
          disabled={!canNavigateForward}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          onPress={onNextWeek}
          style={{ zIndex: 20 }}
        >
          <ChevronRight color={colors.icon} size={18} strokeWidth={2} />
        </Pressable>

        {/* RIGHT GRADIENT - BRIGHT GREEN for debugging */}
        {canNavigateForward && (
          <View
            className='absolute right-0 top-0 bottom-0 pointer-events-none'
            style={{ width: 80, zIndex: 5 }}
          >
            <LinearGradient
              colors={[
                'rgba(34, 197, 94, 0)',     // Transparent
                'rgba(34, 197, 94, 0.3)',
                'rgba(34, 197, 94, 0.5)',
                'rgba(34, 197, 94, 0.8)',   // Bright green
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ flex: 1 }}
            />
          </View>
        )}
      </View>

      {/* Days Row */}
      <View className='flex-row items-start justify-between'>
        {dates.map((date, index) => {
          const weekday = format(date, 'EEE');
          const dayNumber = format(date, 'd');
          const isCurrentDay = isToday(date);
          const isUpcoming = isFuture(date);

          const baseLabel = `${weekday}, ${format(date, 'MMM')} ${dayNumber}`;
          const accessibilityLabel = isCurrentDay
            ? `Today, ${baseLabel}`
            : baseLabel;

          return (
            <View
              key={`timeline-day-${index}`}
              accessibilityLabel={accessibilityLabel}
              accessibilityRole='text'
              className='flex-1 items-center gap-0.5'
            >
              <Text
                className='text-center text-[13px] font-normal leading-[18px]'
                style={{ color: colors.secondaryText }}
              >
                {weekday}
              </Text>

              <View
                className='h-9 w-9 items-center justify-center rounded-[11px]'
                style={{
                  backgroundColor: isCurrentDay
                    ? 'transparent'
                    : colors.dayBackground,
                  borderColor: isCurrentDay ? '#1a1a1a' : (highContrastMode ? colors.dayBorder : 'transparent'),
                  borderWidth: isCurrentDay ? 2 : (highContrastMode && !isCurrentDay ? 2 : 0),
                }}
              >
                <Text
                  className='text-center text-[17px] font-semibold leading-[22px]'
                  style={{
                    color: isCurrentDay
                      ? '#1a1a1a'
                      : colors.dayText,
                    fontWeight: isCurrentDay ? '700' : '600',
                  }}
                >
                  {dayNumber}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export const CalendarTimelineDebug = memo(CalendarTimelineDebug);
