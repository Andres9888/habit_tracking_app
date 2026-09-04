import React from 'react';
import { Animated, View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import { useAppTheme } from '../../theme';
import { HabitAddedPanel, useHabitAddedPalette } from '../HabitAddedPanel';
import type { TemplateAddedToastProps } from './types';
import { DEFAULT_DURATION } from './constants';
import { styles } from './styles';
import { buildToastCopy, TOAST_ACTION_COPY } from './copy';
import { buildToastActions } from './toastActions';
import { useTemplateAddedToastAnimations } from './useTemplateAddedToastAnimations';
import { useToastKeyboardPosition } from './useToastKeyboardPosition';

export function TemplateAddedToast({
  actionReady = true,
  visible,
  templateData,
  duration = DEFAULT_DURATION,
  variant = 'success',
  sessionImportCount = 0,
  onDismiss,
  onViewHabit,
  onViewHabits,
  onAddAnother,
  primaryHint = TOAST_ACTION_COPY.primaryHint,
  secondaryHint = TOAST_ACTION_COPY.secondaryHint,
  secondaryLabel = TOAST_ACTION_COPY.secondaryLabel,
  style,
}: TemplateAddedToastProps) {
  const theme = useAppTheme();
  const palette = useHabitAddedPalette();
  const keyboardPosition = useToastKeyboardPosition();
  const viewHabit = onViewHabit ?? onViewHabits;
  const { toastStyle, iconStyle, handleDismiss, panGesture } =
    useTemplateAddedToastAnimations({
      duration,
      onDismiss,
      variant,
      visible,
    });

  if (!visible || !templateData) return null;
  const copy = buildToastCopy({
    name: templateData.name,
    pending: !actionReady,
    sessionImportCount,
    variant,
  });

  return (
    <Animated.View
      pointerEvents='auto'
      testID='templates-toast-container'
      style={[
        styles.container,
        {
          bottom: keyboardPosition.bottom,
          transform: [{ translateY: keyboardPosition.translateY }],
        },
      ]}
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
            {...buildToastActions({
              actionReady,
              handleDismiss,
              primaryHint,
              primaryLabel: copy.primaryLabel,
              secondaryHint,
              secondaryLabel,
              viewHabit,
              onAddAnother,
            })}
          />
        </View>
      </GestureDetector>
    </Animated.View>
  );
}

export default TemplateAddedToast;
