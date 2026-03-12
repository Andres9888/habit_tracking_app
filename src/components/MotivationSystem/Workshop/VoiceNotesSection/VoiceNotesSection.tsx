/**
 * VoiceNotesSection Component
 * Audio recording interface for Voice Notes feature
 *
 * Part of the Motivation System Workshop tab
 * Story T10.2-T10.8: Voice Notes recording and playback
 */

import React from 'react';
import { View, Text } from 'react-native';
import { CompletionCheckmark } from '../../../animations';
import { useVoiceNotesSection } from './VoiceNotesSection.hooks';
import {
  AnimatedSection, SectionCard, WaveformVisualization, RecordingControls,
  VoiceNotesList, VoiceNotesSectionHeader, RecordButton,
} from './components';
import type { VoiceNotesSectionProps } from './VoiceNotesSection.types';

export function VoiceNotesSection(props: VoiceNotesSectionProps) {
  const {
    voiceNotes, voiceNoteCount, isPremium, onViewAllNotes, onPlayStart, onPlayFinish,
    onSaveRecording, onPremiumRequired, shouldAnimate = false, reduceMotion = false, sectionIndex = 0,
  } = props;
  const hasVoiceNotes = voiceNoteCount > 0;
  const hook = useVoiceNotesSection({ isPremium, onPremiumRequired, onSaveRecording, voiceNoteCount });
  const { status, isRecording, isPaused, formattedDuration, isMaxDurationReached, isApproachingMaxDuration } = hook;
  const { secondsUntilMaxDuration, cancelRecording, pauseRecording, resumeRecording, openSettings, canRecord } = hook;
  const { handleStartRecording, handleStopRecording, handleSectionPress } = hook;

  const showRecordingUI = isRecording || isPaused || ['preparing', 'stopping', 'error', 'permission-denied'].includes(status.state);
  const showInitialButton = !isRecording && !isPaused && !['preparing', 'stopping', 'error', 'permission-denied'].includes(status.state);

  return (
    <AnimatedSection index={sectionIndex} reduceMotion={reduceMotion} shouldAnimate={shouldAnimate}>
      <SectionCard
        accessibilityLabel={hasVoiceNotes ? 'Voice notes' : 'Add voice note'}
        className='border-l-4 border-l-teal-400'
        disabled={isRecording || isPaused}
        onPress={handleSectionPress}
      >
        <VoiceNotesSectionHeader hasVoiceNotes={hasVoiceNotes} isPremium={isPremium} isRecording={isRecording} />
        {!isRecording && !isPaused && !hasVoiceNotes ? <Text className='text-sm text-stone-500'>Record your motivation for powerful recall</Text> : null}
        {(isRecording || isPaused) ? <View className='mt-2'>
            <WaveformVisualization isPaused={isPaused} isRecording={isRecording} meteringLevel={status.meteringLevel} reduceMotion={reduceMotion} />
          </View> : null}
        <CompletionCheckmark isVisible={hasVoiceNotes} reduceMotion={reduceMotion} sectionIndex={sectionIndex} shouldAnimate={shouldAnimate} />
        {showRecordingUI ? <View className='mt-4 border-t border-stone-100 pt-4'>
            <RecordingControls
              canAskAgain={status.canAskAgain} errorMessage={status.errorMessage} formattedDuration={formattedDuration}
              isApproachingMaxDuration={isApproachingMaxDuration} isMaxDurationReached={isMaxDurationReached} isPaused={isPaused}
              isRecording={isRecording} reduceMotion={reduceMotion} secondsUntilMaxDuration={secondsUntilMaxDuration} state={status.state}
              onCancelRecording={cancelRecording} onOpenSettings={openSettings} onPauseRecording={pauseRecording}
              onResumeRecording={resumeRecording} onStartRecording={handleStartRecording} onStopRecording={handleStopRecording}
            />
          </View> : null}
        {showInitialButton ? <RecordButton canRecord={canRecord} hasVoiceNotes={hasVoiceNotes} onStartRecording={handleStartRecording} /> : null}
        {!isRecording && !isPaused ? <VoiceNotesList reduceMotion={reduceMotion} voiceNotes={voiceNotes} onPlayFinish={onPlayFinish} onPlayStart={onPlayStart} onViewAllNotes={onViewAllNotes} /> : null}
      </SectionCard>
    </AnimatedSection>
  );
}

export default VoiceNotesSection;
