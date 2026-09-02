import { useCallback, useEffect, useRef } from 'react';
import { Keyboard } from 'react-native';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import {
  BACKDROP_DURATION_MS,
  BACKDROP_OPACITY,
  EASE_OUT,
  EASE_SHEET,
  SCREEN_HEIGHT,
  SHEET_DURATION_MS,
} from './NoteSheet.motion';

interface UseNoteSheetTransitionOptions {
  date: string | null;
  onClose: () => void;
  reduceMotion: boolean;
}

export function useNoteSheetTransition({
  date,
  onClose,
  reduceMotion,
}: UseNoteSheetTransitionOptions) {
  const values = {
    backdropOpacity: useSharedValue(0),
    closing: useSharedValue(false),
    dragStartY: useSharedValue(0),
    measuredHeight: useSharedValue(SCREEN_HEIGHT),
    sheetOpacity: useSharedValue(0),
    translateY: useSharedValue(SCREEN_HEIGHT),
  };
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const finishClose = useCallback(() => {
    onCloseRef.current();
  }, []);

  useEffect(() => {
    if (!date) return;
    values.closing.set(false);
    values.translateY.set(reduceMotion ? 0 : SCREEN_HEIGHT);
    values.sheetOpacity.set(
      reduceMotion
        ? withTiming(1, {
            duration: BACKDROP_DURATION_MS,
            easing: EASE_OUT,
          })
        : 1
    );
    values.backdropOpacity.set(
      withTiming(BACKDROP_OPACITY, {
        duration: BACKDROP_DURATION_MS,
        easing: EASE_OUT,
      })
    );
    if (!reduceMotion) {
      values.translateY.set(
        withTiming(0, {
          duration: SHEET_DURATION_MS,
          easing: EASE_SHEET,
        })
      );
    }
  }, [date, reduceMotion]);

  const animateOut = useCallback(() => {
    if (values.closing.get()) return;
    values.closing.set(true);
    Keyboard.dismiss();
    values.backdropOpacity.set(
      withTiming(0, {
        duration: BACKDROP_DURATION_MS,
        easing: EASE_OUT,
      })
    );
    const target = reduceMotion ? values.sheetOpacity : values.translateY;
    target.set(
      withTiming(
        reduceMotion ? 0 : SCREEN_HEIGHT,
        {
          duration: reduceMotion ? BACKDROP_DURATION_MS : 220,
          easing: EASE_OUT,
        },
        (finished) => {
          if (finished) scheduleOnRN(finishClose);
        }
      )
    );
  }, [finishClose, reduceMotion]);

  return { animateOut, finishClose, values };
}
