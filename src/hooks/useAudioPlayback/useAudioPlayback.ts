/**
 * useAudioPlayback Hook - Main orchestrator
 *
 * Audio playback integration using expo-av for Voice Notes feature.
 * Story T10.4: Playback UI with progress bar
 */

import { useEffect } from 'react';
import type { UseAudioPlaybackOptions, UseAudioPlaybackReturn } from './types';
import { formatDuration } from './formatUtils';
import { usePlaybackState } from './usePlaybackState';
import { useAudioMode } from './useAudioMode';
import { usePlaybackStatusHandler } from './usePlaybackStatusHandler';
import { useLoadAudio } from './useLoadAudio';
import { usePlaybackControls } from './usePlaybackControls';
import { useResumeFromInterruption } from './useResumeFromInterruption';
import { useSeekControls } from './useSeekControls';
import { useSpeedAndMute } from './useSpeedAndMute';
import { useAppStatePlayback } from './useAppStatePlayback';

export function useAudioPlayback(
  options?: UseAudioPlaybackOptions
): UseAudioPlaybackReturn {
  const opts = options || {};
  const state = usePlaybackState();
  const { configureAudioMode } = useAudioMode();

  const { onPlaybackStatusUpdate, handleInterruption } =
    usePlaybackStatusHandler(
      {
        currentState: state.status.state,
        setStatus: state.setStatus,
        wasPlayingBeforeInterruptionRef: state.wasPlayingBeforeInterruptionRef,
      },
      {
        onError: opts.onError,
        onFinish: opts.onFinish,
        onInterrupted: opts.onInterrupted,
      }
    );

  const { loadAudio, unloadAudio } = useLoadAudio(
    {
      configureAudioMode,
      onPlaybackStatusUpdate,
      setStatus: state.setStatus,
      soundRef: state.soundRef,
      wasPlayingBeforeInterruptionRef: state.wasPlayingBeforeInterruptionRef,
    },
    { autoPlayOnLoad: opts.autoPlayOnLoad ?? false, onError: opts.onError }
  );

  const { play, pause, togglePlayPause, replay } = usePlaybackControls(
    {
      currentState: state.status.state,
      setStatus: state.setStatus,
      soundRef: state.soundRef,
    },
    { onError: opts.onError }
  );

  const { resumeFromInterruption } = useResumeFromInterruption(
    {
      configureAudioMode,
      currentState: state.status.state,
      setStatus: state.setStatus,
      soundRef: state.soundRef,
      wasPlayingBeforeInterruptionRef: state.wasPlayingBeforeInterruptionRef,
    },
    { onError: opts.onError, onInterruptionEnded: opts.onInterruptionEnded }
  );

  const { seekBackward, seekForward, seekToProgress, seekToSeconds } =
    useSeekControls(
      {
        durationSeconds: state.status.durationSeconds,
        positionSeconds: state.status.positionSeconds,
        setStatus: state.setStatus,
        soundRef: state.soundRef,
      },
      { onError: opts.onError }
    );

  const { setSpeed, toggleMute } = useSpeedAndMute(
    {
      isMuted: state.status.isMuted,
      setStatus: state.setStatus,
      soundRef: state.soundRef,
    },
    { onError: opts.onError }
  );

  useAppStatePlayback(
    {
      currentState: state.status.state,
      handleInterruption,
      previousAppStateRef: state.previousAppStateRef,
    },
    { onInterruptionEnded: opts.onInterruptionEnded }
  );

  useEffect(() => {
    const sound = state.soundRef.current;
    return () => {
      sound?.unloadAsync().catch(() => {});
    };
  }, [state.soundRef]);

  const remainingSeconds =
    state.status.durationSeconds - state.status.positionSeconds;

  return {
    formattedDuration: formatDuration(state.status.durationSeconds),
    formattedPosition: formatDuration(state.status.positionSeconds),
    formattedRemaining: `-${formatDuration(Math.max(0, remainingSeconds))}`,
    isInterrupted: state.status.state === 'interrupted',
    isLoading: state.status.state === 'loading',
    isPlaying: state.status.state === 'playing',
    isReady: ['ready', 'playing', 'paused', 'finished'].includes(
      state.status.state
    ),
    loadAudio,
    pause,
    play,
    replay,
    resumeFromInterruption,
    seekBackward,
    seekForward,
    seekToProgress,
    seekToSeconds,
    setSpeed,
    status: state.status,
    toggleMute,
    togglePlayPause,
    unloadAudio,
  };
}

export default useAudioPlayback;
