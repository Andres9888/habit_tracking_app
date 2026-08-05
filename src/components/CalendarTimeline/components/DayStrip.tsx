import React from 'react';
import { View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, { createAnimatedComponent } from 'react-native-reanimated';

import type {
  CalendarColors,
  CompletionStatus,
  DayCompletionStatus,
} from '../CalendarTimeline.types';
import { DayCell } from './DayCell';

interface DayStripProps {
  dates: Date[];
  completionCounts: DayCompletionStatus[];
  completionStatuses: CompletionStatus[];
  augmentedColors: CalendarColors & {
    borderWidth?: number;
    highContrastBorder?: string;
  };
  hasCompletionData: boolean;
  connectorColor: string;
  reduceMotion: boolean;
  completionIcon?: 'chain' | 'checkbox';
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
  return typeof fallback === 'function' ? fallback : (Animated.View ?? View);
})();

/** Renders the 7-day strip with streak connectors and swipe gesture */
export const DayStrip: React.FC<DayStripProps> = ({
  dates,
  completionCounts,
  completionStatuses,
  augmentedColors,
  hasCompletionData,
  completionIcon,
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
          const isTodayCell = isToday(date);
          const nextIsToday =
            index < dates.length - 1 && isToday(dates[index + 1]);
          const nextIncomplete =
            nextIsToday && completionStatuses[index + 1] !== 'complete';
          const ghostLeft =
            isTodayCell && !isComplete && status !== 'future' && prevComplete;
          const ghostRight = isComplete && nextIncomplete;
          return (
            <DayCell
              key={`timeline-day-${index}`}
              colors={augmentedColors}
              completed={completionCounts[index]?.completed ?? 0}
              completionIcon={completionIcon}
              completionStatus={status}
              connectLeft={isComplete ? prevComplete : undefined}
              connectRight={isComplete ? nextComplete : undefined}
              date={date}
              disableFutureDayPress={disableFutureDayPress}
              ghostLeft={ghostLeft}
              ghostRight={ghostRight}
              hasCompletionData={hasCompletionData}
              index={index}
              isCurrentDay={isTodayCell}
              isDayPressEnabled={isDayPressEnabled}
              isUpcoming={isFuture(date)}
              reduceMotion={reduceMotion}
              streakConnectorColor={connectorColor}
              total={completionCounts[index]?.total ?? 0}
              onDayPress={onDayPress}
            />
          );
        })}
      </AnimatedView>
    </View>
  </GestureDetector>
);
