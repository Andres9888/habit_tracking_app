
import React from 'react';
import { ScrollView } from 'react-native';

import type { CelebrationScreenContentPropsExtended } from './CelebrationScreenContent.types';
import {
  AnimatedSection,
  CaptureSection,
  ScienceTip,
  StatsRow,
  StreakDisplay,
} from './components';
import { HeaderSection, ReflectionSection } from './sections';

export function CelebrationScreenContent({
  habit,
  visible,
  reduceMotion,
  hasStreak,
  hasStats,
  localNote,
  localEmoji,
  handleEmojiSelect,
  handleNoteChange,
  handleRecordVoice,
  handleWriteLetter,
  onReflectionSubmit,
}: CelebrationScreenContentPropsExtended) {
  // Track current section index for staggered animations
  let sectionIndex = 0;

  return (
    <ScrollView
      className='flex-1 px-4'
      contentContainerStyle={{ paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
    >
      <HeaderSection
        habitName={habit.name}
        index={sectionIndex++}
        isStreakMilestone={habit.isStreakMilestone}
        milestoneNumber={habit.milestoneNumber}
        reduceMotion={reduceMotion}
        visible={visible}
      />
      {hasStreak && (
        <AnimatedSection
          index={sectionIndex++}
          reduceMotion={reduceMotion}
          visible={visible}
        >
          <StreakDisplay
            reduceMotion={reduceMotion}
            streak={habit.currentStreak!}
          />
        </AnimatedSection>
      )}
      {hasStats && (
        <AnimatedSection
          index={sectionIndex++}
          reduceMotion={reduceMotion}
          visible={visible}
        >
          <StatsRow
            bestStreak={habit.bestStreak}
            completionRate={habit.completionRate}
            totalCompletions={habit.totalCompletions}
          />
        </AnimatedSection>
      )}
      <ReflectionSection
        handleEmojiSelect={handleEmojiSelect}
        handleNoteChange={handleNoteChange}
        index={sectionIndex++}
        localEmoji={localEmoji}
        localNote={localNote}
        reduceMotion={reduceMotion}
        visible={visible}
        onReflectionSubmit={onReflectionSubmit ?? (() => {})}
      />
      <AnimatedSection
        index={sectionIndex++}
        reduceMotion={reduceMotion}
        visible={visible}
      >
        <CaptureSection
          onRecordVoice={handleRecordVoice}
          onWriteLetter={handleWriteLetter}
        />
      </AnimatedSection>
      <AnimatedSection
        index={sectionIndex++}
        reduceMotion={reduceMotion}
        visible={visible}
      >
        <ScienceTip />
      </AnimatedSection>
    </ScrollView>
  );
}
