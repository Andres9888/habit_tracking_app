/**
 * Modal header for FullsizeTemplatePreview
 * Uses shared ModalCloseButton for consistent close button styling.
 * Optionally renders a circular back button on the left when `onBack` is provided.
 */

import React from 'react';
import { ChevronLeft } from 'lucide-react-native';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import { iconSizes } from '@/theme/iconSizes';
import { AnimatedPressable } from '../../ui/AnimatedPressable';
import { layoutStyles } from '../styles';
import { ModalCloseButton } from '../../ui/ModalCloseButton';
import { useThemeColors } from '../../../theme/ThemeContext';
import { modalHeaderStyles as s } from './ModalHeader.styles';

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
  const { colors: themeColors, isDark } = useThemeColors();
  const subtleBg = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';

  return (
    <Animated.View
      style={[
        tintColor ? { backgroundColor: tintColor } : undefined,
        animatedBgStyle,
      ]}
    >
      <View testID='templates-preview-handle' style={s.handleRow}>
        <View style={s.handle} />
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
          <AnimatedPressable
            accessibilityLabel='Back'
            accessibilityRole='button'
            testID='templates-preview-back'
            style={[s.backButton, { backgroundColor: subtleBg }]}
            onPress={onBack}
          >
            <ChevronLeft
              color={themeColors.text.secondary}
              size={iconSizes.large}
              strokeWidth={2.5}
            />
          </AnimatedPressable>
        ) : (
          <View />
        )}
        <ModalCloseButton
          haptic={false}
          label='Close preview'
          variant='subtle'
          onClose={onClose}
        />
      </Animated.View>
    </Animated.View>
  );
}
