import React from 'react';
import { View, ScrollView } from 'react-native';
import { QuickReflection } from '../QuickReflection';
import {
  AnimatedContent,
  CelebrationHeader,
  StreakDisplay,
  StatsRow,
  ScienceTip,
  CaptureSection,
} from './components';
import type { CelebrationScreenContentProps } from './types';

interface CelebrationScreenContentPropsExtended extends CelebrationScreenContentProps {
  hasStreak: boolean;
  hasStats: boolean;
  localNote: string;
  localEmoji: string | null;
  handleEmojiSelect: (emoji: string) => void;
  handleNoteChange: (note: string) => void;
  handleRecordVoice: () => void;
  handleWriteLetter: () => void;
  onReflectionSubmit?: () => void;
}

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
        <AnimatedContent
          index={idx++}
          reduceMotion={reduceMotion}
          visible={visible}
        >
          <View className='mt-4'>
            <StreakDisplay
              reduceMotion={reduceMotion}
              streak={habit.currentStreak!}
            />
          </View>
        </AnimatedContent>
      )}
      {hasStats && (
        <AnimatedContent
          index={idx++}
          reduceMotion={reduceMotion}
          visible={visible}
        >
          <View className='mt-4'>
            <StatsRow
              bestStreak={habit.bestStreak}
              completionRate={habit.completionRate}
              totalCompletions={habit.totalCompletions}
            />
          </View>
        </AnimatedContent>
      )}
      <AnimatedContent
        index={idx++}
        reduceMotion={reduceMotion}
        visible={visible}
      >
        <View className='mt-4'>
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
        </View>
      </AnimatedContent>
      <AnimatedContent
        index={idx++}
        reduceMotion={reduceMotion}
        visible={visible}
      >
        <CaptureSection
          onRecordVoice={handleRecordVoice}
          onWriteLetter={handleWriteLetter}
        />
      </AnimatedContent>
      <AnimatedContent
        index={idx++}
        reduceMotion={reduceMotion}
        visible={visible}
      >
        <ScienceTip />
      </AnimatedContent>
    </ScrollView>
  );
}
