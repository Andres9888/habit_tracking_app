import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, { useReducedMotion } from 'react-native-reanimated';
import { NoteSheetBody } from './NoteSheetBody';
import { useNoteSheetGesture } from './useNoteSheetGesture';
import { useNoteSheetStyles } from './useNoteSheetStyles';
import { useNoteSheetTransition } from './useNoteSheetTransition';

interface NoteSheetProps {
  date: string | null;
  existing: string;
  hint: string;
  onClose: () => void;
  onSave: (note: string) => void;
}

export function NoteSheet(props: NoteSheetProps) {
  const { date, existing, hint, onClose, onSave } = props;
  const [draft, setDraft] = useState(existing);
  const reduceMotion = useReducedMotion();
  const transition = useNoteSheetTransition({ date, onClose, reduceMotion });
  const panGesture = useNoteSheetGesture({
    finishClose: transition.finishClose,
    reduceMotion,
    values: transition.values,
  });
  const motion = useNoteSheetStyles(transition.values);

  useEffect(() => {
    if (date) setDraft(existing);
  }, [date, existing]);

  if (!date) return null;

  return (
    <Modal
      accessibilityViewIsModal
      statusBarTranslucent
      transparent
      animationType='none'
      visible
      onRequestClose={transition.animateOut}
    >
      <View style={styles.root}>
        <Pressable
          accessibilityLabel='Dismiss note sheet'
          style={StyleSheet.absoluteFill}
          onPress={transition.animateOut}
        >
          <Animated.View style={[styles.backdrop, motion.backdropStyle]} />
        </Pressable>
        <GestureDetector gesture={panGesture}>
          <Animated.View
            style={[styles.sheet, motion.sheetStyle]}
            onLayout={(event) => {
              transition.values.measuredHeight.set(
                event.nativeEvent.layout.height
              );
            }}
          >
            <NoteSheetBody
              draft={draft}
              existing={existing}
              hint={hint}
              onCancel={transition.animateOut}
              onChange={setDraft}
              onSave={() => {
                onSave(draft.trim());
                transition.animateOut();
              }}
            />
          </Animated.View>
        </GestureDetector>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(28,32,27,1)',
    flex: 1,
  },
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    width: '100%',
  },
});
