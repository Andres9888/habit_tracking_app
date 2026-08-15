/**
 * The drill-down's binding of the shared post-add confirmation panel.
 *
 * The primary uses the existing exit-to-home contract (the header X) rather
 * than opening Habit Detail — see #1423 — so there is no modal-over-modal
 * transition to sequence.
 *
 * `onKeepExploring` is optional on purpose: it must be the library-back
 * handler and nothing else. A caller that renders the preview with no library
 * behind it has no library to keep exploring, and aliasing it onto the generic
 * dismiss would silently give both buttons the same destination while the
 * secondary label kept promising a different one.
 */

import React from 'react';
import type { SharedValue } from 'react-native-reanimated';
import { HabitAddedPanel } from '../../HabitAddedPanel';
import { useDetailPalette } from '../detailPalette';
import type { PressHandlers } from '../FullsizeTemplatePreview.types';

interface PostAddCommitPanelProps {
  checkmarkAnimatedStyle: object;
  createPressHandlers: (
    scale: SharedValue<number>,
    scaleValue?: number
  ) => PressHandlers;
  primaryButtonScale: SharedValue<number>;
  primaryButtonStyle: object;
  secondaryButtonScale: SharedValue<number>;
  secondaryButtonStyle: object;
  successPanelStyle: object;
  templateName: string;
  onGoToToday: () => void;
  onKeepExploring?: () => void;
}

export function PostAddCommitPanel({
  checkmarkAnimatedStyle,
  createPressHandlers,
  primaryButtonScale,
  primaryButtonStyle,
  secondaryButtonScale,
  secondaryButtonStyle,
  successPanelStyle,
  templateName,
  onGoToToday,
  onKeepExploring,
}: PostAddCommitPanelProps) {
  const palette = useDetailPalette();

  return (
    <HabitAddedPanel
      checkStyle={checkmarkAnimatedStyle}
      headline={`${templateName} is in your habits`}
      message="Complete it from Today when it's due."
      palette={palette}
      style={successPanelStyle}
      testID='templates-preview-added'
      primary={{
        hint: 'Closes the habit library and returns to Today',
        label: `Go to Today and complete ${templateName}`,
        pressHandlers: createPressHandlers(primaryButtonScale),
        style: primaryButtonStyle,
        testID: 'templates-preview-go-to-today',
        onPress: onGoToToday,
      }}
      secondary={
        onKeepExploring
          ? {
              hint: 'Returns to the habit library, which stays open',
              label: 'Keep exploring habits',
              pressHandlers: createPressHandlers(secondaryButtonScale, 0.98),
              style: secondaryButtonStyle,
              testID: 'templates-preview-keep-exploring',
              onPress: onKeepExploring,
            }
          : undefined
      }
    />
  );
}
