/**
 * DeleteUndoToast Component
 *
 * A specialized toast for delete actions with:
 * - 5 second countdown timer with visual progress bar
 * - Undo action button
 * - Swipe to dismiss
 * - Red color scheme matching destructive action
 * - Full dark mode support via theme tokens
 */

import { View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useThemeColors } from '../../theme/ThemeContext';
import { ProgressBar, ToastContent } from './components';
import { layoutStyles, deleteToastColors } from './styles';
import type { DeleteUndoToastProps } from './types';
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
  const { colors, isDark } = useThemeColors();
  const tc = deleteToastColors(isDark, colors);

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
      style={[layoutStyles.container, { bottom: insets.bottom + 16 }]}
    >
      <GestureDetector gesture={panGesture}>
        <Animated.View
          accessible
          accessibilityLabel={`${itemName} will be deleted. Tap undo to cancel.`}
          accessibilityLiveRegion='polite'
          accessibilityRole='alert'
          style={[
            layoutStyles.toast,
            {
              backgroundColor: tc.toastBg,
              borderColor: tc.toastBorder,
              shadowColor: tc.shadowColor,
            },
            containerStyle,
          ]}
        >
          <ToastContent itemName={itemName} onUndo={onUndo ?? (() => {})} />
          <ProgressBar progressStyle={progressStyle} />
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

export default DeleteUndoToast;
