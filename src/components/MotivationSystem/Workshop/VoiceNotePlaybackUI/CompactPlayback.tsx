/**
 * CompactPlayback Component
 * Minimal playback UI with play/pause, progress bar, and time display
 */

import React from 'react';
import { View, Text } from 'react-native';

import { PlayPauseButton } from './PlayPauseButton';
import { ProgressBar } from './ProgressBar';

interface CompactPlaybackProps {
  isPlaying: boolean;
  isLoading: boolean;
  isFinished: boolean;
  isReady: boolean;
  progress: number;
  formattedPosition: string;
  displayDuration: string;
  reduceMotion: boolean;
  onPlayPause: () => void;
  onSeek: (progress: number) => void;
}

export function CompactPlayback({
  isPlaying,
  isLoading,
  isFinished,
  isReady,
  progress,
  formattedPosition,
  displayDuration,
  reduceMotion,
  onPlayPause,
  onSeek,
}: CompactPlaybackProps) {
  return (
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

      <Text className='min-w-[48px] text-right text-xs text-stone-500'>
        {isReady ? formattedPosition : '0:00'}/{displayDuration}
      </Text>
    </View>
  );
}
