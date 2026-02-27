/**
 * useVisionBoardPreview Hook
 * Manages state and navigation for VisionBoardPreview
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { AccessibilityInfo, ScrollView } from 'react-native';
import type { VisionBoardItem } from './VisionBoardPreview.types';
import { triggerHaptic } from '@/utils/haptics';

interface UseVisionBoardPreviewParams {
  items: VisionBoardItem[];
  initialIndex: number;
  visible: boolean;
  onClose: () => void;
  onEdit: (item: VisionBoardItem) => void;
}

export function useVisionBoardPreview({
  items,
  initialIndex,
  visible,
  onClose,
  onEdit,
}: UseVisionBoardPreviewParams) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [reduceMotion, setReduceMotion] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Check reduce motion preference
  useEffect(() => {
    void AccessibilityInfo.isReduceMotionEnabled()
      .then(setReduceMotion)
      .catch((error) => {
        if (__DEV__) console.warn('Error checking reduce motion setting:', error);
        setReduceMotion(false);
      });
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

  const currentItem = items[currentIndex];
  const hasNext = currentIndex < items.length - 1;
  const hasPrev = currentIndex > 0;

  const handleClose = useCallback(() => {
    triggerHaptic('tap');
    onClose();
  }, [onClose]);

  const handleEdit = useCallback(() => {
    triggerHaptic('tap');
    if (currentItem) {
      onEdit(currentItem);
    }
  }, [currentItem, onEdit]);

  const goToNext = useCallback(() => {
    if (hasNext) {
      triggerHaptic('tap');
      setCurrentIndex((prev) => prev + 1);
    }
  }, [hasNext]);

  const goToPrev = useCallback(() => {
    if (hasPrev) {
      triggerHaptic('tap');
      setCurrentIndex((prev) => prev - 1);
    }
  }, [hasPrev]);

  return {
    currentIndex,
    currentItem,
    goToNext,
    goToPrev,
    handleClose,
    handleEdit,
    hasNext,
    hasPrev,
    reduceMotion,
    scrollViewRef,
  };
}
