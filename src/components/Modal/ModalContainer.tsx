import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { styles } from './Modal.styles';
import type { ModalVariant } from './Modal.types';

interface ModalContainerProps {
  children: ReactNode;
  inline?: boolean;
  variant: ModalVariant;
}

export function ModalContainer({
  children,
  inline = false,
  variant,
}: ModalContainerProps) {
  const content = (
    <View
      style={[
        styles.container,
        variant === 'fullScreen' && styles.containerFullScreen,
        variant === 'centerAlert' && styles.containerCenterAlert,
      ]}
    >
      {children}
    </View>
  );
  if (!inline) return content;
  return (
    <View
      pointerEvents='box-none'
      style={[StyleSheet.absoluteFill, { elevation: 9999, zIndex: 9999 }]}
    >
      {content}
    </View>
  );
}
