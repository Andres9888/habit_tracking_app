/**
 * State management for TemplatesScreen
 */

import { useState } from 'react';
import type { Doc } from '../../../convex/_generated/dataModel';
import { useFeedbackState } from './hooks/useFeedbackState';
import { useImportedTemplateIdsSync } from './hooks/useImportedTemplateIdsSync';
import type { TemplatePreviewAnchor } from './TemplatesScreen.types';

interface UseTemplatesScreenStateOptions {
  initialImportedIds?: Set<string>;
}

export function useTemplatesScreenState({
  initialImportedIds,
}: UseTemplatesScreenStateOptions) {
  const [previewTemplate, setPreviewTemplate] =
    useState<Doc<'templates'> | null>(null);
  const [showFullsizePreview, setShowFullsizePreview] = useState(false);
  const [previewInitialAnchor, setPreviewInitialAnchor] =
    useState<TemplatePreviewAnchor>('top');
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const {
    catalogOrderImportedIds,
    importedTemplateIds,
    setImportedTemplateIds,
  } = useImportedTemplateIdsSync(initialImportedIds);
  const feedback = useFeedbackState();
  const [importingTemplateIds, setImportingTemplateIds] = useState<Set<string>>(
    new Set()
  );
  const [showPaywall, setShowPaywall] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  return {
    ...feedback,
    catalogOrderImportedIds,
    importedTemplateIds,
    importingTemplateIds,
    isSeeding,
    previewInitialAnchor,
    previewTemplate,
    setImportedTemplateIds,
    setImportingTemplateIds,
    setIsSeeding,
    setPreviewInitialAnchor,
    setPreviewTemplate,
    setShowCustomizeModal,
    setShowFullsizePreview,
    setShowPaywall,
    showCustomizeModal,
    showFullsizePreview,
    showPaywall,
  };
}
