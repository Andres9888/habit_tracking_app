/**
 * TooltipOverlay Component
 * 
 * Renders the active tooltip on top of a semi-transparent backdrop.
 * Shows one tooltip at a time based on TooltipTourProvider state.
 */

import { Modal, StyleSheet, View, Pressable } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useTooltipTour } from './TooltipTourProvider';
import { Tooltip } from './Tooltip';

export function TooltipOverlay() {
  const { state, nextStep } = useTooltipTour();

  if (!state.isVisible || state.currentStepIndex === null) {
    return null;
  }

  const currentStep = state.steps[state.currentStepIndex];
  if (!currentStep) {
    return null;
  }

  return (
    <Modal
      transparent
      visible
      animationType="none"
      statusBarTranslucent
    >
      <View style={styles.container}>
        {/* Semi-transparent backdrop */}
        <Pressable style={styles.backdrop} onPress={nextStep}>
          <Animated.View
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
            style={styles.backdropFill}
          />
        </Pressable>

        {/* Tooltip */}
        <Tooltip
          message={currentStep.message}
          position={currentStep.position || { top: 200, left: 40 }}
          placement={currentStep.placement}
          onDismiss={nextStep}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  backdropFill: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
