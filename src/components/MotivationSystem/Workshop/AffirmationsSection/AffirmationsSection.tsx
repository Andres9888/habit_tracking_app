/**
 * AffirmationsSection - Main component
 * Positive self-talk cards for daily reinforcement
 */

import React, { useCallback } from 'react';

import type { AffirmationsSectionProps } from './AffirmationsSection.types';
import { AffirmationModals } from './components/AffirmationModals';
import { AffirmationsSectionContent } from './components/AffirmationsSectionContent';
import { SectionCard, AnimatedSection } from './components';
import { useAffirmationsSection } from './useAffirmationsSection';

export function AffirmationsSection({
  affirmations,
  affirmationCount,
  isPremium,
  onSaveAffirmation,
  onUpdateAffirmation,
  onDeleteAffirmation,
  onScheduleAffirmation,
  onCancelSchedule,
  onGenerateAffirmations,
  isGenerating = false,
  hasHabitContext = false,
  onPremiumRequired,
  shouldAnimate = false,
  reduceMotion = false,
  sectionIndex = 0,
}: AffirmationsSectionProps) {
  const hook = useAffirmationsSection({
    affirmationCount,
    isPremium,
    onCancelSchedule,
    onDeleteAffirmation,
    onPremiumRequired,
    onSaveAffirmation,
    onScheduleAffirmation,
    onUpdateAffirmation,
  });

  const handleSectionPress = useCallback(() => {
    if (!hook.hasAffirmations) {
      hook.handleOpenEditor();
    }
  }, [hook.hasAffirmations, hook.handleOpenEditor]);

  const accessibilityLabel = hook.hasAffirmations
    ? 'Affirmations'
    : 'Add your first affirmation';

  return (
    <>
      <AnimatedSection
        index={sectionIndex}
        reduceMotion={reduceMotion}
        shouldAnimate={shouldAnimate}
      >
        <SectionCard
          accessibilityLabel={accessibilityLabel}
          className='border-l-4 border-l-amber-400'
          onPress={handleSectionPress}
        >
          <AffirmationsSectionContent
            affirmationCount={affirmationCount}
            affirmations={affirmations}
            canAddMore={hook.canAddMore}
            hasAffirmations={hook.hasAffirmations}
            hasHabitContext={hasHabitContext}
            isGenerating={isGenerating}
            isPremium={isPremium}
            reduceMotion={reduceMotion}
            sectionIndex={sectionIndex}
            shouldAnimate={shouldAnimate}
            onDeleteAffirmation={hook.handleDelete}
            onEditAffirmation={hook.handleEditAffirmation}
            onGenerateAffirmations={onGenerateAffirmations}
            onOpenEditor={hook.handleOpenEditor}
            onOpenScheduleModal={
              onScheduleAffirmation ? hook.handleOpenScheduleModal : undefined
            }
            onPremiumRequired={onPremiumRequired}
          />
        </SectionCard>
      </AnimatedSection>

      <AffirmationModals
        editingAffirmation={hook.editingAffirmation}
        isEditorOpen={hook.isEditorOpen}
        isPremium={isPremium}
        isSaving={hook.isSaving}
        isScheduleModalOpen={hook.isScheduleModalOpen}
        isScheduleSaving={hook.isScheduleSaving}
        schedulingAffirmation={hook.schedulingAffirmation}
        onCancelSchedule={hook.handleCancelSchedule}
        onCloseEditor={hook.handleCloseEditor}
        onCloseScheduleModal={hook.handleCloseScheduleModal}
        onSave={hook.handleSave}
        onSaveSchedule={hook.handleSaveSchedule}
      />
    </>
  );
}

export default AffirmationsSection;
