import React from 'react';
import { View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, { createAnimatedComponent } from 'react-native-reanimated';

import type {
  CalendarColors,
  CompletionStatus,
} from '../CalendarTimeline.types';
import { DayCell } from './DayCell';

interface DayStripProps {
  dates: Date[];
  completionStatuses: CompletionStatus[];
  augmentedColors: CalendarColors & {
    borderWidth?: number;
    highContrastBorder?: string;
  };
  hasCompletionData: boolean;
  connectorColor: string;
  reduceMotion: boolean;
  disableFutureDayPress: boolean;
  isDayPressEnabled: boolean;
  isToday: (d: Date) => boolean;
  isFuture: (d: Date) => boolean;
  onDayPress?: (date: Date) => void;
  panGesture: ReturnType<
    typeof import('react-native-gesture-handler').Gesture.Pan
  >;
  weekTransitionStyle: ReturnType<
    typeof import('react-native-reanimated').useAnimatedStyle
  >;
}

const AnimatedView = (() => {
  const fallback = createAnimatedComponent(View);
  return typeof fallback === 'function' ? fallback : Animated.View ?? View;
})();

/** Renders the 7-day strip with streak connectors and swipe gesture */
export const DayStrip: React.FC<DayStripProps> = ({
  dates,
  completionStatuses,
  augmentedColors,
  hasCompletionData,
  connectorColor,
  reduceMotion,
  disableFutureDayPress,
  isDayPressEnabled,
  isToday,
  isFuture,
  onDayPress,
  panGesture,
  weekTransitionStyle,
}) => (
  <GestureDetector gesture={panGesture}>
    <View collapsable={false}>
      <AnimatedView
        className='flex-row items-start justify-between'
        style={weekTransitionStyle}
      >
        {dates.map((date, index) => {
          const status = completionStatuses[index];
          const isComplete = status === 'complete';
          const prevComplete =
            index > 0 && completionStatuses[index - 1] === 'complete';
          const nextComplete =
            index < dates.length - 1 &&
            completionStatuses[index + 1] === 'complete';
          return (
            <DayCell
              key={`timeline-day-${index}`}
              colors={augmentedColors}
              completionStatus={status}
              connectLeft={isComplete && prevComplete}
              connectRight={isComplete && nextComplete}
              date={date}
              disableFutureDayPress={disableFutureDayPress}
              hasCompletionData={hasCompletionData}
              index={index}
              isCurrentDay={isToday(date)}
              isDayPressEnabled={isDayPressEnabled}
              isUpcoming={isFuture(date)}
              reduceMotion={reduceMotion}
              streakConnectorColor={connectorColor}
              onDayPress={onDayPress}
            />
          );
        })}
      </AnimatedView>
    </View>
  </GestureDetector>
);
