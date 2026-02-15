/**
 * FullPlayback Component
 * Full playback UI with header, progress bar, and time controls
 */

import React from 'react';
import { View } from 'react-native';

import { PlayPauseButton } from './PlayPauseButton';
import { PlaybackHeader } from './PlaybackHeader';
import { PlaybackSpeed } from '../../../../hooks/useAudioPlayback';
import { ProgressBar } from './ProgressBar';
import { TimeControls } from './TimeControls';

interface FullPlaybackProps {
  label?: string;
  isDay1: boolean;
  isPlaying: boolean;
  isLoading: boolean;
  isFinished: boolean;
  isReady: boolean;
  progress: number;
  formattedPosition: string;
  formattedRemaining: string;
  displayDuration: string;
  isMuted: boolean;
  currentSpeed: PlaybackSpeed;
  showMuteButton: boolean;
  showSpeedControl: boolean;
  reduceMotion: boolean;
  onPlayPause: () => void;
  onSeek: (progress: number) => void;
  onSpeedChange: (speed: PlaybackSpeed) => void;
  onToggleMute: () => void;
}

export function FullPlayback({
  label,
  isDay1,
  isPlaying,
  isLoading,
  isFinished,
  isReady,
  progress,
  formattedPosition,
  formattedRemaining,
  displayDuration,
  isMuted,
  currentSpeed,
  showMuteButton,
  showSpeedControl,
  reduceMotion,
  onPlayPause,
  onSeek,
  onSpeedChange,
  onToggleMute,
}: FullPlaybackProps) {
  return (
    <View className='rounded-xl bg-stone-50 p-4'>
      <PlaybackHeader isDay1={isDay1} label={label} />

      <View className='flex-row items-center gap-3'>
        <PlayPauseButton
          isFinished={isFinished}
          isLoading={isLoading}
          isPlaying={isPlaying}
          reduceMotion={reduceMotion}
          onPress={onPlayPause}
        />
        <View className='flex-1'>
          <ProgressBar
            isDisabled={!isReady}
            progress={progress}
            reduceMotion={reduceMotion}
            onSeek={onSeek}
          />
        </View>
      </View>

      <TimeControls
        currentSpeed={currentSpeed}
        displayDuration={displayDuration}
        formattedPosition={formattedPosition}
        formattedRemaining={formattedRemaining}
        isMuted={isMuted}
        isReady={isReady}
        showMuteButton={showMuteButton}
        showSpeedControl={showSpeedControl}
        onSpeedChange={onSpeedChange}
        onToggleMute={onToggleMute}
      />
    </View>
  );
}
