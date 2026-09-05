import { Dimensions } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';
import { durations } from '@/theme/animations';

export { project, rubberband } from '@/theme/sheetMotion';
export {
  sheetEasing as EASE_SHEET,
  uiEaseOut as EASE_OUT,
} from '@/theme/animations';

export const SCREEN_HEIGHT = Dimensions.get('window').height;
export const BACKDROP_OPACITY = 0.34;
export const BACKDROP_DURATION_MS = durations.backdrop;
export const SHEET_DURATION_MS = durations.sheet;

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
