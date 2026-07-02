import React from 'react';
import { View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, { createAnimatedComponent } from 'react-native-reanimated';

import { DayCell } from './DayCell';
import type { DayStripProps } from './DayStrip.types';

const AnimatedView = (() => {
  const fallback = createAnimatedComponent(View);
  return typeof fallback === 'function' ? fallback : (Animated.View ?? View);
})();

/** Renders the 7-day strip with streak connectors and swipe gesture */
const DayStripComponent: React.FC<DayStripProps> = ({
  dates,
  completionCounts,
  completionStatuses,
  augmentedColors,
  hasCompletionData,
  completionIcon,
  ghostConnectorColor,
  currentStreak,
  strengthPercent,
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
              connectLeft={isComplete ? prevComplete : false}
              connectRight={isComplete ? nextComplete : false}
              currentStreak={currentStreak}
              date={date}
              disableFutureDayPress={disableFutureDayPress}
              ghostConnectorColor={ghostConnectorColor}
              ghostLeft={ghostLeft}
              ghostRight={ghostRight}
              hasCompletionData={hasCompletionData}
              index={index}
              isCurrentDay={isTodayCell}
              isDayPressEnabled={isDayPressEnabled}
              isUpcoming={isFuture(date)}
              reduceMotion={reduceMotion}
              streakConnectorColor={connectorColor}
              strengthPercent={strengthPercent}
              total={completionCounts[index]?.total ?? 0}
              onDayPress={onDayPress}
            />
          );
        })}
      </AnimatedView>
    </View>
  </GestureDetector>
);

export const DayStrip = React.memo(DayStripComponent);
