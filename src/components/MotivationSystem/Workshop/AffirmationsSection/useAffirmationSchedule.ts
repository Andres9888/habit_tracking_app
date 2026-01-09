/**
 * Custom hook for affirmation schedule modal state management
 */

import { useState, useCallback } from 'react';
import type {
  AffirmationData,
  AffirmationScheduleConfig,
  AffirmationsSectionProps,
} from './AffirmationsSection.types';

interface UseAffirmationScheduleProps {
  isPremium: boolean;
  onScheduleAffirmation?: AffirmationsSectionProps['onScheduleAffirmation'];
  onCancelSchedule?: AffirmationsSectionProps['onCancelSchedule'];
  onPremiumRequired: () => void;
}

export function useAffirmationSchedule({
  isPremium,
  onScheduleAffirmation,
  onCancelSchedule,
  onPremiumRequired,
}: UseAffirmationScheduleProps) {
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [schedulingAffirmation, setSchedulingAffirmation] =
    useState<AffirmationData | null>(null);
  const [isScheduleSaving, setIsScheduleSaving] = useState(false);

  const handleOpenScheduleModal = useCallback(
    (affirmation: AffirmationData) => {
      if (!isPremium) {
        onPremiumRequired();
        return;
      }
      setSchedulingAffirmation(affirmation);
      setIsScheduleModalOpen(true);
    },
    [isPremium, onPremiumRequired]
  );

  const handleCloseScheduleModal = useCallback(() => {
    setIsScheduleModalOpen(false);
    setSchedulingAffirmation(null);
  }, []);

  const handleSaveSchedule = useCallback(
    async (schedule: AffirmationScheduleConfig) => {
      if (!schedulingAffirmation || !onScheduleAffirmation) return;
      setIsScheduleSaving(true);
      try {
        await onScheduleAffirmation(schedulingAffirmation.id, schedule);
      } finally {
        setIsScheduleSaving(false);
      }
    },
    [schedulingAffirmation, onScheduleAffirmation]
  );

  const handleCancelSchedule = useCallback(async () => {
    if (!schedulingAffirmation || !onCancelSchedule) return;
    setIsScheduleSaving(true);
    try {
      await onCancelSchedule(schedulingAffirmation.id);
    } finally {
      setIsScheduleSaving(false);
    }
  }, [schedulingAffirmation, onCancelSchedule]);

  return {
    handleCancelSchedule,
    handleCloseScheduleModal,
    handleOpenScheduleModal,
    handleSaveSchedule,
    isScheduleModalOpen,
    isScheduleSaving,
    schedulingAffirmation,
  };
}
