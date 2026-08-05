/**
 * Modal header for FullsizeTemplatePreview
 * Uses shared ModalCloseButton for consistent close button styling.
 * Optionally renders a circular back button on the left when `onBack` is provided.
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { borderRadius } from '@/theme/spacing';
import { layoutStyles } from '../styles';
import { ModalBackButton } from './ModalBackButton';
import { ModalCloseButton } from '../../ui/ModalCloseButton';
import { useDetailPalette } from '../detailPalette';

interface ModalHeaderProps {
  topInset: number;
  closeButtonAnimatedOpacityStyle: object;
  onBack?: () => void;
  onClose: () => void;
  tintColor?: string;
  /** Reanimated style applied to the outer container — overrides tintColor when scrolled. */
  animatedBgStyle?: object;
}

export function ModalHeader({
  topInset,
  closeButtonAnimatedOpacityStyle,
  onBack,
  onClose,
  tintColor,
  animatedBgStyle,
}: ModalHeaderProps) {
  // Translucent cream so the chrome reads as glass over the warm hero gradient.
  const palette = useDetailPalette();

  return (
    <Animated.View
      style={[
        tintColor ? { backgroundColor: tintColor } : undefined,
        animatedBgStyle,
      ]}
    >
      <View testID='templates-preview-handle' style={s.handleRow}>
        <View style={[s.handle, { backgroundColor: palette.border }]} />
      </View>
      <Animated.View
        testID='templates-preview-close'
        style={[
          layoutStyles.header,
          s.headerRow,
          { paddingTop: topInset > 0 ? topInset : 12 },
          closeButtonAnimatedOpacityStyle,
        ]}
      >
        {onBack ? (
          <ModalBackButton
            backgroundColor={palette.closeBg}
            color={palette.textSecondary}
            onBack={onBack}
          />
        ) : (
          <View />
        )}
        <ModalCloseButton
          label='Close preview'
          variant='subtle'
          onClose={onClose}
        />
      </Animated.View>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  handle: {
    borderRadius: borderRadius.xs,
    height: 4,
    width: 40,
  },
  handleRow: { alignItems: 'center', paddingTop: 8 },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
