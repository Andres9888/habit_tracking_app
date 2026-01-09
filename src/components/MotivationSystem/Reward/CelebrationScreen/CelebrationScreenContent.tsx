import React from 'react';
import { ScrollView } from 'react-native';
import { QuickReflection } from '../QuickReflection';
import {
  AnimatedContent,
  AnimatedSection,
  CaptureSection,
  CelebrationHeader,
  ScienceTip,
  StatsRow,
  StreakDisplay,
} from './components';
import type { CelebrationScreenContentPropsExtended } from './CelebrationScreenContent.types';

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
  let idx = 0;

  return (
    <ScrollView
      className='flex-1 px-4'
      contentContainerStyle={{ paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
    >
      <AnimatedContent
        index={idx++}
        reduceMotion={reduceMotion}
        visible={visible}
      >
        <CelebrationHeader
          habitName={habit.name}
          isStreakMilestone={habit.isStreakMilestone}
          milestoneNumber={habit.milestoneNumber}
          reduceMotion={reduceMotion}
        />
      </AnimatedContent>
      {hasStreak && (
        <AnimatedSection
          index={idx++}
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
          index={idx++}
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
      <AnimatedSection
        index={idx++}
        reduceMotion={reduceMotion}
        visible={visible}
      >
        <QuickReflection
          showNoteInput
          compact={false}
          note={localNote}
          reduceMotion={reduceMotion}
          sectionIndex={idx}
          selectedEmoji={localEmoji}
          shouldAnimate={false}
          onEmojiSelect={handleEmojiSelect}
          onNoteChange={handleNoteChange}
          onSubmit={onReflectionSubmit}
        />
      </AnimatedSection>
      <AnimatedSection
        index={idx++}
        reduceMotion={reduceMotion}
        visible={visible}
      >
        <CaptureSection
          onRecordVoice={handleRecordVoice}
          onWriteLetter={handleWriteLetter}
        />
      </AnimatedSection>
      <AnimatedSection
        index={idx++}
        reduceMotion={reduceMotion}
        visible={visible}
      >
        <ScienceTip />
      </AnimatedSection>
    </ScrollView>
  );
}
