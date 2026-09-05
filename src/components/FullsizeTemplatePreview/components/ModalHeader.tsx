/**
 * Modal header for FullsizeTemplatePreview.
 *
 * Two exits, conventionally placed and semantically distinct: back at
 * top-left returns to the Habit Library, X at top-right leaves for the home
 * screen. The X is `subtle` precisely so the pair doesn't read as two equal
 * ways out — back is the expected move, the X is the escape hatch.
 *
 * The left slot keeps an empty `<View />` when no `onBack` is supplied so the
 * row's space-between keeps the X pinned right.
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
  /** Back to the Habit Library. Omit to hide the back control entirely. */
  onBack?: () => void;
  /** Exit the whole flow to the home screen. */
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
          haptic={false}
          hint='Leaves the habit library and returns to your habits'
          hitSlop={8}
          label='Close and go to my habits'
          testID='templates-preview-exit-home'
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
