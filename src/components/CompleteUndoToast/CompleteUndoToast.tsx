/**
 * CompleteUndoToast Component
 *
 * Shown after the one-way "Mark as done" CTA — offers the only way back
 * (Undo) instead of letting a second tap on the button silently reverse the
 * completion. Undo routes through the same toggle mutation as every other
 * surface, so streak/calendar state stays the single source of truth.
 */

import { Pressable, Text, View } from 'react-native';
import { Undo2 } from 'lucide-react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { iconSizes } from '../../theme/iconSizes';
import { typography } from '../../theme/typography';
import { useThemeColors } from '../../theme/ThemeContext';
import { useCompletionToastAnimations } from '../CompletionToast/useCompletionToastAnimations';
import { useToastStyles } from './styles';
import type { CompleteUndoToastProps } from './types';

export function CompleteUndoToast({
  visible,
  message,
  duration = 3200,
  onUndo,
  onDismiss,
}: CompleteUndoToastProps) {
  const { colors } = useThemeColors();
  const insets = useSafeAreaInsets();
  const styles = useToastStyles();

  const { animatedStyle, panGesture } = useCompletionToastAnimations({
    duration,
    onDismiss,
    visible,
  });

  if (!visible) return null;

  return (
    <View
      pointerEvents='box-none'
      style={[styles.container, { bottom: insets.bottom + 16 }]}
    >
      <GestureDetector gesture={panGesture}>
        <View collapsable={false}>
          <Animated.View
            accessible
            accessibilityLabel={`${message} Double tap to undo.`}
            accessibilityLiveRegion='polite'
            accessibilityRole='alert'
            style={[styles.toast, animatedStyle]}
          >
            <View style={styles.content}>
              <Text
                numberOfLines={2}
                style={[typography.body, styles.message]}
              >
                {message}
              </Text>
            </View>
            <Pressable
              accessibilityLabel='Undo, mark as not done'
              accessibilityRole='button'
              style={({ pressed }) => [
                styles.undoButton,
                pressed && styles.undoButtonPressed,
              ]}
              onPress={onUndo}
            >
              <Undo2
                color={colors.status.successText}
                size={iconSizes.small}
                strokeWidth={2.5}
              />
              <Text style={styles.undoText}>UNDO</Text>
            </Pressable>
          </Animated.View>
        </View>
      </GestureDetector>
    </View>
  );
}

export default CompleteUndoToast;
