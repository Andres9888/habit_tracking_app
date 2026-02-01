/**
 * Custom hook for affirmation editor state management
 */

import { useState, useCallback } from 'react';
import type {
  AffirmationData,
  AffirmationType,
  AffirmationsSectionProps,
} from './AffirmationsSection.types';
import { FREE_TIER_MAX_AFFIRMATIONS } from './AffirmationsSection.constants';

interface UseAffirmationEditorProps {
  affirmationCount: number;
  isPremium: boolean;
  onSaveAffirmation: AffirmationsSectionProps['onSaveAffirmation'];
  onUpdateAffirmation: AffirmationsSectionProps['onUpdateAffirmation'];
  onDeleteAffirmation: AffirmationsSectionProps['onDeleteAffirmation'];
  onPremiumRequired: () => void;
}

export function useAffirmationEditor({
  affirmationCount,
  isPremium,
  onSaveAffirmation,
  onUpdateAffirmation,
  onDeleteAffirmation,
  onPremiumRequired,
}: UseAffirmationEditorProps) {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingAffirmation, setEditingAffirmation] =
    useState<AffirmationData | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const hasAffirmations = affirmationCount > 0;
  const canAddMore = isPremium || affirmationCount < FREE_TIER_MAX_AFFIRMATIONS;

  const handleOpenEditor = useCallback(() => {
    if (!canAddMore) {
      onPremiumRequired();
      return;
    }
    setEditingAffirmation(null);
    setIsEditorOpen(true);
  }, [canAddMore, onPremiumRequired]);

  const handleEditAffirmation = useCallback((affirmation: AffirmationData) => {
    setEditingAffirmation(affirmation);
    setIsEditorOpen(true);
  }, []);

  const handleCloseEditor = useCallback(() => {
    setIsEditorOpen(false);
  }, []);

  const handleSave = useCallback(
    async (text: string, type?: AffirmationType) => {
      setIsSaving(true);
      try {
        await (editingAffirmation
          ? onUpdateAffirmation(editingAffirmation.id, text, type)
          : onSaveAffirmation(text, type));
      } finally {
        setIsSaving(false);
      }
    },
    [editingAffirmation, onSaveAffirmation, onUpdateAffirmation]
  );

  const handleDelete = useCallback(
    async (affirmationId: string) => {
      try {
        await onDeleteAffirmation(affirmationId);
      } catch (error) {
        if (__DEV__) console.error('Failed to delete affirmation:', error);
      }
    },
    [onDeleteAffirmation]
  );

  return {
    canAddMore,
    editingAffirmation,
    handleCloseEditor,
    handleDelete,
    handleEditAffirmation,
    handleOpenEditor,
    handleSave,
    hasAffirmations,
    isEditorOpen,
    isSaving,
  };
}
