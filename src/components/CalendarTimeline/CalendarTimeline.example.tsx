/**
 * CalendarTimeline Component - Example Usage
 *
 * This file demonstrates different ways to use the CalendarTimeline component
 * based on the Figma design (node 201:87).
 */

import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { CalendarTimeline } from './CalendarTimeline';
import { addDays, startOfWeek, format } from 'date-fns';

/**
 * Example 1: Basic Timeline (Mon-Fri)
 * Matches the Figma design exactly - shows 5 weekdays
 */
export function BasicTimelineExample() {
  // Get Monday of current week
  const monday = startOfWeek(new Date(), { weekStartsOn: 1 });

  // Generate Mon-Fri dates
  const weekdays = Array.from({ length: 5 }, (_, i) => addDays(monday, i));

  return (
    <View className='bg-white'>
      <CalendarTimeline showSeparator dates={weekdays} />
    </View>
  );
}

/**
 * Example 2: Interactive Timeline with Selection
 * Allows users to select a date from the timeline
 */
export function InteractiveTimelineExample() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const today = new Date();
  const dates = Array.from({ length: 7 }, (_, i) => addDays(today, i));

  return (
    <View className='bg-white'>
      <CalendarTimeline
        showSeparator
        dates={dates}
        selectedDate={selectedDate}
        onDateSelect={(date) => {
          setSelectedDate(date);
          console.log('Selected date:', format(date, 'MMM d, yyyy'));
        }}
      />

      {/* Display selected date */}
      <View className='px-6 py-4'>
        <Text className='text-[14px] text-[#4a5565]'>
          Selected: {format(selectedDate, 'EEEE, MMMM d, yyyy')}
        </Text>
      </View>
    </View>
  );
}

/**
 * Example 3: Extended Week View
 * Shows a full 7-day week (Sun-Sat)
 */
export function ExtendedWeekExample() {
  const sunday = startOfWeek(new Date(), { weekStartsOn: 0 });
  const fullWeek = Array.from({ length: 7 }, (_, i) => addDays(sunday, i));

  return (
    <View className='bg-white'>
      <CalendarTimeline showSeparator dates={fullWeek} />
    </View>
  );
}

/**
 * Example 4: Scrolling Timeline (2 weeks)
 * Demonstrates horizontal scrolling with more dates
 */
export function ScrollingTimelineExample() {
  const today = new Date();
  const twoWeeks = Array.from({ length: 14 }, (_, i) => addDays(today, i));

  return (
    <View className='bg-white'>
      <View className='pb-2 pt-4'>
        <Text className='px-6 text-[16px] font-semibold text-[#101727]'>
          Next 2 Weeks
        </Text>
      </View>
      <CalendarTimeline showSeparator dates={twoWeeks} />
    </View>
  );
}

/**
 * Example 5: Minimal Timeline (No Separator)
 * Clean version without the gradient separator line
 */
export function MinimalTimelineExample() {
  const today = new Date();
  const dates = Array.from({ length: 5 }, (_, i) => addDays(today, i));

  return (
    <View className='bg-[#f9fafb]'>
      <CalendarTimeline dates={dates} showSeparator={false} />
    </View>
  );
}

/**
 * Example 6: Timeline in a Card
 * Shows how to integrate the timeline within a larger UI component
 */
export function TimelineInCardExample() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const monday = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekdays = Array.from({ length: 5 }, (_, i) => addDays(monday, i));
  const lastWeekday = weekdays.at(-1);

  return (
    <View className='bg-[#f3f4f6] p-4'>
      <View className='overflow-hidden rounded-2xl bg-white shadow-sm'>
        {/* Header */}
        <View className='border-b border-[#e7e5e4] px-6 py-4'>
          <Text className='text-[18px] font-semibold text-[#101727]'>
            This Week
          </Text>
          <Text className='mt-1 text-[13px] text-[#6a7282]'>
            {format(weekdays[0], 'MMM d')} -{' '}
            {format(lastWeekday, 'MMM d, yyyy')}
          </Text>
        </View>

        {/* Timeline */}
        <CalendarTimeline
          showSeparator
          dates={weekdays}
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />

        {/* Content area */}
        <View className='p-6'>
          <Text className='text-[14px] text-[#4a5565]'>
            {format(selectedDate, 'EEEE, MMMM d')}
          </Text>
          {/* Add your habit tracking or other content here */}
        </View>
      </View>
    </View>
  );
}

/**
 * Default export for easy importing
 */
export default function CalendarTimelineExamples() {
  return (
    <View className='gap-8 bg-[#f3f4f6] p-4'>
      <BasicTimelineExample />
      <InteractiveTimelineExample />
      <ExtendedWeekExample />
      <ScrollingTimelineExample />
      <MinimalTimelineExample />
      <TimelineInCardExample />
    </View>
  );
}
