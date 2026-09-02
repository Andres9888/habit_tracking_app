import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { usePressed } from '../AdvancedOptions/usePressed';
import { useToastStyles } from './styles';
import { useArchiveUndoToast } from './useArchiveUndoToast';

interface ActionToastProps {
  accessibilityLabel: string;
  actionIcon?: ReactNode;
  actionLabel: string;
  actionTextColor: string;
  duration: number;
  icon: ReactNode;
  message: ReactNode;
  progressColor: string;
  tintColor: string;
  visible: boolean;
  onAction: () => void;
  onDismiss?: () => void;
}

/** Shared tall action-toast shell used by archive-family feedback. */
export function ActionToast({
  accessibilityLabel,
  actionIcon,
  actionLabel,
  actionTextColor,
  duration,
  icon,
  message,
  progressColor,
  tintColor,
  visible,
  onAction,
  onDismiss,
}: ActionToastProps) {
  const styles = useToastStyles();
  const insets = useSafeAreaInsets();
  const { pressed, pressProps } = usePressed();
  const { panGesture, containerStyle, progressStyle, handleUndo } =
    useArchiveUndoToast({
      duration,
      onDismiss,
      onUndo: onAction,
      visible,
    });
  const tint = { backgroundColor: tintColor };

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
            accessibilityLabel={accessibilityLabel}
            accessibilityLiveRegion='polite'
            accessibilityRole='alert'
            style={[styles.toast, containerStyle]}
          >
            <View style={styles.content}>
              <View style={[styles.iconContainer, tint]}>{icon}</View>
              <Text numberOfLines={2} style={styles.message}>
                {message}
              </Text>
              <Pressable
                accessibilityLabel={actionLabel}
                accessibilityRole='button'
                style={[
                  styles.undoButton,
                  tint,
                  pressed && styles.undoButtonPressed,
                ]}
                onPress={handleUndo}
                {...pressProps}
              >
                {actionIcon}
                <Text style={[styles.undoText, { color: actionTextColor }]}>
                  {actionLabel.toUpperCase()}
                </Text>
              </Pressable>
            </View>
            <View style={[styles.progressContainer, tint]}>
              <Animated.View
                style={[
                  styles.progressBar,
                  { backgroundColor: progressColor },
                  progressStyle,
                ]}
              />
            </View>
          </Animated.View>
        </View>
      </GestureDetector>
    </View>
  );
}
