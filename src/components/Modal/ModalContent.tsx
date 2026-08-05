/**
 * ModalContent Component
 * Routes to the appropriate variant content component
 */

import React from 'react';
import type { ViewStyle } from 'react-native';
import type { GestureType } from 'react-native-gesture-handler';
import type { AnimatedStyle } from 'react-native-reanimated';
import type { ModalVariant } from './Modal.types';
import { BottomSheetContent } from './BottomSheetContent';
import { FullScreenContent } from './FullScreenContent';
import { CenterAlertContent } from './CenterAlertContent';

interface AnimatedStyles {
  bottomSheetStyle: AnimatedStyle<ViewStyle>;
  fullScreenStyle: AnimatedStyle<ViewStyle>;
  centerAlertStyle: AnimatedStyle<ViewStyle>;
}

interface ModalContentProps {
  variant: ModalVariant;
  children: React.ReactNode;
  customStyle?: ViewStyle;
  animatedStyles: AnimatedStyles;
  panGestureBottomSheet: GestureType;
  panGestureFullScreen: GestureType;
}

export function ModalContent({
  variant,
  children,
  customStyle,
  animatedStyles,
  panGestureBottomSheet,
  panGestureFullScreen,
}: ModalContentProps) {
  switch (variant) {
    case 'bottomSheet': {
      return (
        <BottomSheetContent
          animatedStyle={animatedStyles.bottomSheetStyle}
          customStyle={customStyle}
          gesture={panGestureBottomSheet}
        >
          {children}
        </BottomSheetContent>
      );
    }

    case 'fullScreen': {
      return (
        <FullScreenContent
          animatedStyle={animatedStyles.fullScreenStyle}
          customStyle={customStyle}
          gesture={panGestureFullScreen}
        >
          {children}
        </FullScreenContent>
      );
    }

    case 'centerAlert': {
      return (
        <CenterAlertContent
          animatedStyle={animatedStyles.centerAlertStyle}
          customStyle={customStyle}
        >
          {children}
        </CenterAlertContent>
      );
    }

    default: {
      return null;
    }
  }
}
