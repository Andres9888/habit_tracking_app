/**
 * useWriteLetterModal Hook
 * State management for the WriteLetterModal component
 */

import { useState, useCallback, useEffect } from 'react';
import { Keyboard } from 'react-native';
import * as Haptics from 'expo-haptics';
import { MIN_CONTENT_LENGTH, ONE_DAY_MS } from '../../LettersSection.constants';
import type { WriteLetterStep } from './WriteLetterModal.types';

interface UseWriteLetterModalParams {
  visible: boolean;
  onSave: (
    content: string,
    unlockDays: number,
    title?: string
  ) => Promise<void>;
  onClose: () => void;
  isSaving: boolean;
}

export function useWriteLetterModal({
  visible,
  onSave,
  onClose,
  isSaving,
}: UseWriteLetterModalParams) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [unlockDays, setUnlockDays] = useState(7);
  const [step, setStep] = useState<WriteLetterStep>('write');

  // Reset form when modal opens
  useEffect(() => {
    if (visible) {
      setTitle('');
      setContent('');
      setUnlockDays(7);
      setStep('write');
    }
  }, [visible]);

  const canProceedToSchedule = content.trim().length >= MIN_CONTENT_LENGTH;
  const canSave = content.trim().length >= MIN_CONTENT_LENGTH && unlockDays > 0;

  // Calculate unlock date for preview
  const unlockDate = new Date(Date.now() + unlockDays * ONE_DAY_MS);
  const unlockDateString = unlockDate.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    weekday: 'long',
    year: 'numeric',
  });

  const handleNext = useCallback(() => {
    if (!canProceedToSchedule) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Keyboard.dismiss();
    setStep('schedule');
  }, [canProceedToSchedule]);

  const handleBack = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setStep('write');
  }, []);

  const handleSave = useCallback(async () => {
    if (!canSave || isSaving) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await onSave(content.trim(), unlockDays, title.trim() || undefined);
      onClose();
    } catch (error) {
    }
  }, [canSave, isSaving, content, unlockDays, title, onSave, onClose]);

  return {
    canProceedToSchedule,
    canSave,
    content,
    handleBack,
    handleNext,
    handleSave,
    setContent,
    setTitle,
    setUnlockDays,
    step,
    title,
    unlockDateString,
    unlockDays,
  };
}
