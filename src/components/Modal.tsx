/**
 * Modal Component
 * Based on UX Specification Section 4.2 & Section 8.2 (Modal Transitions)
 *
 * Variants: Bottom Sheet (create/edit), Full Screen (detail views), Center Alert (confirmations)
 * States: Entering (slide up with spring), Open (visible, backdrop dimmed), Exiting (slide down, fade)
 * Gestures: Pull down to dismiss (bottom sheet), swipe down from top edge (full screen)
 * Usage: Create/edit habit, paywall, celebrations
 *
 * Updated: Apple-like organic animations for fullScreen modal using scale + opacity + translateY
 * - iOS sheet presentation style with combined scale, opacity, and vertical translation
 * - Staggered content reveal capability
 * - Respects system reduce motion preference
 */

import React, { useEffect, useState } from 'react';
import {
  Modal as RNModal,
  View,
  StyleSheet,
  Pressable,
  type ViewStyle,
  Dimensions,
  Platform,
  AccessibilityInfo,
} from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withDelay,
  runOnJS,
  Easing,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../theme';
import * as Haptics from 'expo-haptics';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

// Apple-like spring configuration - iOS sheet presentation style
// High stiffness + moderate damping = snappy but organic feel
const APPLE_SPRING_CONFIG = {
  damping: 24,
  stiffness: 380,
  mass: 1,
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01,
};

// Organic spring config for fullScreen modals - slower, more natural feel
// Lower stiffness + higher damping + heavier mass = ~400-500ms duration, organic momentum
const FULLSCREEN_ORGANIC_SPRING = {
  damping: 32, // More controlled, less bounce
  stiffness: 180, // Much slower than default
  mass: 1.3, // Heavier = more momentum
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01,
};

// Exit spring - slightly faster for dismissal
const EXIT_SPRING_CONFIG = {
  damping: 26,
  stiffness: 420,
  mass: 0.9,
};

// Snappy spring for interactive gestures
const GESTURE_SPRING_CONFIG = {
  damping: 20,
  stiffness: 450,
  mass: 0.8,
};

// Organic spring for bottom sheet - subtle life, not mechanical
const BOTTOM_SHEET_SPRING_CONFIG = {
  damping: 26,
  stiffness: 300,
  // No overshootClamping - tiny overshoot gives organic feel
};

export type ModalVariant = 'bottomSheet' | 'fullScreen' | 'centerAlert';

export interface ModalProps {
  /** Modal visibility */
  visible: boolean;

  /** On close callback */
  onClose: () => void;

  /** Modal variant */
  variant?: ModalVariant;

  /** Modal content */
  children: React.ReactNode;

  /** Disable backdrop tap to close */
  disableBackdropClose?: boolean;

  /** Disable gesture to close */
  disableGestureClose?: boolean;

  /** Custom backdrop opacity (0-1) */
  backdropOpacity?: number;

  /** Custom style */
  style?: ViewStyle;

  /** Respect system reduce motion preference (default: true) */
  respectReduceMotion?: boolean;
}

export function Modal({
  visible,
  onClose,
  variant = 'bottomSheet',
  children,
  disableBackdropClose = false,
  disableGestureClose = false,
  backdropOpacity = 0.5,
  style,
  respectReduceMotion = true,
}: ModalProps) {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const [reduceMotion, setReduceMotion] = useState(false);

  // Check for reduce motion preference
  useEffect(() => {
    if (respectReduceMotion) {
      AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
      const subscription = AccessibilityInfo.addEventListener(
        'reduceMotionChanged',
        setReduceMotion
      );
      return () => subscription?.remove();
    }
  }, [respectReduceMotion]);

  // Animation values for bottom sheet
  const translateY = useSharedValue(SCREEN_HEIGHT);

  // Animation values for fullScreen (Apple-like)
  const fullScreenProgress = useSharedValue(0); // 0 = closed, 1 = open
  const fullScreenGestureY = useSharedValue(0);

  // Animation values for center alert
  const scale = useSharedValue(0.92);
  const alertOpacity = useSharedValue(0);

  // Backdrop opacity
  const backdropOpacityValue = useSharedValue(0);

  // Gesture threshold for dismissal
  const DISMISS_THRESHOLD = 120;
  const VELOCITY_THRESHOLD = 800;

  // Enter/Exit animations
  useEffect(() => {
    const useReducedAnimation = reduceMotion && respectReduceMotion;

    if (visible) {
      switch (variant) {
        case 'bottomSheet': {
          // Backdrop fade in - 200ms for bottom sheet
          backdropOpacityValue.value = useReducedAnimation
            ? backdropOpacity
            : withTiming(backdropOpacity, { duration: 200, easing: Easing.out(Easing.cubic) });
          translateY.value = useReducedAnimation
            ? 0
            : withSpring(0, BOTTOM_SHEET_SPRING_CONFIG, (finished) => {
                // Haptic feedback when animation completes
                if (finished) {
                  runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
                }
              });
          break;
        }
        case 'fullScreen': {
          // Backdrop fade in - 400ms for fullScreen to match slower organic spring
          backdropOpacityValue.value = useReducedAnimation
            ? backdropOpacity
            : withTiming(backdropOpacity, { duration: 400, easing: Easing.out(Easing.cubic) });
          // Apple-like entrance: scale up + fade in + slide up
          // Uses FULLSCREEN_ORGANIC_SPRING for slower, more natural feel (~400-500ms)
          fullScreenProgress.value = useReducedAnimation
            ? 1
            : withSpring(1, FULLSCREEN_ORGANIC_SPRING, (finished) => {
                // Haptic feedback when animation completes
                if (finished) {
                  runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
                }
              });
          fullScreenGestureY.value = 0;
          break;
        }
        case 'centerAlert': {
          // Backdrop fade in - 200ms for center alert
          backdropOpacityValue.value = useReducedAnimation
            ? backdropOpacity
            : withTiming(backdropOpacity, { duration: 200, easing: Easing.out(Easing.cubic) });
          alertOpacity.value = useReducedAnimation
            ? 1
            : withTiming(1, { duration: 200, easing: Easing.out(Easing.cubic) });
          scale.value = useReducedAnimation
            ? 1
            : withSpring(1, { damping: 20, stiffness: 300 });
          break;
        }
      }
    } else {
      // Exit animations - backdrop fade per variant
      switch (variant) {
        case 'bottomSheet': {
          backdropOpacityValue.value = useReducedAnimation
            ? 0
            : withTiming(0, { duration: 200, easing: Easing.in(Easing.cubic) });
          translateY.value = useReducedAnimation
            ? SCREEN_HEIGHT
            : withSpring(SCREEN_HEIGHT, BOTTOM_SHEET_SPRING_CONFIG);
          break;
        }
        case 'fullScreen': {
          // Slower backdrop fade for fullScreen exit (300ms - slightly faster than entrance)
          backdropOpacityValue.value = useReducedAnimation
            ? 0
            : withTiming(0, { duration: 300, easing: Easing.in(Easing.cubic) });
          // Apple-like exit: scale down + fade out + slide down
          fullScreenProgress.value = useReducedAnimation
            ? 0
            : withSpring(0, EXIT_SPRING_CONFIG);
          break;
        }
        case 'centerAlert': {
          backdropOpacityValue.value = useReducedAnimation
            ? 0
            : withTiming(0, { duration: 200, easing: Easing.in(Easing.cubic) });
          alertOpacity.value = useReducedAnimation
            ? 0
            : withTiming(0, { duration: 150 });
          scale.value = useReducedAnimation
            ? 0.92
            : withTiming(0.92, { duration: 150 });
          break;
        }
      }
    }
  }, [visible, variant, reduceMotion, respectReduceMotion]);

  // Pan gesture for bottom sheet (pull down to dismiss)
  const panGestureBottomSheet = Gesture.Pan()
    .enabled(!disableGestureClose && variant === 'bottomSheet')
    .onUpdate((event) => {
      if (event.translationY > 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      if (event.translationY > DISMISS_THRESHOLD || event.velocityY > VELOCITY_THRESHOLD) {
        translateY.value = withSpring(SCREEN_HEIGHT, BOTTOM_SHEET_SPRING_CONFIG);
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
        runOnJS(onClose)();
      } else {
        translateY.value = withSpring(0, BOTTOM_SHEET_SPRING_CONFIG);
      }
    });

  // Pan gesture for fullScreen (swipe down to dismiss - Apple sheet style)
  const panGestureFullScreen = Gesture.Pan()
    .enabled(!disableGestureClose && variant === 'fullScreen')
    .onUpdate((event) => {
      // Allow downward drag with rubber band effect
      if (event.translationY > 0) {
        // Rubber band effect: resistance increases as you drag
        const resistance = 0.4;
        fullScreenGestureY.value = event.translationY * resistance;
      }
    })
    .onEnd((event) => {
      if (event.translationY > DISMISS_THRESHOLD || event.velocityY > VELOCITY_THRESHOLD) {
        // Dismiss
        fullScreenProgress.value = withSpring(0, EXIT_SPRING_CONFIG);
        fullScreenGestureY.value = withSpring(0, GESTURE_SPRING_CONFIG);
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
        runOnJS(onClose)();
      } else {
        // Spring back
        fullScreenGestureY.value = withSpring(0, GESTURE_SPRING_CONFIG);
      }
    });

  // Animated styles
  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacityValue.value,
  }));

  const bottomSheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  // Apple-like fullScreen animated style
  const fullScreenStyle = useAnimatedStyle(() => {
    // Scale: starts at 0.95, ends at 1.0
    const scaleValue = interpolate(
      fullScreenProgress.value,
      [0, 1],
      [0.94, 1],
      Extrapolation.CLAMP
    );

    // Opacity: starts at 0, ends at 1
    const opacityValue = interpolate(
      fullScreenProgress.value,
      [0, 0.5, 1],
      [0, 0.8, 1],
      Extrapolation.CLAMP
    );

    // TranslateY: starts at 80, ends at 0 (slides up) - more dramatic slide for organic feel
    const translateYValue = interpolate(
      fullScreenProgress.value,
      [0, 1],
      [80, 0],
      Extrapolation.CLAMP
    );

    // Add gesture translation
    const gestureTranslateY = fullScreenGestureY.value;

    // Scale down slightly when dragging (interactive feedback)
    const gestureScale = interpolate(
      gestureTranslateY,
      [0, 200],
      [1, 0.96],
      Extrapolation.CLAMP
    );

    return {
      opacity: opacityValue,
      transform: [
        { translateY: translateYValue + gestureTranslateY },
        { scale: scaleValue * gestureScale },
      ],
    };
  });

  const centerAlertStyle = useAnimatedStyle(() => ({
    opacity: alertOpacity.value,
    transform: [{ scale: scale.value }],
  }));

  // Handle backdrop press
  const handleBackdropPress = () => {
    if (!disableBackdropClose) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onClose();
    }
  };

  // Render content based on variant
  const renderContent = () => {
    if (variant === 'bottomSheet') {
      return (
        <GestureDetector gesture={panGestureBottomSheet}>
          <Animated.View
            style={[
              styles.bottomSheet,
              {
                backgroundColor: theme.custom.colors.light.background,
                borderTopLeftRadius: theme.custom.borderRadius.large,
                borderTopRightRadius: theme.custom.borderRadius.large,
                paddingBottom: insets.bottom,
                ...theme.custom.shadows.modal,
              },
              bottomSheetStyle,
              style,
            ]}
          >
            {/* Pull indicator */}
            <View style={styles.pullIndicatorContainer}>
              <View
                style={[
                  styles.pullIndicator,
                  { backgroundColor: theme.custom.colors.gray[300] },
                ]}
              />
            </View>
            {children}
          </Animated.View>
        </GestureDetector>
      );
    }

    if (variant === 'fullScreen') {
      return (
        <GestureDetector gesture={panGestureFullScreen}>
          <Animated.View
            style={[
              styles.fullScreen,
              {
                backgroundColor: theme.custom.colors.light.background,
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
              },
              fullScreenStyle,
              style,
            ]}
          >
            {children}
          </Animated.View>
        </GestureDetector>
      );
    }

    if (variant === 'centerAlert') {
      return (
        <Animated.View
          style={[
            styles.centerAlert,
            {
              backgroundColor: theme.custom.colors.light.background,
              borderRadius: theme.custom.borderRadius.large,
              ...theme.custom.shadows.modal,
            },
            centerAlertStyle,
            style,
          ]}
        >
          {children}
        </Animated.View>
      );
    }

    return null;
  };

  return (
    <RNModal
      statusBarTranslucent
      transparent
      animationType="none"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={[
        styles.container,
        variant === 'fullScreen' && styles.containerFullScreen,
        variant === 'centerAlert' && styles.containerCenterAlert,
      ]}>
        {/* Backdrop */}
        <Pressable
          accessible={false}
          style={StyleSheet.absoluteFill}
          onPress={handleBackdropPress}
        >
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: '#000000' },
              backdropStyle,
            ]}
          />
        </Pressable>

        {/* Modal Content */}
        {renderContent()}
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  bottomSheet: {
    maxHeight: SCREEN_HEIGHT * 0.9,
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  centerAlert: {
    alignSelf: 'center',
    maxWidth: 400,
    padding: 24,
    width: '85%',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  containerFullScreen: {
    justifyContent: 'flex-end',
  },
  containerCenterAlert: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreen: {
    flex: 1,
    width: '100%',
    overflow: 'hidden',
  },
  pullIndicator: {
    borderRadius: 2,
    height: 4,
    width: 40,
  },
  pullIndicatorContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
});

export default Modal;
