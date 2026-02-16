/**
 * Modal Component - Shared Base Modal
 * 
 * Reusable modal component with three variants and consistent behavior.
 * 
 * **Variants:**
 * 1. `bottomSheet` - Slides up from bottom with swipe-to-dismiss
 * 2. `fullScreen` - Full screen with vertical swipe gesture
 * 3. `centerAlert` - Centered dialog with scale animation
 * 
 * **Common Features:**
 * - Semi-transparent backdrop (configurable opacity)
 * - Backdrop tap to close (optional)
 * - Gesture-based dismissal (optional)
 * - Reanimated-based animations
 * - Respects system reduce motion preference
 * - Status bar translucent for full-screen experience
 * 
 * **Architecture:**
 * - `ModalBackdrop` - Animated backdrop with tap handler
 * - `ModalContent` - Gesture-enabled content container
 * - `useModalAnimations` - Hook managing animation values
 * - `useModalGestures` - Hook managing pan gestures
 * - `useModalStyles` - Hook deriving animated styles
 * - `useReduceMotion` - Hook detecting accessibility preference
 * 
 * **Lifecycle:**
 * - Opens: visible=true triggers enter animation
 * - Closes: onClose callback, triggered by:
 *   - Backdrop tap (if disableBackdropClose=false)
 *   - Swipe gesture (if disableGestureClose=false)
 *   - Hardware back button (Android)
 *   - Close button in content (app-specific)
 * 
 * **Usage Pattern:**
 * ```tsx
 * <Modal variant="bottomSheet" visible={isOpen} onClose={handleClose}>
 *   <YourContent />
 * </Modal>
 * ```
 * 
 * **Used by:**
 * - PauseHabitModal (centerAlert)
 * - TipQuickActionsSheet (bottomSheet)
 * - TemplateScienceModal (fullScreen)
 * - ActivationModal (fullScreen)
 * - Many others - see modal component files for usage
 * 
 * **Not used by:**
 * - SettingsModal (uses RN Modal directly for custom nav)
 * - CreateHabitModal (uses RN Modal for custom swipe handling)
 * - EmojiPickerSheet (custom implementation with BlurView)
 */

import React from 'react';
import { Modal as RNModal, View } from 'react-native';
import type { ModalProps } from './Modal.types';
import { styles } from './Modal.styles';
import { useReduceMotion } from './useReduceMotion';
import { useModalAnimations } from './useModalAnimations';
import { useModalStyles } from './useModalStyles';
import { useModalGestures } from './useModalGestures';
import { ModalBackdrop } from './ModalBackdrop';
import { ModalContent } from './ModalContent';

export function Modal({
  visible,
  onClose,
  variant = 'bottomSheet',
  children,
  disableBackdropClose = false,
  disableGestureClose = false,
  backdropOpacity = 0.5,
  style,
  respectReduceMotion = true,
}: ModalProps) {
  const reduceMotion = useReduceMotion(respectReduceMotion);
  const animationValues = useModalAnimations({
    backdropOpacity,
    reduceMotion,
    respectReduceMotion,
    variant,
    visible,
  });
  const animatedStyles = useModalStyles(animationValues);
  const { panGestureBottomSheet, panGestureFullScreen } = useModalGestures({
    disableGestureClose,
    fullScreenGestureY: animationValues.fullScreenGestureY,
    fullScreenProgress: animationValues.fullScreenProgress,
    onClose,
    translateY: animationValues.translateY,
    variant,
  });

  return (
    <RNModal
      statusBarTranslucent
      transparent
      animationType='none'
      visible={visible}
      onRequestClose={onClose}
    >
      <View
        style={[
          styles.container,
          variant === 'fullScreen' && styles.containerFullScreen,
          variant === 'centerAlert' && styles.containerCenterAlert,
        ]}
      >
        <ModalBackdrop
          backdropStyle={animatedStyles.backdropStyle}
          disableBackdropClose={disableBackdropClose}
          onClose={onClose}
        />
        <ModalContent
          animatedStyles={animatedStyles}
          customStyle={style}
          panGestureBottomSheet={panGestureBottomSheet}
          panGestureFullScreen={panGestureFullScreen}
          variant={variant}
        >
          {children}
        </ModalContent>
      </View>
    </RNModal>
  );
}

export default Modal;
