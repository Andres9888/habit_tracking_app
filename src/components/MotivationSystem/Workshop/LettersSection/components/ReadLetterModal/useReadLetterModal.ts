/**
 * useReadLetterModal Hook
 * Animation and state management for ReadLetterModal
 */

import { triggerHaptic } from '@/utils/haptics';
import { useState, useEffect } from 'react';
import { withSpring, withTiming, withSequence } from 'react-native-reanimated';
import { SPRING_BOUNCY, SPRING_GENTLE } from '../../../../../animations';
import { ONE_HOUR_MS, ONE_DAY_MS } from '../../LettersSection.constants';
import type { LetterData } from '../../LettersSection.types';
import { useReadLetterAnimations } from './useReadLetterAnimations';

interface UseReadLetterModalParams {
  visible: boolean;
  letter: LetterData | null;
  reduceMotion: boolean;
  onMarkAsRead: (letterId: string) => void;
}

export function useReadLetterModal({
  visible,
  letter,
  reduceMotion,
  onMarkAsRead,
}: UseReadLetterModalParams) {
  const anim = useReadLetterAnimations();
  const [showContent, setShowContent] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  const wasJustUnlocked = letter
    ? Date.now() - letter.unlockAt < ONE_HOUR_MS && !letter.isRead
    : false;
  const daysSinceWritten = letter
    ? Math.floor((Date.now() - letter.createdAt) / ONE_DAY_MS)
    : 0;
  const writtenDateString = letter
    ? new Date(letter.createdAt).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '';
  const isLocked = letter ? letter.unlockAt > Date.now() : false;

  useEffect(() => {
    if (!visible || !letter) return;
    setShowContent(false);
    setAnimationComplete(false);

    if (reduceMotion) {
      setShowContent(true);
      setAnimationComplete(true);
      anim.envelopeScale.value = 1;
      anim.envelopeOpacity.value = 1;
      anim.contentOpacity.value = 1;
      anim.contentTranslateY.value = 0;
      anim.sparkleScale.value = 1;
      if (!letter.isRead) onMarkAsRead(letter.id);
      return;
    }

    anim.envelopeScale.value = withSpring(1, SPRING_BOUNCY);
    anim.envelopeOpacity.value = withTiming(1, { duration: 400 });

    if (wasJustUnlocked) {
      setTimeout(() => {
        anim.sparkleScale.value = withSequence(
          withSpring(1.2, SPRING_BOUNCY),
          withSpring(1, { damping: 15, stiffness: 200 })
        );
        triggerHaptic('success');
      }, 300);
    }

    setTimeout(
      () => {
        setShowContent(true);
        anim.contentOpacity.value = withTiming(1, { duration: 500 });
        anim.contentTranslateY.value = withSpring(0, SPRING_GENTLE);
        if (!letter.isRead) onMarkAsRead(letter.id);
        setTimeout(() => setAnimationComplete(true), 500);
      },
      wasJustUnlocked ? 800 : 400
    );
  }, [visible, letter?.id]);

  return {
    animationComplete,
    contentAnimatedStyle: anim.contentAnimatedStyle,
    daysSinceWritten,
    envelopeAnimatedStyle: anim.envelopeAnimatedStyle,
    isLocked,
    showContent,
    sparkleAnimatedStyle: anim.sparkleAnimatedStyle,
    wasJustUnlocked,
    writtenDateString,
  };
}
