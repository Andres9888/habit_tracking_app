/**
 * Hook for GenerateAffirmationsButton logic
 */

import { useCallback, useState, useRef, useEffect } from 'react';
import { Alert } from 'react-native';
import {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { SPRING_BUTTON } from '../../../animations';
import { SUCCESS_FEEDBACK_DURATION } from './constants';

interface UseGenerateButtonParams {
  isPremium: boolean;
  isGenerating: boolean;
  canGenerate: boolean;
  remainingSlots: number;
  maxCount: number;
  onGenerate: () => Promise<void>;
  onPremiumRequired: () => void;
}

export function useGenerateButton({
  isPremium,
  isGenerating,
  canGenerate,
  remainingSlots,
  maxCount,
  onGenerate,
  onPremiumRequired,
}: UseGenerateButtonParams) {
  const [showSuccess, setShowSuccess] = useState(false);
  const scale = useSharedValue(1);
  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
    };
  }, []);

  const handlePress = useCallback(async () => {
    if (!isPremium) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      onPremiumRequired();
      return;
    }

    if (!canGenerate) {
      if (remainingSlots <= 0) {
        Alert.alert(
          'Limit Reached',
          `You can have up to ${maxCount} affirmations per habit. Remove some to generate new ones.`
        );
      }
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      await onGenerate();

      setShowSuccess(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      if (successTimerRef.current) clearTimeout(successTimerRef.current);
      successTimerRef.current = setTimeout(() => setShowSuccess(false), SUCCESS_FEEDBACK_DURATION);
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

      Alert.alert(
        'Generation Failed',
        error instanceof Error
          ? error.message
          : 'Unable to generate affirmations. Please try again.'
      );
    }
  }, [
    isPremium,
    canGenerate,
    remainingSlots,
    maxCount,
    onGenerate,
    onPremiumRequired,
  ]);

  const handlePressIn = useCallback(() => {
    if (!isGenerating) {
      scale.value = withSpring(0.95, SPRING_BUTTON);
    }
  }, [isGenerating, scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, SPRING_BUTTON);
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return {
    animatedStyle,
    handlePress,
    handlePressIn,
    handlePressOut,
    showSuccess,
  };
}
