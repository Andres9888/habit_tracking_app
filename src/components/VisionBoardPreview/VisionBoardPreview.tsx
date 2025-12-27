/**
 * VisionBoardPreview Component
 *
 * Full-screen preview for vision board cards with gestures:
 * - Swipe down to dismiss
 * - Swipe left/right to navigate between cards
 * - Edit button to open editor
 */

import React, { useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal as RNModal,
  Dimensions,
  ScrollView,
  AccessibilityInfo,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { X, Edit3, ChevronLeft, ChevronRight, Eye } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import type { Doc } from '../../../convex/_generated/dataModel';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const DISMISS_THRESHOLD = 150;
const SWIPE_VELOCITY_THRESHOLD = 500;
const HORIZONTAL_SWIPE_THRESHOLD = 80;

type VisionBoardItem = Doc<'visionBoardItems'>;

interface VisionBoardPreviewProps {
  items: VisionBoardItem[];
  initialIndex: number;
  visible: boolean;
  onClose: () => void;
  onEdit: (item: VisionBoardItem) => void;
}

export function VisionBoardPreview({
  items,
  initialIndex,
  visible,
  onClose,
  onEdit,
}: VisionBoardPreviewProps) {
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex);
  const [reduceMotion, setReduceMotion] = React.useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Check reduce motion preference
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReduceMotion
    );
    return () => subscription.remove();
  }, []);

  // Reset to initial index when modal opens
  useEffect(() => {
    if (visible) {
      setCurrentIndex(initialIndex);
    }
  }, [visible, initialIndex]);

  // Animation values
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const currentItem = items[currentIndex];
  const hasNext = currentIndex < items.length - 1;
  const hasPrev = currentIndex > 0;

  const handleClose = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  }, [onClose]);

  const handleEdit = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentItem) {
      onEdit(currentItem);
    }
  }, [currentItem, onEdit]);

  const goToNext = useCallback(() => {
    if (hasNext) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setCurrentIndex((prev) => prev + 1);
    }
  }, [hasNext]);

  const goToPrev = useCallback(() => {
    if (hasPrev) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setCurrentIndex((prev) => prev - 1);
    }
  }, [hasPrev]);

  // Pan gesture for swipe to dismiss and navigate
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      // Vertical swipe (dismiss)
      if (Math.abs(event.translationY) > Math.abs(event.translationX)) {
        translateY.value = event.translationY;
        const progress = Math.abs(event.translationY) / DISMISS_THRESHOLD;
        scale.value = interpolate(progress, [0, 1], [1, 0.9], Extrapolation.CLAMP);
        opacity.value = interpolate(progress, [0, 1], [1, 0.7], Extrapolation.CLAMP);
      } else {
        // Horizontal swipe (navigate)
        translateX.value = event.translationX;
      }
    })
    .onEnd((event) => {
      // Use Math.round on velocity to avoid precision loss error in Reanimated
      const velocityY = Math.round(event.velocityY);
      const velocityX = Math.round(event.velocityX);

      // Check for vertical dismiss
      if (
        Math.abs(event.translationY) > DISMISS_THRESHOLD ||
        Math.abs(velocityY) > SWIPE_VELOCITY_THRESHOLD
      ) {
        translateY.value = reduceMotion
          ? SCREEN_HEIGHT
          : withTiming(SCREEN_HEIGHT, { duration: 200 });
        opacity.value = reduceMotion ? 0 : withTiming(0, { duration: 200 });
        runOnJS(handleClose)();
        return;
      }

      // Check for horizontal navigation
      if (
        event.translationX < -HORIZONTAL_SWIPE_THRESHOLD ||
        velocityX < -SWIPE_VELOCITY_THRESHOLD
      ) {
        // Swipe left - go next
        if (hasNext) {
          runOnJS(goToNext)();
        }
      } else if (
        event.translationX > HORIZONTAL_SWIPE_THRESHOLD ||
        velocityX > SWIPE_VELOCITY_THRESHOLD
      ) {
        // Swipe right - go prev
        if (hasPrev) {
          runOnJS(goToPrev)();
        }
      }

      // Reset animations
      translateY.value = reduceMotion ? 0 : withSpring(0, { damping: 20, stiffness: 200 });
      translateX.value = reduceMotion ? 0 : withSpring(0, { damping: 20, stiffness: 200 });
      scale.value = reduceMotion ? 1 : withSpring(1, { damping: 20, stiffness: 200 });
      opacity.value = reduceMotion ? 1 : withSpring(1, { damping: 20, stiffness: 200 });
    });

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  if (!currentItem) {
    return null;
  }

  return (
    <RNModal
      animationType={reduceMotion ? 'none' : 'fade'}
      statusBarTranslucent
      transparent
      visible={visible}
      onRequestClose={handleClose}
    >
      <View className="flex-1 bg-black/90">
        <GestureDetector gesture={panGesture}>
          <Animated.View className="flex-1" style={animatedContainerStyle}>
            {/* Header */}
            <View
              className="flex-row items-center justify-between px-5"
              style={{ paddingTop: insets.top + 16 }}
            >
              {/* Close button */}
              <Pressable
                accessibilityLabel="Close preview"
                accessibilityRole="button"
                className="h-10 w-10 items-center justify-center rounded-full bg-white/10 active:bg-white/20"
                onPress={handleClose}
              >
                <X className="text-white" size={22} />
              </Pressable>

              {/* Counter */}
              <View className="flex-row items-center gap-2">
                <Eye className="text-white/60" size={16} />
                <Text className="text-sm font-medium text-white/80">
                  {currentIndex + 1} of {items.length}
                </Text>
              </View>

              {/* Edit button */}
              <Pressable
                accessibilityLabel="Edit this card"
                accessibilityRole="button"
                className="h-10 w-10 items-center justify-center rounded-full bg-white/10 active:bg-white/20"
                onPress={handleEdit}
              >
                <Edit3 className="text-white" size={20} />
              </Pressable>
            </View>

            {/* Content */}
            <View className="flex-1 justify-center px-6">
              <View className="rounded-3xl bg-white/10 p-6 backdrop-blur-lg">
                {/* Title */}
                <Text className="mb-4 text-center text-2xl font-bold text-white">
                  {currentItem.title}
                </Text>

                {/* Body */}
                {currentItem.body && (
                  <ScrollView
                    className="max-h-80"
                    showsVerticalScrollIndicator={false}
                  >
                    <Text className="text-center text-lg leading-7 text-white/90">
                      {currentItem.body}
                    </Text>
                  </ScrollView>
                )}

                {/* Created date */}
                <Text className="mt-6 text-center text-xs text-white/50">
                  Created{' '}
                  {new Date(currentItem.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </Text>
              </View>

              {/* Swipe hint */}
              <Text className="mt-6 text-center text-sm text-white/40">
                Swipe down to close • Swipe left/right to navigate
              </Text>
            </View>

            {/* Navigation arrows */}
            <View
              className="flex-row items-center justify-between px-5 pb-4"
              style={{ paddingBottom: insets.bottom + 16 }}
            >
              {/* Previous */}
              <Pressable
                accessibilityLabel="Previous card"
                accessibilityRole="button"
                className={`h-12 w-12 items-center justify-center rounded-full ${
                  hasPrev ? 'bg-white/10 active:bg-white/20' : 'opacity-30'
                }`}
                disabled={!hasPrev}
                onPress={goToPrev}
              >
                <ChevronLeft className="text-white" size={24} />
              </Pressable>

              {/* Dots indicator */}
              <View className="flex-row items-center gap-2">
                {items.map((_, index) => (
                  <View
                    key={index}
                    className={`h-2 rounded-full ${
                      index === currentIndex ? 'w-6 bg-white' : 'w-2 bg-white/30'
                    }`}
                  />
                ))}
              </View>

              {/* Next */}
              <Pressable
                accessibilityLabel="Next card"
                accessibilityRole="button"
                className={`h-12 w-12 items-center justify-center rounded-full ${
                  hasNext ? 'bg-white/10 active:bg-white/20' : 'opacity-30'
                }`}
                disabled={!hasNext}
                onPress={goToNext}
              >
                <ChevronRight className="text-white" size={24} />
              </Pressable>
            </View>
          </Animated.View>
        </GestureDetector>
      </View>
    </RNModal>
  );
}
