/**
 * RescueMode Component
 * Emergency intervention when a user's streak is at risk
 *
 * Part of the Motivation System - Rescue phase
 * Story T8.1-T8.7: Create RescueMode screen/modal
 *
 * Scientific Basis:
 * - Loss aversion (Kahneman & Tversky, Nobel Prize): Losses hurt 2x more
 * - Andrew Huberman Dual Visualization: ALWAYS show failure when unmotivated
 * - BJ Fogg's Tiny Habits: "Just 2 min" reduces activation energy
 */

import React, { useCallback } from 'react';
import { View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Modal } from '../../../Modal';
import type { RescueModeProps } from './RescueMode.types';
import {
  RescueModeHeader,
  RescueModeContent,
  RescueModeActions,
} from './components';

/**
 * RescueMode - Main component
 *
 * Emergency intervention screen when a user's streak is at risk.
 * Key differences from ActivationModal:
 * 1. ALWAYS shows failure visualization (Huberman protocol)
 * 2. "Just 2 Min" is the PRIMARY CTA (not "Start Now")
 * 3. More urgent visual styling (red/amber theme)
 */
export function RescueMode({
  visible,
  onClose,
  habit,
  onJustTwoMin,
  onStartFull,
  onSkipToday,
  onVoiceNotePlayStart,
  onVoiceNotePlayFinish,
  reduceMotion = false,
}: RescueModeProps) {
  const insets = useSafeAreaInsets();

  const handleJustTwoMin = useCallback(() => {
    onJustTwoMin?.();
    onClose();
  }, [onJustTwoMin, onClose]);

  const handleStartFull = useCallback(() => {
    onStartFull?.();
    onClose();
  }, [onStartFull, onClose]);

  const handleSkipToday = useCallback(() => {
    onSkipToday?.();
    onClose();
  }, [onSkipToday, onClose]);

  if (!habit) return null;

  const hasStreak = (habit.currentStreak ?? 0) > 0;
  const hasWhy = !!habit.why;
  const hasVoiceNote = !!habit.day1VoiceNote;
  const hasPreviousStreakNotes =
    (habit.previousStreakVoiceNotes?.length ?? 0) > 0 &&
    (habit.bestStreak ?? 0) >= 3;

  return (
    <Modal
      respectReduceMotion={!reduceMotion}
      variant='fullScreen'
      visible={visible}
      onClose={onClose}
    >
      <View
        className='flex-1 bg-gradient-to-b from-rose-50 to-stone-50'
        style={{ paddingTop: insets.top }}
      >
        <RescueModeHeader onClose={onClose} />

        <ScrollView
          className='flex-1 px-4'
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
          <RescueModeContent
            habit={habit}
            hasPreviousStreakNotes={hasPreviousStreakNotes}
            hasStreak={hasStreak}
            hasVoiceNote={hasVoiceNote}
            hasWhy={hasWhy}
            reduceMotion={reduceMotion}
            visible={visible}
            onVoiceNotePlayFinish={onVoiceNotePlayFinish}
            onVoiceNotePlayStart={onVoiceNotePlayStart}
          />
        </ScrollView>

        <RescueModeActions
          hasPreviousStreakNotes={hasPreviousStreakNotes}
          hasStreak={hasStreak}
          hasVoiceNote={hasVoiceNote}
          hasWhy={hasWhy}
          insets={insets}
          reduceMotion={reduceMotion}
          visible={visible}
          onJustTwoMin={handleJustTwoMin}
          onSkipToday={handleSkipToday}
          onStartFull={handleStartFull}
        />
      </View>
    </Modal>
  );
}

export default RescueMode;
