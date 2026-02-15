/**
 * DeleteUndoToast Component
 *
 * A specialized toast for delete actions with:
 * - 5 second countdown timer with visual progress bar
 * - Undo action button
 * - Swipe to dismiss
 * - Red color scheme matching destructive action
 */

import { View } from 'react-native';

import Animated from 'react-native-reanimated';
import { GestureDetector } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { DeleteUndoToastProps } from './types';
import { ProgressBar, ToastContent } from './components';
import { styles } from './styles';
import { useDeleteToastAnimations } from './useDeleteToastAnimations';

export function DeleteUndoToast({
  visible,
  itemName,
  duration = 5000,
  onDismiss,
  onUndo,
  onConfirm,
}: DeleteUndoToastProps) {
  const insets = useSafeAreaInsets();

  const { containerStyle, panGesture, progressStyle } = useDeleteToastAnimations({
    duration,
    onConfirm: onConfirm ?? (() => {}),
    onDismiss,
    onUndo: onUndo ?? (() => {}),
    visible,
  });

  if (!visible) return null;

  return (
    <View
      pointerEvents='box-none'
      style={[styles.container, { bottom: insets.bottom + 16 }]}
    >
      <GestureDetector gesture={panGesture}>
        <Animated.View
          accessible
          accessibilityLabel={`${itemName} will be deleted. Tap undo to cancel.`}
          accessibilityLiveRegion='polite'
          accessibilityRole='alert'
          style={[styles.toast, containerStyle]}
        >
          <ToastContent itemName={itemName} onUndo={onUndo ?? (() => {})} />
          <ProgressBar progressStyle={progressStyle} />
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

export default DeleteUndoToast;
