/**
 * Modal Component - Main orchestrator
 * Variants: Bottom Sheet, Full Screen, Center Alert
 */

import React from 'react';
import { Modal as RNModal } from 'react-native';
import type { ModalProps } from './Modal.types';
import { useReduceMotion } from './useReduceMotion';
import { useModalAnimations } from './useModalAnimations';
import { useModalStyles } from './useModalStyles';
import { useModalGestures } from './useModalGestures';
import { ModalBackdrop } from './ModalBackdrop';
import { ModalContent } from './ModalContent';
import { ModalWarmMountHost } from './ModalWarmMountHost';
import { getInlineModalStyles } from './getInlineModalStyles';
import { useModalRenderState } from './useModalRenderState';
import { ModalContainer } from './ModalContainer';

export function Modal({
  visible,
  onClose,
  variant = 'bottomSheet',
  children,
  disableBackdropClose = false,
  disableGestureClose = false,
  backdropOpacity = 0.5,
  inline = false,
  warmMount = false,
  style,
  respectReduceMotion = true,
  skipAnimation = false,
  accessibilityViewIsModal = true,
}: ModalProps) {
  const reduceMotionPref = useReduceMotion(respectReduceMotion);
  const reduceMotion = skipAnimation || reduceMotionPref;
  const shouldRender = useModalRenderState(visible, reduceMotion, variant);
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
  const inlineAnimatedStyles = inline
    ? getInlineModalStyles(backdropOpacity)
    : animatedStyles;
  const resolvedAnimatedStyles = inline ? inlineAnimatedStyles : animatedStyles;

  const modalBody = (
    <>
      <ModalBackdrop
        backdropStyle={resolvedAnimatedStyles.backdropStyle}
        disableBackdropClose={disableBackdropClose || inline}
        onClose={onClose}
      />
      <ModalContent
        animatedStyles={resolvedAnimatedStyles}
        customStyle={style}
        panGestureBottomSheet={panGestureBottomSheet}
        panGestureFullScreen={panGestureFullScreen}
        variant={variant}
      >
        {children}
      </ModalContent>
    </>
  );

  if (!shouldRender) {
    return warmMount ? (
      <ModalWarmMountHost>{children}</ModalWarmMountHost>
    ) : null;
  }

  if (inline) {
    return (
      <ModalContainer inline variant={variant}>
        {modalBody}
      </ModalContainer>
    );
  }

  return (
    <RNModal
      accessibilityViewIsModal={accessibilityViewIsModal}
      statusBarTranslucent
      transparent
      animationType='none'
      visible={shouldRender}
      onRequestClose={onClose}
    >
      <ModalContainer variant={variant}>{modalBody}</ModalContainer>
    </RNModal>
  );
}

export default Modal;
