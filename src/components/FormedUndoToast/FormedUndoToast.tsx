/**
 * FormedUndoToast Component
 *
 * Celebratory toast shown after marking a habit as formed (right swipe):
 * 5s countdown with progress bar, undo button, swipe to dismiss.
 * Gold/success scheme; reuses the ArchiveUndoToast hook and layout styles.
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Trophy, Undo2 } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';

import { useThemeColors } from '../../theme/ThemeContext';
import type { ArchiveUndoToastProps } from '../ArchiveUndoToast/types';
import { DEFAULT_DURATION } from '../ArchiveUndoToast/types';
import { useToastStyles } from '../ArchiveUndoToast/styles';
import { useArchiveUndoToast } from '../ArchiveUndoToast/useArchiveUndoToast';

export function FormedUndoToast({
  visible,
  habitName,
  duration = DEFAULT_DURATION,
  onDismiss,
  onUndo,
}: ArchiveUndoToastProps) {
  const { colors } = useThemeColors();
  const styles = useToastStyles();
  const insets = useSafeAreaInsets();
  const { panGesture, containerStyle, progressStyle, handleUndo } =
    useArchiveUndoToast({ duration, onDismiss, onUndo, visible });
  const successColor = colors.status.success;
  const tint = { backgroundColor: colors.status.successLight };

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
            accessibilityLabel={`${habitName} marked as formed. Tap undo to keep tracking it.`}
            accessibilityLiveRegion='polite'
            accessibilityRole='alert'
            style={[styles.toast, containerStyle]}
          >
            <View style={styles.content}>
              <View style={[styles.iconContainer, tint]}>
                <Trophy color={successColor} size={iconSizes.medium} strokeWidth={2} />
              </View>

              <Text numberOfLines={2} style={styles.message}>
                <Text style={styles.habitName}>"{habitName}"</Text>
                <Text style={styles.messageText}> is now a formed habit! 🏆</Text>
              </Text>

              <Pressable
                accessibilityLabel='Undo mark as formed'
                accessibilityRole='button'
                style={({ pressed }) => [
                  styles.undoButton,
                  tint,
                  pressed && styles.undoButtonPressed,
                ]}
                onPress={handleUndo}
              >
                <Undo2 color={successColor} size={iconSizes.small} strokeWidth={2.5} />
                <Text style={[styles.undoText, { color: colors.status.successText }]}>
                  UNDO
                </Text>
              </Pressable>
            </View>

            <View style={[styles.progressContainer, tint]}>
              <Animated.View
                style={[
                  styles.progressBar,
                  { backgroundColor: successColor },
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

export default FormedUndoToast;
