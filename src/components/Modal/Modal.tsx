/**
 * Modal Component - Main orchestrator
 * Variants: Bottom Sheet, Full Screen, Center Alert
 */

import React, { useEffect, useState } from 'react';
import { Modal as RNModal, StyleSheet, View } from 'react-native';
import type { ModalProps } from './Modal.types';
import { styles } from './Modal.styles';
import { EXIT_DURATIONS } from './Modal.constants';
import { useReduceMotion } from './useReduceMotion';
import { useModalAnimations } from './useModalAnimations';
import { useModalStyles } from './useModalStyles';
import { useModalGestures } from './useModalGestures';
import { ModalBackdrop } from './ModalBackdrop';
import { ModalContent } from './ModalContent';
import { ModalWarmMountHost } from './ModalWarmMountHost';

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
  const [shouldRender, setShouldRender] = useState(visible);

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      return;
    }
    if (reduceMotion) {
      setShouldRender(false);
      return;
    }
    const timeout = setTimeout(
      () => setShouldRender(false),
      EXIT_DURATIONS[variant]
    );
    return () => clearTimeout(timeout);
  }, [visible, reduceMotion, variant]);
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
    ? {
        backdropStyle: { opacity: backdropOpacity },
        bottomSheetStyle: { transform: [{ translateY: 0 }] },
        centerAlertStyle: {
          opacity: 1,
          transform: [{ scale: 1 }],
        },
        fullScreenStyle: {
          opacity: 1,
          transform: [{ translateY: 0 }, { scale: 1 }],
        },
      }
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
      <View
        pointerEvents='box-none'
        style={[StyleSheet.absoluteFill, { elevation: 9999, zIndex: 9999 }]}
      >
        <View
          style={[
            styles.container,
            variant === 'fullScreen' && styles.containerFullScreen,
            variant === 'centerAlert' && styles.containerCenterAlert,
          ]}
        >
          {modalBody}
        </View>
      </View>
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
      <View
        style={[
          styles.container,
          variant === 'fullScreen' && styles.containerFullScreen,
          variant === 'centerAlert' && styles.containerCenterAlert,
        ]}
      >
        {modalBody}
      </View>
    </RNModal>
  );
}

export default Modal;
