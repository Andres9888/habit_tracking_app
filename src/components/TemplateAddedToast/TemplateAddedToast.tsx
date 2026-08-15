/**
 * Post-add confirmation for adds made straight from the library catalog
 * (the "+ Add" on a row), where there is no drill-down footer to hold it.
 *
 * It renders the same HabitAddedPanel the drill-down shows, floated above the
 * catalog: same heading, same two ways forward, same colors. The old dark
 * capsule said "Added 'X' to your habits" beside a 132px action column, which
 * truncated any real template name and read as a different product from the
 * confirmation one tap deeper.
 *
 * Destinations differ from the drill-down's on purpose: the library's
 * `onViewHabit` closes the library and focuses the matching card on Today, so
 * the primary names the exact habit the user will land on.
 */

import React from 'react';
import { View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppTheme } from '../../theme';
import { HabitAddedPanel, useHabitAddedPalette } from '../HabitAddedPanel';
import type { TemplateAddedToastProps } from './types';
import { DEFAULT_DURATION } from './constants';
import { styles } from './styles';
import { buildToastCopy } from './copy';
import { useTemplateAddedToastAnimations } from './useTemplateAddedToastAnimations';

const ACTION_HANDOFF_DELAY_MS = 320;

export function TemplateAddedToast({
  visible,
  templateData,
  duration = DEFAULT_DURATION,
  variant = 'success',
  sessionImportCount = 0,
  onDismiss,
  onViewHabit,
  onViewHabits,
  onAddAnother,
  style,
}: TemplateAddedToastProps) {
  const theme = useAppTheme();
  const palette = useHabitAddedPalette();
  const insets = useSafeAreaInsets();
  const viewHabit = onViewHabit ?? onViewHabits;

  const { toastStyle, iconStyle, handleDismiss, panGesture } =
    useTemplateAddedToastAnimations({ duration, onDismiss, variant, visible });

  if (!visible || !templateData) return null;

  const copy = buildToastCopy({
    name: templateData.name,
    sessionImportCount,
    variant,
  });

  return (
    <View
      pointerEvents='auto'
      testID='templates-toast-container'
      style={[styles.container, { bottom: insets.bottom + 16 }]}
    >
      <GestureDetector gesture={panGesture}>
        <View collapsable={false} style={styles.gestureArea}>
          <HabitAddedPanel
            checkStyle={iconStyle}
            headline={copy.headline}
            headlineTestID='templates-toast-name'
            message={copy.message}
            palette={palette}
            style={[styles.toast, theme.custom.shadows.card, toastStyle, style]}
            testID='templates-toast'
            primary={
              viewHabit
                ? {
                    hint: 'Closes the habit library and scrolls to this habit on Today',
                    label: copy.primaryLabel,
                    onPress: () => {
                      handleDismiss();
                      // Keep the library mounted until this touch has fully
                      // ended. Closing it synchronously lets the release land
                      // on a Habit Home card and open Habit Details.
                      setTimeout(viewHabit, ACTION_HANDOFF_DELAY_MS);
                    },
                  }
                : {
                    label: 'Keep exploring habits',
                    onPress: () => handleDismiss(),
                  }
            }
            secondary={
              onAddAnother && viewHabit
                ? {
                    hint: 'Returns to the habit library, which stays open',
                    label: 'Keep exploring habits',
                    onPress: () => {
                      handleDismiss();
                      onAddAnother();
                    },
                  }
                : undefined
            }
          />
        </View>
      </GestureDetector>
    </View>
  );
}

export default TemplateAddedToast;
