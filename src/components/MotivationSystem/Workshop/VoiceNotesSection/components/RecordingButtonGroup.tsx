/**
 * RecordingButtonGroup - Layout for cancel, record, and stop buttons
 */

import React from 'react';
import { View } from 'react-native';

import { CancelButton } from './CancelButton';
import { MainRecordButton } from './MainRecordButton';
import { StopButton } from './StopButton';

interface RecordingButtonGroupProps {
  isRecording: boolean;
  isPaused: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onPauseRecording: () => void;
  onResumeRecording: () => void;
  onCancelRecording: () => void;
}

export function RecordingButtonGroup({
  isRecording, isPaused, onStartRecording, onStopRecording, onPauseRecording, onResumeRecording, onCancelRecording,
}: RecordingButtonGroupProps) {
  return (
    <View className='flex-row items-center gap-6'>
      {(isRecording || isPaused) && <CancelButton onCancelRecording={onCancelRecording} />}
      <MainRecordButton
        isPaused={isPaused}
        isRecording={isRecording}
        onPauseRecording={onPauseRecording}
        onResumeRecording={onResumeRecording}
        onStartRecording={onStartRecording}
      />
      {(isRecording || isPaused) && <StopButton onStopRecording={onStopRecording} />}
    </View>
  );
}
