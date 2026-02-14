/**
 * useLettersSection Hook
 * State management for the LettersSection component
 */

import { useState, useCallback } from 'react';
import type { LetterData, LettersSectionProps } from './LettersSection.types';

type UseLettersSectionParams = Pick<
  LettersSectionProps,
  | 'letters'
  | 'isPremium'
  | 'habitName'
  | 'onSaveLetter'
  | 'onReadLetter'
  | 'onMarkAsRead'
  | 'onPremiumRequired'
>;

export function useLettersSection(props: UseLettersSectionParams) {
  const {
    letters,
    isPremium,
    habitName,
    onSaveLetter,
    onReadLetter,
    onMarkAsRead,
    onPremiumRequired,
  } = props;
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [isReadModalOpen, setIsReadModalOpen] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState<LetterData | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const unreadCount = letters.filter(
    (l) => !l.isRead && l.unlockAt <= Date.now()
  ).length;

  const handleOpenWriteModal = useCallback(() => {
    if (!isPremium) {
      onPremiumRequired();
      return;
    }
    setIsWriteModalOpen(true);
  }, [isPremium, onPremiumRequired]);

  const handleCloseWriteModal = useCallback(() => {
    setIsWriteModalOpen(false);
  }, []);

  const handleOpenReadModal = useCallback(
    (letterId: string) => {
      const letter = letters.find((l) => l.id === letterId);
      if (!letter) return;

      const letterData: LetterData = {
        ...letter,
        habitName,
      };

      setSelectedLetter(letterData);
      setIsReadModalOpen(true);
      onReadLetter(letterId);
    },
    [letters, habitName, onReadLetter]
  );

  const handleCloseReadModal = useCallback(() => {
    setIsReadModalOpen(false);
    setTimeout(() => setSelectedLetter(null), 300);
  }, []);

  const handleMarkAsRead = useCallback(
    (letterId: string) => {
      onMarkAsRead?.(letterId);
    },
    [onMarkAsRead]
  );

  const handleSaveLetter = useCallback(
    async (content: string, unlockDays: number, title?: string) => {
      setIsSaving(true);
      try {
        await onSaveLetter(content, unlockDays, title);
      } finally {
        setIsSaving(false);
      }
    },
    [onSaveLetter]
  );

  const handleSectionPress = useCallback(() => {
    if (!isPremium) {
      onPremiumRequired();
    }
  }, [isPremium, onPremiumRequired]);

  return {
    handleCloseReadModal,
    handleCloseWriteModal,
    handleMarkAsRead,
    handleOpenReadModal,
    handleOpenWriteModal,
    handleSaveLetter,
    handleSectionPress,
    isReadModalOpen,
    isSaving,
    isWriteModalOpen,
    selectedLetter,
    unreadCount,
  };
}
