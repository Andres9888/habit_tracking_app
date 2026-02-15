
import { useEffect } from 'react';

import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';

const ENTRANCE_STAGGER_DELAY = 100;
const ENTRANCE_DURATION = 350;
const ENTRANCE_TRANSLATE_Y = 20;

export function useTemplateListItemAnimations(
  index: number,
  reduceMotion: boolean
) {
  const entranceOpacity = useSharedValue(reduceMotion ? 1 : 0);
  const entranceTranslateY = useSharedValue(
    reduceMotion ? 0 : ENTRANCE_TRANSLATE_Y
  );
  const templateScale = useSharedValue(1);
  const scienceScale = useSharedValue(1);

  useEffect(() => {
    if (reduceMotion) {
      entranceOpacity.value = 1;
      entranceTranslateY.value = 0;
      return;
    }

    const delay = index * ENTRANCE_STAGGER_DELAY;
    entranceOpacity.value = withDelay(
      delay,
      withTiming(1, {
        duration: ENTRANCE_DURATION,
        easing: Easing.out(Easing.cubic),
      })
    );
    entranceTranslateY.value = withDelay(
      delay,
      withSpring(0, { damping: 18, stiffness: 150 })
    );

    return () => {
      cancelAnimation(entranceOpacity);
      cancelAnimation(entranceTranslateY);
    };
  }, [index, reduceMotion, entranceOpacity, entranceTranslateY]);

  const entranceAnimatedStyle = useAnimatedStyle(() => ({
    opacity: entranceOpacity.value,
    transform: [{ translateY: entranceTranslateY.value }],
  }));

  const templateAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: templateScale.value }],
  }));

  const scienceAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scienceScale.value }],
  }));

  return {
    entranceAnimatedStyle,
    scienceAnimatedStyle,
    scienceScale,
    templateAnimatedStyle,
    templateScale,
  };
}
