import { Dimensions } from 'react-native';
import { Easing } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';

export const SCREEN_HEIGHT = Dimensions.get('window').height;
export const BACKDROP_OPACITY = 0.34;
export const BACKDROP_DURATION_MS = 180;
export const SHEET_DURATION_MS = 300;
export const EASE_OUT = Easing.bezier(0.23, 1, 0.32, 1);
export const EASE_SHEET = Easing.bezier(0.32, 0.72, 0, 1);

export interface NoteSheetMotionValues {
  backdropOpacity: SharedValue<number>;
  closing: SharedValue<boolean>;
  dragStartY: SharedValue<number>;
  measuredHeight: SharedValue<number>;
  sheetOpacity: SharedValue<number>;
  translateY: SharedValue<number>;
}

export interface UseNoteSheetGestureOptions {
  finishClose: () => void;
  reduceMotion: boolean;
  values: NoteSheetMotionValues;
}

export function project(velocity: number, decelerationRate = 0.998) {
  'worklet';
  return ((velocity / 1000) * decelerationRate) / (1 - decelerationRate);
}

export function rubberband(
  overshoot: number,
  dimension: number,
  constant = 0.55
) {
  'worklet';
  return (
    (overshoot * dimension * constant) /
    (dimension + constant * Math.abs(overshoot))
  );
}
