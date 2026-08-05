import type { ReactNode } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

interface ModalWarmMountHostProps {
  children: ReactNode;
}

export function ModalWarmMountHost({ children }: ModalWarmMountHostProps) {
  const { height, width } = useWindowDimensions();

  return (
    <View
      aria-hidden
      accessibilityElementsHidden
      importantForAccessibility='no-hide-descendants'
      pointerEvents='none'
      style={[styles.host, { height, width }]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    left: 0,
    opacity: 0,
    position: 'absolute',
    top: 0,
    zIndex: -1,
  },
});
