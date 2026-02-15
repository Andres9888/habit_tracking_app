/**
 * useVoiceNotePlayback Hook
 * Manages audio playback state and handlers for VoiceNotePlaybackUI
 */

import { useCallback, useEffect, useState } from 'react';

import {
  useAudioPlayback,
  PlaybackSpeed,
} from '../../../../hooks/useAudioPlayback';
import { formatInitialDuration } from './utils';

interface UseVoiceNotePlaybackOptions {
  audioUri: string;
  initialDuration?: number;
  onPlayStart?: () => void;
  onPlayFinish?: () => void;
  onError?: (error: Error) => void;
}

export function useVoiceNotePlayback({
  audioUri,
  initialDuration = 0,
  onPlayStart,
  onPlayFinish,
  onError,
}: UseVoiceNotePlaybackOptions) {
  const [hasStartedPlayback, setHasStartedPlayback] = useState(false);

  const audioPlayback = useAudioPlayback({
    onError,
    onFinish: onPlayFinish,
  });

  const {
    status,
    loadAudio,
    togglePlayPause,
    seekToProgress,
    setSpeed,
    toggleMute,
    replay,
    isPlaying,
    isReady,
    isLoading,
    formattedPosition,
    formattedDuration,
    formattedRemaining,
  } = audioPlayback;

  useEffect(() => {
    if (audioUri) {
      loadAudio(audioUri);
    }
  }, [audioUri, loadAudio]);

  useEffect(() => {
    if (isPlaying && !hasStartedPlayback) {
      setHasStartedPlayback(true);
      onPlayStart?.();
    }
  }, [isPlaying, hasStartedPlayback, onPlayStart]);

  const handlePlayPausePress = useCallback(async () => {
    await (status.state === 'finished' ? replay() : togglePlayPause());
  }, [status.state, replay, togglePlayPause]);

  const handleSeek = useCallback(
    async (progress: number) => {
      await seekToProgress(progress);
    },
    [seekToProgress]
  );

  const handleSpeedChange = useCallback(
    async (speed: PlaybackSpeed) => {
      await setSpeed(speed);
    },
    [setSpeed]
  );

  const handleRetry = useCallback(() => {
    loadAudio(audioUri);
  }, [loadAudio, audioUri]);

  const isFinished = status.state === 'finished';
  const hasError = status.state === 'error';
  const displayDuration =
    status.durationSeconds > 0
      ? formattedDuration
      : initialDuration > 0
        ? formatInitialDuration(initialDuration)
        : '0:00';

  return {
    displayDuration,
    formattedPosition,
    formattedRemaining,
    handlePlayPausePress,
    handleRetry,
    handleSeek,
    handleSpeedChange,
    hasError,
    isFinished,
    isLoading,
    isPlaying,
    isReady,
    status,
    toggleMute,
  };
}
