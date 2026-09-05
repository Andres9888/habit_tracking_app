import React from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { GestureDetector } from 'react-native-gesture-handler';
import { useAppTheme } from '../../theme';
import { HabitAddedPanel, useHabitAddedPalette } from '../HabitAddedPanel';
import type { TemplateAddedToastProps } from './types';
import { DEFAULT_DURATION } from './constants';
import { styles } from './styles';
import { buildToastCopy } from './copy';
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

  const keyboardStyle = useAnimatedStyle(() => ({
    bottom: keyboardPosition.bottom,
    transform: [{ translateY: keyboardPosition.translateY.value }],
  }));

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
      style={[styles.container, keyboardStyle]}
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
                    disabled: !actionReady,
                    hint: 'Closes the habit library and scrolls to this habit on Today',
                    label: copy.primaryLabel,
                    onPress: () => {
                      // The toast fade runs in parallel with the focus
                    // request; the library stays open for at least one
                    // settle poll (see useFocusHabitRequest) so press
                    // feedback still registers.
                      viewHabit();
                      handleDismiss();
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
    </Animated.View>
  );
}

export default TemplateAddedToast;
