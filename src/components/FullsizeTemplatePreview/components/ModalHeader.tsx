/**
 * Modal header for FullsizeTemplatePreview
 * Uses shared ModalCloseButton for consistent close button styling
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { layoutStyles } from '../styles';
import { ModalCloseButton } from '../../ui/ModalCloseButton';

interface ModalHeaderProps {
  topInset: number;
  closeButtonAnimatedOpacityStyle: object;
  onClose: () => void;
}

export function ModalHeader({
  topInset,
  closeButtonAnimatedOpacityStyle,
  onClose,
}: ModalHeaderProps) {
  return (
    <>
      <View testID="templates-preview-handle" style={s.handleRow}>
        <View style={s.handle} />
      </View>
      <Animated.View
        testID="templates-preview-close"
        style={[
          layoutStyles.header,
          { paddingTop: topInset > 0 ? topInset : 12 },
          closeButtonAnimatedOpacityStyle,
        ]}
      >
        <ModalCloseButton label='Close preview' onClose={onClose} />
      </Animated.View>
    </>
  );
}

const s = StyleSheet.create({
  handle: { backgroundColor: '#D1D5DB', borderRadius: 2, height: 4, width: 40 },
  handleRow: { alignItems: 'center', paddingTop: 8 },
});
