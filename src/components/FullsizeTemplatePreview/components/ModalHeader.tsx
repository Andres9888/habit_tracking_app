/**
 * Top bar for FullsizeTemplatePreview — a screen-style header:
 * back chevron (dismisses the preview) · centered "Habit Library" eyebrow ·
 * bookmark + share actions. Background tint tracks scroll via animatedBgStyle.
 */

import React from 'react';
import { ChevronLeft } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { colors } from '@/theme/colors';
import { iconSizes } from '@/theme/iconSizes';
import { fontFamilies } from '@/theme/typography';
import { triggerHaptic } from '@/utils/haptics';
import { AnimatedPressable } from '../../ui/AnimatedPressable';
import { useThemeColors } from '../../../theme/ThemeContext';
import { HeaderActionCluster } from './header/HeaderActionCluster';
import type { Template } from '../../../types/template';

interface ModalHeaderProps {
  topInset: number;
  closeButtonAnimatedOpacityStyle: object;
  template: Template;
  onClose: () => void;
  onShare: () => void;
  tintColor?: string;
  /** Reanimated style applied to the outer container — overrides tintColor when scrolled. */
  animatedBgStyle?: object;
}

export function ModalHeader({
  topInset,
  closeButtonAnimatedOpacityStyle,
  template,
  onClose,
  onShare,
  tintColor,
  animatedBgStyle,
}: ModalHeaderProps) {
  const { colors: themeColors } = useThemeColors();
  const handleBack = () => {
    void triggerHaptic('tap');
    onClose();
  };

  return (
    <Animated.View
      style={[tintColor ? { backgroundColor: tintColor } : undefined, animatedBgStyle]}
    >
      <View style={{ height: topInset > 0 ? topInset : 12 }} />
      <Animated.View style={[s.row, closeButtonAnimatedOpacityStyle]}>
        <View pointerEvents='none' style={s.eyebrowWrap}>
          <Text style={s.eyebrow}>Habit Library</Text>
        </View>
        <AnimatedPressable
          accessibilityLabel='Back to library'
          accessibilityRole='button'
          testID='templates-preview-back'
          style={s.iconBtn}
          onPress={handleBack}
        >
          <ChevronLeft
            color={themeColors.text.secondary}
            size={iconSizes.large}
            strokeWidth={2.4}
          />
        </AnimatedPressable>
        <HeaderActionCluster template={template} onShare={onShare} />
      </Animated.View>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  eyebrow: {
    color: colors.gray[400],
    fontFamily: fontFamilies.primary.text,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  eyebrowWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtn: {
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 44,
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    zIndex: 10,
  },
});
