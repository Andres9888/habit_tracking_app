/**
 * ArchiveUndoToast Component
 *
 * A specialized toast for archive actions with:
 * - 5 second countdown timer with visual progress bar
 * - Undo action button
 * - Swipe to dismiss
 * - Amber color scheme matching archive swipe action
 * - Full dark mode support via theme tokens
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Archive, Undo2 } from 'lucide-react-native';

import { useThemeColors } from '../../theme/ThemeContext';
import { ArchiveUndoToastProps, DEFAULT_DURATION } from './types';
import { layoutStyles, archiveToastColors } from './styles';
import { useArchiveUndoToast } from './useArchiveUndoToast';

export type { ArchiveUndoToastProps } from './types';

export function ArchiveUndoToast({
  visible,
  habitName,
  duration = DEFAULT_DURATION,
  onDismiss,
  onUndo,
}: ArchiveUndoToastProps) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useThemeColors();
  const tc = archiveToastColors(isDark, colors);
  const { panGesture, containerStyle, progressStyle, handleUndo } =
    useArchiveUndoToast({ duration, onDismiss, onUndo, visible });

  if (!visible) return null;

  return (
    <View
      pointerEvents='box-none'
      style={[layoutStyles.container, { bottom: insets.bottom + 16 }]}
    >
      <GestureDetector gesture={panGesture}>
        <Animated.View
          accessible
          accessibilityLabel={`${habitName} archived. Tap undo to restore.`}
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
          <View style={layoutStyles.content}>
            <View style={[layoutStyles.iconContainer, { backgroundColor: tc.iconBg }]}>
              <Archive color={tc.iconColor} size={18} strokeWidth={2} />
            </View>

            <Text numberOfLines={1} style={layoutStyles.message}>
              <Text style={{ color: tc.habitNameColor, fontWeight: '600' }}>"{habitName}"</Text>
              <Text style={{ color: tc.messageColor }}> archived</Text>
            </Text>

            <Pressable
              accessibilityLabel='Undo archive'
              accessibilityRole='button'
              style={({ pressed }) => [
                layoutStyles.undoButton,
                { backgroundColor: pressed ? tc.undoBgPressed : tc.undoBg },
              ]}
              onPress={handleUndo}
            >
              <Undo2 color={tc.undoColor} size={14} strokeWidth={2.5} />
              <Text style={[layoutStyles.undoText, { color: tc.undoColor }]}>UNDO</Text>
            </Pressable>
          </View>

          <View style={[layoutStyles.progressContainer, { backgroundColor: tc.progressBg }]}>
            <Animated.View style={[layoutStyles.progressBar, { backgroundColor: tc.progressBar }, progressStyle]} />
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

export default ArchiveUndoToast;
