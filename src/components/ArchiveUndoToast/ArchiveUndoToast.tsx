/**
 * ArchiveUndoToast Component
 *
 * A specialized toast for archive actions with:
 * - 5 second countdown timer with visual progress bar
 * - Undo action button
 * - Swipe to dismiss
 * - Amber color scheme matching archive swipe action
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Archive, Undo2 } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';

import { useThemeColors } from '../../theme/ThemeContext';
import { ArchiveUndoToastProps, DEFAULT_DURATION } from './types';
import { useToastStyles } from './styles';
import { useArchiveUndoToast } from './useArchiveUndoToast';

export type { ArchiveUndoToastProps } from './types';

export function ArchiveUndoToast({
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
  const amberIconColor = colors.status.warning;

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
            accessibilityLabel={`${habitName} archived. Tap undo to restore.`}
            accessibilityLiveRegion='polite'
            accessibilityRole='alert'
            style={[styles.toast, containerStyle]}
          >
            <View style={styles.content}>
              <View style={styles.iconContainer}>
                <Archive
                  color={amberIconColor}
                  size={iconSizes.medium}
                  strokeWidth={2}
                />
              </View>

              <Text numberOfLines={1} style={styles.message}>
                <Text style={styles.habitName}>"{habitName}"</Text>
                <Text style={styles.messageText}> archived</Text>
              </Text>

              <Pressable
                accessibilityLabel='Undo archive'
                accessibilityRole='button'
                style={({ pressed }) => [
                  styles.undoButton,
                  pressed && styles.undoButtonPressed,
                ]}
                onPress={handleUndo}
              >
                <Undo2
                  color={amberIconColor}
                  size={iconSizes.small}
                  strokeWidth={2.5}
                />
                <Text style={styles.undoText}>UNDO</Text>
              </Pressable>
            </View>

            <View style={styles.progressContainer}>
              <Animated.View style={[styles.progressBar, progressStyle]} />
            </View>
          </Animated.View>
        </View>
      </GestureDetector>
    </View>
  );
}

export default ArchiveUndoToast;
