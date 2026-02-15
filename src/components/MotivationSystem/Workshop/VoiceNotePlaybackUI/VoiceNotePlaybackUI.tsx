/**
 * VoiceNotePlaybackUI Component
 * Audio playback interface with progress bar for Voice Notes feature
 *
 * Part of the Motivation System Workshop tab
 * Story T10.4: Playback UI with progress bar
 */

import React from 'react';

import type { VoiceNotePlaybackUIProps } from './types';
import { CompactPlayback } from './CompactPlayback';
import { ErrorState } from './ErrorState';
import { FullPlayback } from './FullPlayback';
import { useVoiceNotePlayback } from './useVoiceNotePlayback';

export function VoiceNotePlaybackUI({
  audioUri,
  label,
  initialDuration = 0,
  isDay1 = false,
  onPlayStart,
  onPlayFinish,
  onError,
  reduceMotion = false,
  compact = false,
  showSpeedControl = true,
  showMuteButton = false,
}: VoiceNotePlaybackUIProps) {
  const playback = useVoiceNotePlayback({
    audioUri,
    initialDuration,
    onError,
    onPlayFinish,
    onPlayStart,
  });

  if (playback.hasError) {
    return (
      <ErrorState
        errorMessage={playback.status.errorMessage}
        onRetry={playback.handleRetry}
      />
    );
  }

  if (compact) {
    return (
      <CompactPlayback
        displayDuration={playback.displayDuration}
        formattedPosition={playback.formattedPosition}
        isFinished={playback.isFinished}
        isLoading={playback.isLoading}
        isPlaying={playback.isPlaying}
        isReady={playback.isReady}
        progress={playback.status.progress}
        reduceMotion={reduceMotion}
        onPlayPause={playback.handlePlayPausePress}
        onSeek={playback.handleSeek}
      />
    );
  }

  return (
    <FullPlayback
      currentSpeed={playback.status.speed}
      displayDuration={playback.displayDuration}
      formattedPosition={playback.formattedPosition}
      formattedRemaining={playback.formattedRemaining}
      isDay1={isDay1}
      isFinished={playback.isFinished}
      isLoading={playback.isLoading}
      isMuted={playback.status.isMuted}
      isPlaying={playback.isPlaying}
      isReady={playback.isReady}
      label={label}
      progress={playback.status.progress}
      reduceMotion={reduceMotion}
      showMuteButton={showMuteButton}
      showSpeedControl={showSpeedControl}
      onPlayPause={playback.handlePlayPausePress}
      onSeek={playback.handleSeek}
      onSpeedChange={playback.handleSpeedChange}
      onToggleMute={playback.toggleMute}
    />
  );
}

export default VoiceNotePlaybackUI;
