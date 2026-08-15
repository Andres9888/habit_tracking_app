/**
 * Native or inline shell around modal body. Transparent RNModal uses
 * overFullScreen so iOS restores Home touches after dismiss.
 */

import React from 'react';
import { Modal as RNModal, StyleSheet, View } from 'react-native';
import { styles } from './Modal.styles';
import type { ModalVariant } from './Modal.types';

interface ModalFrameProps {
  accessibilityViewIsModal: boolean;
  children: React.ReactNode;
  inline: boolean;
  onClose: () => void;
  variant: ModalVariant;
  visible: boolean;
}

export function ModalFrame({
  accessibilityViewIsModal,
  children,
  inline,
  onClose,
  variant,
  visible,
}: ModalFrameProps) {
  const containerStyle = [
    styles.container,
    variant === 'fullScreen' && styles.containerFullScreen,
    variant === 'centerAlert' && styles.containerCenterAlert,
  ];

  if (inline) {
    return (
      <View
        pointerEvents={visible ? 'box-none' : 'none'}
        style={[StyleSheet.absoluteFill, { elevation: 9999, zIndex: 9999 }]}
      >
        <View style={containerStyle}>{children}</View>
      </View>
    );
  }

  return (
    <RNModal
      accessibilityViewIsModal={accessibilityViewIsModal}
      statusBarTranslucent
      transparent
      animationType='none'
      presentationStyle='overFullScreen'
      visible
      onRequestClose={onClose}
    >
      <View pointerEvents={visible ? 'auto' : 'none'} style={containerStyle}>
        {children}
      </View>
    </RNModal>
  );
}
