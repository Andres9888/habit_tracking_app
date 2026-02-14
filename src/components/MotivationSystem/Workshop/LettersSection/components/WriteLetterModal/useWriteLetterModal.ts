/**
 * useWriteLetterModal Hook
 * State management for the WriteLetterModal component
 */

import { triggerHaptic } from '@/utils/haptics';
import { useState, useCallback, useEffect } from 'react';
import { Keyboard } from 'react-native';
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
    triggerHaptic('tap');
    Keyboard.dismiss();
    setStep('schedule');
  }, [canProceedToSchedule]);

  const handleBack = useCallback(() => {
    triggerHaptic('tap');
    setStep('write');
  }, []);

  const handleSave = useCallback(async () => {
    if (!canSave || isSaving) return;
    triggerHaptic('toggle');
    try {
      await onSave(content.trim(), unlockDays, title.trim() || undefined);
      onClose();
    } catch (error) {
      if (__DEV__) console.error('Failed to save letter:', error);
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
