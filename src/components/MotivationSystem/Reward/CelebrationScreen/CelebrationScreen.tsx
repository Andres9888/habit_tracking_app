/**
 * CelebrationScreen - Post-completion celebration and reflection flow
 *
 * Part of the Motivation System - Reward phase
 * Scientific Basis: BJ Fogg (Stanford) - Celebration immediately after behavior
 * is the most important part of habit formation.
 */

import React from 'react';
import { View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Modal } from '../../../Modal';
import { QuickReflection } from '../QuickReflection';
import {
  AnimatedContent,
  CelebrationHeader,
  StreakDisplay,
  StatsRow,
  ModalHeader,
  ScienceTip,
  CaptureSection,
  DoneButton,
} from './components';
import { useCelebrationScreen } from './useCelebrationScreen';
import type { CelebrationScreenProps } from './types';

export function CelebrationScreen(props: CelebrationScreenProps) {
  const {
    visible,
    onClose,
    habit,
    onReflectionSubmit,
    reduceMotion = false,
  } = props;
  const insets = useSafeAreaInsets();
  const state = useCelebrationScreen(props);

  if (!habit) return null;

  let idx = 0;

  return (
    <Modal
      respectReduceMotion={!reduceMotion}
      variant='fullScreen'
      visible={visible}
      onClose={onClose}
    >
      <View
        className='flex-1 bg-gradient-to-b from-emerald-50 to-stone-50'
        style={{ paddingTop: insets.top }}
      >
        <ModalHeader onClose={onClose} />
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
          {state.hasStreak && (
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
          {state.hasStats && (
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
                note={state.localNote}
                reduceMotion={reduceMotion}
                sectionIndex={idx}
                selectedEmoji={state.localEmoji}
                shouldAnimate={false}
                onEmojiSelect={state.handleEmojiSelect}
                onNoteChange={state.handleNoteChange}
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
              onRecordVoice={state.handleRecordVoice}
              onWriteLetter={state.handleWriteLetter}
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
        <View
          className='border-t border-emerald-100 bg-white px-4 pt-4'
          style={{ paddingBottom: Math.max(insets.bottom, 16) }}
        >
          <AnimatedContent
            index={idx++}
            reduceMotion={reduceMotion}
            visible={visible}
          >
            <DoneButton
              reduceMotion={reduceMotion}
              onPress={state.handleDone}
            />
          </AnimatedContent>
        </View>
      </View>
    </Modal>
  );
}

export default CelebrationScreen;
