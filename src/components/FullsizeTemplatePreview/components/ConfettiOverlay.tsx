/**
 * Confetti overlay for FullsizeTemplatePreview
 * Displays celebration animation on successful import
 */

import React, { forwardRef } from 'react';
import { View } from 'react-native';

import ConfettiCannon from 'react-native-confetti-cannon';

import {
  CONFETTI_COLORS,
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
} from '../FullsizeTemplatePreview.constants';
import { layoutStyles } from '../styles';

interface ConfettiOverlayProps {
  visible: boolean;
}

export const ConfettiOverlay = forwardRef<ConfettiCannon, ConfettiOverlayProps>(
  function ConfettiOverlay({ visible }, ref) {
    if (!visible) {
      return null;
    }

    return (
      <View pointerEvents='none' style={layoutStyles.confettiContainer}>
        <ConfettiCannon
          ref={ref}
          fadeOut
          autoStart={false}
          colors={CONFETTI_COLORS as unknown as string[]}
          count={60}
          explosionSpeed={250}
          fallSpeed={2500}
          origin={{ x: SCREEN_WIDTH / 2, y: SCREEN_HEIGHT * 0.4 }}
        />
      </View>
    );
  }
);
