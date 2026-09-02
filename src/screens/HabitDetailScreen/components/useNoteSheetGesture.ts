import { useMemo } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import {
  Extrapolation,
  interpolate,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import {
  BACKDROP_DURATION_MS,
  BACKDROP_OPACITY,
  EASE_OUT,
  project,
  rubberband,
  SCREEN_HEIGHT,
  SHEET_DURATION_MS,
} from './NoteSheet.motion';
import type { UseNoteSheetGestureOptions } from './NoteSheet.motion';

export function useNoteSheetGesture({
  finishClose,
  reduceMotion,
  values,
}: UseNoteSheetGestureOptions) {
  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetY([-10, 10])
        .onStart(() => {
          'worklet';
          values.dragStartY.set(values.translateY.get());
        })
        .onUpdate((event) => {
          'worklet';
          const height = Math.max(values.measuredHeight.get(), 1);
          const next = values.dragStartY.get() + event.translationY;
          const resisted = next >= 0 ? next : rubberband(next, height);
          values.translateY.set(resisted);
          values.backdropOpacity.set(
            interpolate(
              resisted,
              [0, height],
              [BACKDROP_OPACITY, 0],
              Extrapolation.CLAMP
            )
          );
        })
        .onEnd((event) => {
          'worklet';
          const height = Math.max(values.measuredHeight.get(), 1);
          const projectedY = values.translateY.get() + project(event.velocityY);
          if (projectedY <= height * 0.4) {
            values.translateY.set(
              reduceMotion
                ? 0
                : withSpring(0, {
                    dampingRatio: 1,
                    duration: SHEET_DURATION_MS,
                    velocity: event.velocityY,
                  })
            );
            values.backdropOpacity.set(
              withTiming(BACKDROP_OPACITY, {
                duration: BACKDROP_DURATION_MS,
                easing: EASE_OUT,
              })
            );
            return;
          }
          values.closing.set(true);
          values.backdropOpacity.set(
            withTiming(0, {
              duration: BACKDROP_DURATION_MS,
              easing: EASE_OUT,
            })
          );
          const target = reduceMotion ? values.sheetOpacity : values.translateY;
          target.set(
            withSpring(
              reduceMotion ? 0 : SCREEN_HEIGHT,
              {
                dampingRatio: 1,
                duration: SHEET_DURATION_MS,
                overshootClamping: true,
                velocity: event.velocityY,
              },
              (finished) => {
                if (finished) scheduleOnRN(finishClose);
              }
            )
          );
        }),
    [finishClose, reduceMotion, values]
  );

  return panGesture;
}
