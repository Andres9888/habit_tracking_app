/**
 * RecordingControls - Recording state machine UI
 */
import React from 'react';
import { View, Text } from 'react-native';
import { RecordingState } from '../../../../../hooks/useAudioRecording';
import { MicrophonePermissionDenied } from '../../MicrophonePermissionDenied';
import { RecordingDurationDisplay } from './RecordingDurationDisplay';
import { RecordingButtonGroup } from './RecordingButtonGroup';
import { RecordingErrorState } from './RecordingErrorState';

interface RecordingControlsProps {
  state: RecordingState;
  isRecording: boolean;
  isPaused: boolean;
  formattedDuration: string;
  isMaxDurationReached: boolean;
  isApproachingMaxDuration: boolean;
  secondsUntilMaxDuration: number | null;
  canAskAgain: boolean;
  errorMessage: string | null;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onPauseRecording: () => void;
  onResumeRecording: () => void;
  onCancelRecording: () => void;
  onOpenSettings: () => void;
  reduceMotion?: boolean;
}

export function RecordingControls(props: RecordingControlsProps) {
  const { state, isRecording, isPaused, formattedDuration, isMaxDurationReached, isApproachingMaxDuration } = props;
  const { secondsUntilMaxDuration, canAskAgain, errorMessage, onStartRecording, onStopRecording } = props;
  const { onPauseRecording, onResumeRecording, onCancelRecording, onOpenSettings, reduceMotion } = props;

  if (state === 'preparing' || state === 'stopping') {
    return <View className='items-center py-4'><Text className='text-sm text-stone-500 dark:text-stone-400'>{state === 'preparing' ? 'Preparing...' : 'Saving...'}</Text></View>;
  }
  if (state === 'permission-denied') {
    return <MicrophonePermissionDenied compact canAskAgain={canAskAgain} errorMessage={errorMessage ?? undefined} reduceMotion={reduceMotion} onOpenSettings={onOpenSettings} onTryAgain={onStartRecording} />;
  }
  if (state === 'error') {
    return <RecordingErrorState errorMessage={errorMessage} onTryAgain={onStartRecording} />;
  }

  return (
    <View className='items-center gap-4'>
      {(isRecording || isPaused) && <RecordingDurationDisplay formattedDuration={formattedDuration} isApproachingMaxDuration={isApproachingMaxDuration} isMaxDurationReached={isMaxDurationReached} secondsUntilMaxDuration={secondsUntilMaxDuration} />}
      <RecordingButtonGroup isPaused={isPaused} isRecording={isRecording} onCancelRecording={onCancelRecording} onPauseRecording={onPauseRecording} onResumeRecording={onResumeRecording} onStartRecording={onStartRecording} onStopRecording={onStopRecording} />
      {!isRecording && !isPaused && <Text className='text-sm text-stone-500 dark:text-stone-400'>Tap to record a voice note</Text>}
    </View>
  );
}
