/**
 * Modal header for FullsizeTemplatePreview
 * Uses shared ModalCloseButton for consistent close button styling
 */

import React from 'react';
import Animated from 'react-native-reanimated';
import { useThemeColors } from '../../../theme/ThemeContext';
import { createLayoutStyles } from '../styles';
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
  const { colors } = useThemeColors();
  const layoutStyles = React.useMemo(
    () => createLayoutStyles(colors),
    [colors],
  );

  return (
    <Animated.View
      style={[
        layoutStyles.header,
        { paddingTop: topInset > 0 ? topInset : 12 },
        closeButtonAnimatedOpacityStyle,
      ]}
    >
      <ModalCloseButton label='Close preview' onClose={onClose} />
    </Animated.View>
  );
}
