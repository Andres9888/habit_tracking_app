/**
 * Modal Component - Main orchestrator
 * Variants: Bottom Sheet, Full Screen, Center Alert
 */

import React from 'react';
import { Modal as RNModal, View } from 'react-native';

import type { ModalProps } from './Modal.types';
import { ModalBackdrop } from './ModalBackdrop';
import { ModalContent } from './ModalContent';
import { styles } from './Modal.styles';
import { useModalAnimations } from './useModalAnimations';
import { useModalGestures } from './useModalGestures';
import { useModalStyles } from './useModalStyles';
import { useReduceMotion } from './useReduceMotion';

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
      accessibilityViewIsModal
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
