/**
 * Modal Component
 * Based on UX Specification Section 4.2 & Section 8.2 (Modal Transitions)
 *
 * Variants: Bottom Sheet (create/edit), Full Screen (detail views), Center Alert (confirmations)
 * States: Entering (slide up with spring), Open (visible, backdrop dimmed), Exiting (slide down, fade)
 * Gestures: Pull down to dismiss (bottom sheet), swipe right from left edge (full screen)
 * Usage: Create/edit habit, paywall, celebrations
 */

import React, { useEffect } from 'react';
import {
  Modal as RNModal,
  View,
  StyleSheet,
  Pressable,
  type ViewStyle,
  Dimensions,
  Platform,
} from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../theme';
import * as Haptics from 'expo-haptics';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

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
}

export function Modal({
  visible,
  onClose,
  variant = 'bottomSheet',
  children,
  disableBackdropClose = false,
  disableGestureClose = false,
  backdropOpacity = 0.6,
  style,
}: ModalProps) {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();

  // Animation values
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const translateX = useSharedValue(0);
  const backdropOpacityValue = useSharedValue(0);
  const scale = useSharedValue(0.95);

  // Gesture threshold for dismissal
  const DISMISS_THRESHOLD = 100;

  // Enter animation when modal becomes visible
  useEffect(() => {
    if (visible) {
      // Backdrop fade in
      backdropOpacityValue.value = withTiming(backdropOpacity, {
        duration: 200,
      });

      switch (variant) {
        case 'bottomSheet': {
          // Bottom sheet: slide up from bottom
          translateY.value = withSpring(0, {
            damping: 15,
            stiffness: 150,
          });

          break;
        }
        case 'fullScreen': {
          // Full screen: slide in from right
          translateX.value = withSpring(0, {
            damping: 15,
            stiffness: 150,
          });

          break;
        }
        case 'centerAlert': {
          // Center alert: scale up and fade in
          scale.value = withSpring(1, {
            damping: 15,
            stiffness: 150,
          });

          break;
        }
        // No default
      }
    } else {
      // Exit animation
      backdropOpacityValue.value = withTiming(0, { duration: 250 });

      switch (variant) {
        case 'bottomSheet': {
          translateY.value = withSpring(SCREEN_HEIGHT, {
            damping: 15,
            stiffness: 150,
          });

          break;
        }
        case 'fullScreen': {
          translateX.value = withSpring(SCREEN_HEIGHT, {
            damping: 15,
            stiffness: 150,
          });

          break;
        }
        case 'centerAlert': {
          scale.value = withSpring(0.95, {
            damping: 15,
            stiffness: 150,
          });

          break;
        }
        // No default
      }
    }
  }, [visible, variant]);

  // Pan gesture for bottom sheet (pull down to dismiss)
  const panGestureBottomSheet = Gesture.Pan()
    .enabled(!disableGestureClose && variant === 'bottomSheet')
    .onUpdate((event) => {
      // Only allow downward drag
      if (event.translationY > 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      if (event.translationY > DISMISS_THRESHOLD || event.velocityY > 500) {
        // Dismiss if dragged past threshold or fast velocity
        translateY.value = withSpring(SCREEN_HEIGHT, {
          damping: 15,
          stiffness: 150,
        });
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
        runOnJS(onClose)();
      } else {
        // Spring back to open position
        translateY.value = withSpring(0, {
          damping: 15,
          stiffness: 150,
        });
      }
    });

  // Pan gesture for full screen (swipe right from left edge to dismiss)
  const panGestureFullScreen = Gesture.Pan()
    .enabled(!disableGestureClose && variant === 'fullScreen')
    .activeOffsetX([10, Infinity]) // Only trigger on right swipe
    .onUpdate((event) => {
      // Only allow rightward drag
      if (event.translationX > 0) {
        translateX.value = event.translationX;
      }
    })
    .onEnd((event) => {
      if (event.translationX > DISMISS_THRESHOLD || event.velocityX > 500) {
        // Dismiss if swiped past threshold or fast velocity
        translateX.value = withSpring(SCREEN_HEIGHT, {
          damping: 15,
          stiffness: 150,
        });
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
        runOnJS(onClose)();
      } else {
        // Spring back to open position
        translateX.value = withSpring(0, {
          damping: 15,
          stiffness: 150,
        });
      }
    });

  // Animated styles
  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacityValue.value,
  }));

  const bottomSheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const fullScreenStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const centerAlertStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacityValue.value / backdropOpacity,
    transform: [{ scale: scale.value }],
  }));

  // Handle backdrop press
  const handleBackdropPress = () => {
    if (!disableBackdropClose) {
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
                paddingBottom: insets.bottom,
                paddingTop: insets.top,
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
      animationType='none' // We handle animations ourselves
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Backdrop */}
        <Pressable
          accessible={false}
          style={StyleSheet.absoluteFill}
          onPress={handleBackdropPress}
        >
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: theme.colors.backdrop },
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
    position: 'absolute',
    top: '30%',
    width: '85%',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  fullScreen: {
    ...StyleSheet.absoluteFillObject,
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
