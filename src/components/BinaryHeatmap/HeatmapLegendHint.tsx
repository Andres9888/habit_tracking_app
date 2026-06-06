/**
 * Anchored popover explaining year-overview dot colors — emerges from the ⓘ icon.
 */

import React, { memo } from 'react';
import { View, Pressable, Modal, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { useAppTheme } from '@/theme';
import { useThemeColors } from '@/theme/ThemeContext';
import { hexToRgba } from './MonthlyCalendarGrid/colors';
import { HeatmapLegendHintBody } from './HeatmapLegendHintBody';
import type { HeatmapLegendHintProps } from './HeatmapLegendHint.types';
import { legendHintStyles } from './HeatmapLegendHint.styles';
import { getLegendHintLayout } from './HeatmapLegendHint.utils';
import { useLegendHintPopoverAnimation } from './useLegendHintPopoverAnimation';

const AnimatedView = Animated.createAnimatedComponent(View);

export const HeatmapLegendHint = memo(function HeatmapLegendHint({
  visible,
  habitColor,
  anchor,
  onClose,
}: HeatmapLegendHintProps) {
  const theme = useAppTheme();
  const { colors, isDark } = useThemeColors();
  const animatedStyle = useLegendHintPopoverAnimation(visible);
  const missedTint = hexToRgba(habitColor, isDark ? 0.25 : 0.15);

  if (!visible || !anchor) return null;

  const layout = getLegendHintLayout(anchor);

  return (
    <Modal
      accessibilityViewIsModal
      transparent
      animationType='none'
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={legendHintStyles.backdrop}>
        <Pressable
          accessibilityHint='Tap anywhere to close'
          accessibilityLabel='Close color guide'
          accessibilityRole='button'
          style={StyleSheet.absoluteFill}
          onPress={onClose}
        />
        <AnimatedView
          style={[
            legendHintStyles.card,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderWidth: 1,
              left: layout.left,
              top: layout.top,
              ...theme.custom.shadows.alert,
            },
            animatedStyle,
          ]}
        >
          <View
            style={[
              legendHintStyles.arrow,
              {
                borderBottomColor: colors.surface,
                left: layout.arrowLeft,
              },
            ]}
          />
          <HeatmapLegendHintBody
            habitColor={habitColor}
            missedTint={missedTint}
            onClose={onClose}
          />
        </AnimatedView>
      </View>
    </Modal>
  );
});
