import React from 'react';
import { Text, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { useThemeColors } from '../../../theme/ThemeContext';
import { fontFamilies } from '../../../theme/typography';
import { useTodayGlow } from '../hooks/useTodayGlow';

import { DayCellRing } from './DayCellRing';
import type { DayCellContentProps } from './DayCellContent.types';
import { DayEffortForecast } from './DayEffortForecast';

/** The visual content of a day cell — weekday label + SVG progress ring */
const DayCellContentComponent: React.FC<DayCellContentProps> = ({
  weekday,
  capacityMinutes,
  dayNumber,
  isCurrentDay,
  isUpcoming,
  completionStatus,
  completed,
  total,
  hasCompletionData,
  colors,
  completionIcon,
  monthPrefix,
  reduceMotion,
  pressed = false,
  strengthPercent,
  plannedMinutes,
  remainingMinutes,
}) => {
  const { isDark } = useThemeColors();
  const todayGlowStyle = useTodayGlow({
    isCurrentDay,
    isComplete: completionStatus === 'complete',
    reduceMotion,
    isDark,
  });

  return (
    <View>
      <Text
        className='text-center text-[10px] leading-[14px]'
        style={{
          color: colors.secondaryText,
          fontFamily: fontFamilies.primary.text,
          fontWeight: isCurrentDay ? '700' : '500',
          letterSpacing: 0.5,
        }}
      >
        {isCurrentDay ? 'Today' : weekday.toUpperCase()}
      </Text>

      <Animated.View
        style={[
          todayGlowStyle,
          pressed && !reduceMotion && { transform: [{ scale: 0.95 }] },
          pressed && { opacity: reduceMotion ? 0.85 : 0.7 },
        ]}
      >
        <DayCellRing
          completed={completed}
          completionIcon={completionIcon}
          completionStatus={completionStatus}
          dayNumber={dayNumber}
          hasCompletionData={hasCompletionData}
          isCurrentDay={isCurrentDay}
          isDark={isDark}
          isUpcoming={isUpcoming}
          monthPrefix={monthPrefix}
          reduceMotion={reduceMotion}
          strengthPercent={strengthPercent}
          total={total}
        />
      </Animated.View>
      <DayEffortForecast
        capacityMinutes={capacityMinutes}
        isCurrentDay={isCurrentDay}
        isUpcoming={isUpcoming}
        plannedMinutes={plannedMinutes}
        remainingMinutes={remainingMinutes}
      />
    </View>
  );
};

export const DayCellContent = React.memo(DayCellContentComponent);
