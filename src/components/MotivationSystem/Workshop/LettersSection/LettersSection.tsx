/**
 * LettersSection Component
 * Letters to Self - Time-locked messages from past self to future self
 *
 * Scientific Basis:
 * - Temporal self-continuity: Connecting with future self increases self-control
 * - Delayed gratification psychology (Mischel's marshmallow studies)
 */

import React from 'react';
import { Text } from 'react-native';
import { CompletionCheckmark } from '../../../animations';
import type { LettersSectionProps } from './LettersSection.types';
import { useLettersSection } from './useLettersSection';
import { SectionCard } from './components/SectionCard';
import { AnimatedSection } from './components/AnimatedSection';
import { LettersSectionHeader } from './components/LettersSectionHeader';
import { WriteLetterButton } from './components/WriteLetterButton';
import { LettersList } from './components/LettersList';
import { WriteLetterModal } from './components/WriteLetterModal';
import { ReadLetterModal } from './components/ReadLetterModal';

export function LettersSection(props: LettersSectionProps) {
  const {
    letters,
    letterCount,
    isPremium,
    onViewAllLetters,
    shouldAnimate = false,
    reduceMotion = false,
    sectionIndex = 0,
  } = props;

  const hookResult = useLettersSection(props);
  const hasLetters = letterCount > 0;

  return (
    <>
      <AnimatedSection
        index={sectionIndex}
        reduceMotion={reduceMotion}
        shouldAnimate={shouldAnimate}
      >
        <SectionCard
          accessibilityLabel={
            hasLetters
              ? 'Letters to self'
              : 'Write a letter to your future self'
          }
          className='border-l-4 border-l-violet-400'
          onPress={hookResult.handleSectionPress}
        >
          <LettersSectionHeader
            hasLetters={hasLetters}
            isPremium={isPremium}
            unreadCount={hookResult.unreadCount}
          />

          {!hasLetters && (
            <Text className='text-sm text-stone-500'>
              Send motivation to your future self
            </Text>
          )}

          <CompletionCheckmark
            isVisible={hasLetters}
            reduceMotion={reduceMotion}
            sectionIndex={sectionIndex}
            shouldAnimate={shouldAnimate}
          />

          {isPremium && (
            <WriteLetterButton
              hasLetters={hasLetters}
              onPress={hookResult.handleOpenWriteModal}
            />
          )}

          <LettersList
            letters={letters}
            onReadLetter={hookResult.handleOpenReadModal}
            onViewAllLetters={onViewAllLetters}
          />
        </SectionCard>
      </AnimatedSection>

      <WriteLetterModal
        isSaving={hookResult.isSaving}
        visible={hookResult.isWriteModalOpen}
        onClose={hookResult.handleCloseWriteModal}
        onSave={hookResult.handleSaveLetter}
      />

      <ReadLetterModal
        letter={hookResult.selectedLetter}
        reduceMotion={reduceMotion}
        visible={hookResult.isReadModalOpen}
        onClose={hookResult.handleCloseReadModal}
        onMarkAsRead={hookResult.handleMarkAsRead}
      />
    </>
  );
}
