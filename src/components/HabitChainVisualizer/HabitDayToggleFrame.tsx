import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { buildDayToggleFadeOut } from './dayToggleFadeOut';
import { getFrameStyle } from './habitDayToggleStyles';
import type { useHabitDayToggleTierStyles } from './useHabitDayToggleTierStyles';

interface FrameColors {
  background: string;
  border: string;
}

interface Props {
  borderRadius: number;
  cellStyle: ReturnType<typeof useHabitDayToggleTierStyles>['cellStyle'];
  completed: boolean;
  missed: boolean;
  reduceMotion: boolean;
  restingColors: FrameColors;
  tierColors: FrameColors;
}

/**
 * Two layers, on purpose:
 * - the resting frame is a plain React-owned style, so a re-render always
 *   repaints the correct color even if Reanimated drops the cell's settled
 *   animated props (software-mansion/react-native-reanimated#9574);
 * - the completed overlay only exists while the day is checked and leaves via
 *   an exiting layout animation, which is what produces the uncheck fade.
 */
export const HabitDayToggleFrame: React.FC<Props> = ({
  borderRadius,
  cellStyle,
  completed,
  missed,
  reduceMotion,
  restingColors,
  tierColors,
}) => (
  <>
    <View
      pointerEvents='none'
      style={[
        StyleSheet.absoluteFill,
        getFrameStyle({
          backgroundColor: restingColors.background,
          borderColor: restingColors.border,
          borderRadius,
          missed,
        }),
      ]}
    />
    {completed ? (
      <Animated.View
        exiting={buildDayToggleFadeOut(reduceMotion)}
        pointerEvents='none'
        style={[
          StyleSheet.absoluteFill,
          getFrameStyle({
            backgroundColor: tierColors.background,
            borderColor: tierColors.border,
            borderRadius,
            missed: false,
          }),
          cellStyle,
        ]}
      />
    ) : null}
  </>
);
