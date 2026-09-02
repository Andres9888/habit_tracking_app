import { useAnimatedStyle } from 'react-native-reanimated';
import type { NoteSheetMotionValues } from './NoteSheet.motion';

export function useNoteSheetStyles(values: NoteSheetMotionValues) {
  const backdropStyle = useAnimatedStyle(() => ({
    opacity: values.backdropOpacity.get(),
  }));
  const sheetStyle = useAnimatedStyle(() => ({
    opacity: values.sheetOpacity.get(),
    transform: [{ translateY: values.translateY.get() }],
  }));

  return { backdropStyle, sheetStyle };
}
