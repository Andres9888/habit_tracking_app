import { useEffect, useState } from 'react';
import {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import {
  ENTRANCE_DURATION,
  EXIT_TIMING,
  SLIDE_OFFSET,
} from './WeekNavRow.constants';

/** Drives the entrance/exit animation of the "Today" pill and its spacer. */
export const useWeekNavRowAnimation = (showToday: boolean) => {
  const [shouldRender, setShouldRender] = useState(showToday);
  const spacerFlex = useSharedValue(showToday ? 0 : 1);
  const todayOpacity = useSharedValue(0);
  const todayTranslateX = useSharedValue(SLIDE_OFFSET);
  const todayScale = useSharedValue(0.9);

  useEffect(() => {
    if (showToday) {
      setShouldRender(true);
      const timing = { duration: ENTRANCE_DURATION };
      spacerFlex.value = withTiming(0, timing);
      todayOpacity.value = withTiming(1, timing);
      todayTranslateX.value = withTiming(0, timing);
      todayScale.value = withTiming(1, timing);
    } else {
      todayOpacity.value = withTiming(0, EXIT_TIMING, (finished) => {
        if (finished) runOnJS(setShouldRender)(false);
      });
      todayScale.value = withTiming(0.85, EXIT_TIMING);
      todayTranslateX.value = withTiming(SLIDE_OFFSET, EXIT_TIMING);
      spacerFlex.value = withTiming(1, EXIT_TIMING);
    }
  }, [showToday, spacerFlex, todayOpacity, todayTranslateX, todayScale]);

  const spacerStyle = useAnimatedStyle(() => ({ flex: spacerFlex.value }));
  const todayEntranceStyle = useAnimatedStyle(() => ({
    opacity: todayOpacity.value,
    transform: [
      { translateX: todayTranslateX.value },
      { scale: todayScale.value },
    ],
  }));

  return { shouldRender, spacerStyle, todayEntranceStyle };
};
