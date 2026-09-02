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

export function PostAddCommitPanel(p: PostAddCommitPanelProps) {
  const palette = useDetailPalette();
  return (
    <HabitAddedPanel
      checkStyle={p.checkmarkAnimatedStyle}
      headline={`${p.templateName} is in your habits`}
      message="Complete it from Today when it's due."
      palette={palette}
      style={p.successPanelStyle}
      testID='templates-preview-added'
      primary={{
        hint: `Closes the habit library and shows ${p.templateName} on Today`,
        label: `Go to Today and complete ${p.templateName}`,
        pressHandlers: p.createPressHandlers(p.primaryButtonScale),
        style: p.primaryButtonStyle,
        testID: 'templates-preview-go-to-today',
        onPress: p.onGoToToday,
      }}
      secondary={
        p.onKeepExploring
          ? {
              hint: 'Returns to the habit library, which stays open',
              label: 'Keep exploring habits',
              pressHandlers: p.createPressHandlers(
                p.secondaryButtonScale,
                0.98
              ),
              style: p.secondaryButtonStyle,
              testID: 'templates-preview-keep-exploring',
              onPress: p.onKeepExploring,
            }
          : undefined
      }
    />
  );
}
