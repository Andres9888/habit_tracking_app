/**
 * StreakCalendar Component
 *
 * Month-view calendar showing completed days as filled green circles
 * and missed days as empty circles. Similar to GitHub contributions.
 */

import React, { memo, useState, useCallback } from 'react';
import { View, Text, Pressable, Modal, ScrollView } from 'react-native';
import { addMonths, subMonths, format } from 'date-fns';
import Animated, { FadeIn } from 'react-native-reanimated';
import type { StreakCalendarProps } from './types';
import { styles } from './styles';
import { useStreakCalendarDays } from './useStreakCalendarDays';
import { StreakDay } from './StreakDay';
import { StreakMonthNavigation } from './StreakMonthNavigation';
import { DayNotesModal } from './DayNotesModal';

const DAY_HEADERS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const StreakCalendar = memo(function StreakCalendar({
  completedDates,
  habitColor,
  habitCreatedAt,
  habitId,
  notes,
}: StreakCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);

  const { weeks } = useStreakCalendarDays({
    completedDates,
    currentMonth,
    habitCreatedAt,
  });

  const goToPreviousMonth = useCallback(() => {
    setCurrentMonth((prev) => subMonths(prev, 1));
  }, []);

  const goToNextMonth = useCallback(() => {
    setCurrentMonth((prev) => addMonths(prev, 1));
  }, []);

  const handleDayPress = useCallback(
    (dateString: string) => {
      setSelectedDate(dateString);
      setIsNotesModalOpen(true);
    },
    []
  );

  const handleCloseNotesModal = useCallback(() => {
    setIsNotesModalOpen(false);
    setSelectedDate(null);
  }, []);

  const selectedDayNotes =
    selectedDate && notes
      ? notes.filter((note) => note.date === selectedDate)
      : [];

  return (
    <>
      <Animated.View style={styles.container} entering={FadeIn.duration(280)}>
        {/* Month/Year Header */}
        <View style={styles.monthHeader}>
          <Text style={styles.monthText}>
            {format(currentMonth, 'MMMM yyyy')}
          </Text>
        </View>

        {/* Day Headers */}
        <View style={styles.row}>
          {DAY_HEADERS.map((day) => (
            <View key={day} style={styles.headerCell}>
              <Text style={styles.headerText}>{day}</Text>
            </View>
          ))}
        </View>

        {/* Calendar Grid */}
        {(weeks ?? []).map((week, weekIndex) => (
          <View key={`week-${weekIndex}`} style={styles.row}>
            {(week ?? []).map((day, dayIndex) =>
              day && day.dateString ? (
                <StreakDay
                  key={day.dateString}
                  day={day}
                  habitColor={habitColor}
                  onPress={handleDayPress}
                />
              ) : (
                <View
                  key={`empty-${weekIndex}-${dayIndex}`}
                  style={styles.dayWrapper}
                />
              )
            )}
          </View>
        ))}

        {/* Month Navigation */}
        <StreakMonthNavigation
          currentMonth={currentMonth}
          onNextMonth={goToNextMonth}
          onPreviousMonth={goToPreviousMonth}
        />
      </Animated.View>

      {/* Notes Modal */}
      <DayNotesModal
        visible={isNotesModalOpen}
        selectedDate={selectedDate}
        notes={selectedDayNotes}
        habitColor={habitColor}
        onClose={handleCloseNotesModal}
      />
    </>
  );
});

export default StreakCalendar;
