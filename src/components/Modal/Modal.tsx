/**
 * Modal Component - Main orchestrator
 * Variants: Bottom Sheet, Full Screen, Center Alert
 */

import React from 'react';
import type { ModalProps } from './Modal.types';
import { useReduceMotion } from './useReduceMotion';
import { useModalAnimations } from './useModalAnimations';
import { useModalStyles } from './useModalStyles';
import { useModalGestures } from './useModalGestures';
import { useModalRenderState } from './useModalRenderState';
import { ModalBackdrop } from './ModalBackdrop';
import { ModalContent } from './ModalContent';
import { ModalFrame } from './ModalFrame';
import { ModalWarmMountHost } from './ModalWarmMountHost';

export function Modal({
  visible,
  onClose,
  onHidden,
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
  const shouldRender = useModalRenderState({
    onHidden,
    reduceMotion,
    variant,
    visible,
  });
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
  const resolvedAnimatedStyles = inline
    ? {
        backdropStyle: { opacity: backdropOpacity },
        bottomSheetStyle: { transform: [{ translateY: 0 }] },
        centerAlertStyle: { opacity: 1, transform: [{ scale: 1 }] },
        fullScreenStyle: {
          opacity: 1,
          transform: [{ translateY: 0 }, { scale: 1 }],
        },
      }
    : animatedStyles;

  if (!shouldRender) {
    return warmMount ? (
      <ModalWarmMountHost>{children}</ModalWarmMountHost>
    ) : null;
  }

  return (
    <ModalFrame
      accessibilityViewIsModal={accessibilityViewIsModal}
      inline={inline}
      variant={variant}
      visible={visible}
      onClose={onClose}
    >
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
    </ModalFrame>
  );
}

export default Modal;
