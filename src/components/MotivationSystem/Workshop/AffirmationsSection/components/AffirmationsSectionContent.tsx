/**
 * AffirmationsSectionContent Component
 * Inner content of the affirmations section card
 */

import React from 'react';
import { Text } from 'react-native';
import { CompletionCheckmark } from '../../../../animations';
import type { AffirmationData } from '../AffirmationsSection.types';
import { AffirmationsSectionHeader } from './AffirmationsSectionHeader';
import { AffirmationsActionButtons } from './AffirmationsActionButtons';
import { AffirmationsList } from './AffirmationsList';

interface AffirmationsSectionContentProps {
  affirmations: AffirmationData[];
  affirmationCount: number;
  isPremium: boolean;
  hasAffirmations: boolean;
  canAddMore: boolean;
  hasHabitContext: boolean;
  isGenerating: boolean;
  reduceMotion: boolean;
  sectionIndex: number;
  shouldAnimate: boolean;
  onOpenEditor: () => void;
  onEditAffirmation: (affirmation: AffirmationData) => void;
  onDeleteAffirmation: (id: string) => void;
  onOpenScheduleModal?: (affirmation: AffirmationData) => void;
  onGenerateAffirmations?: () => Promise<void>;
  onPremiumRequired: () => void;
}

export function AffirmationsSectionContent({
  affirmations,
  affirmationCount,
  isPremium,
  hasAffirmations,
  canAddMore,
  hasHabitContext,
  isGenerating,
  reduceMotion,
  sectionIndex,
  shouldAnimate,
  onOpenEditor,
  onEditAffirmation,
  onDeleteAffirmation,
  onOpenScheduleModal,
  onGenerateAffirmations,
  onPremiumRequired,
}: AffirmationsSectionContentProps) {
  return (
    <>
      <AffirmationsSectionHeader
        affirmationCount={affirmationCount}
        hasAffirmations={hasAffirmations}
        isPremium={isPremium}
      />

      {!hasAffirmations && (
        <Text className='text-sm text-stone-500'>
          Positive statements for daily reinforcement
        </Text>
      )}

      <CompletionCheckmark
        isVisible={hasAffirmations}
        reduceMotion={reduceMotion}
        sectionIndex={sectionIndex}
        shouldAnimate={shouldAnimate}
      />

      <AffirmationsActionButtons
        affirmationCount={affirmationCount}
        canAddMore={canAddMore}
        hasAffirmations={hasAffirmations}
        hasHabitContext={hasHabitContext}
        isGenerating={isGenerating}
        isPremium={isPremium}
        reduceMotion={reduceMotion}
        onGenerateAffirmations={onGenerateAffirmations}
        onOpenEditor={onOpenEditor}
        onPremiumRequired={onPremiumRequired}
      />

      <AffirmationsList
        affirmations={affirmations}
        isPremium={isPremium}
        onDelete={onDeleteAffirmation}
        onEdit={onEditAffirmation}
        onSchedule={onOpenScheduleModal}
      />
    </>
  );
}
