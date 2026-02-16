/**
 * VisionBoardPreview Component
 *
 * Full-screen preview for vision board cards with gestures:
 * - Swipe down to dismiss
 * - Swipe left/right to navigate between cards
 * - Edit button to open editor
 */

import React from 'react';
import { View, Modal as RNModal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated from 'react-native-reanimated';
import { GestureDetector } from 'react-native-gesture-handler';

import type { VisionBoardPreviewProps } from './VisionBoardPreview.types';
import { useVisionBoardPreview } from './useVisionBoardPreview';
import { useVisionBoardGestures } from './useVisionBoardGestures';
import {
  PreviewHeader,
  PreviewContent,
  NavigationControls,
} from './components';

export function VisionBoardPreview({
  items,
  initialIndex,
  visible,
  onClose,
  onEdit,
}: VisionBoardPreviewProps) {
  const insets = useSafeAreaInsets();

  const {
    currentIndex,
    currentItem,
    goToNext,
    goToPrev,
    handleClose,
    handleEdit,
    hasNext,
    hasPrev,
    reduceMotion,
  } = useVisionBoardPreview({
    initialIndex,
    items,
    onClose,
    onEdit,
    visible,
  });

  const { panGesture, animatedContainerStyle } = useVisionBoardGestures({
    goToNext,
    goToPrev,
    handleClose,
    hasNext,
    hasPrev,
    reduceMotion,
  });

  if (!currentItem) {
    return null;
  }

  return (
    <RNModal
      accessibilityViewIsModal
      statusBarTranslucent
      transparent
      animationType={reduceMotion ? 'none' : 'fade'}
      visible={visible}
      onRequestClose={handleClose}
    >
      <View className='flex-1 bg-black/90'>
        <GestureDetector gesture={panGesture}>
          <Animated.View className='flex-1' style={animatedContainerStyle}>
            <PreviewHeader
              currentIndex={currentIndex}
              itemCount={items.length}
              topPadding={insets.top + 16}
              onClose={handleClose}
              onEdit={handleEdit}
            />

            <PreviewContent item={currentItem} />

            <NavigationControls
              bottomPadding={insets.bottom + 16}
              currentIndex={currentIndex}
              hasNext={hasNext}
              hasPrev={hasPrev}
              itemCount={items.length}
              onNext={goToNext}
              onPrev={goToPrev}
            />
          </Animated.View>
        </GestureDetector>
      </View>
    </RNModal>
  );
}
