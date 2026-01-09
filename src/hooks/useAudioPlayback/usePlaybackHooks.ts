/**
 * usePlaybackHooks - Composes all playback sub-hooks
 */

import type { UseAudioPlaybackOptions } from './types';
import { usePlaybackState } from './usePlaybackState';
import { useAudioMode } from './useAudioMode';
import { usePlaybackStatusHandler } from './usePlaybackStatusHandler';
import { useLoadAudio } from './useLoadAudio';
import { usePlaybackControls } from './usePlaybackControls';
import { useResumeFromInterruption } from './useResumeFromInterruption';
import { useSeekControls } from './useSeekControls';
import { useSpeedAndMute } from './useSpeedAndMute';

export function usePlaybackHooks(options?: UseAudioPlaybackOptions) {
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

  return {
    handleInterruption,
    loadAudio,
    pause,
    play,
    previousAppStateRef: state.previousAppStateRef,
    replay,
    resumeFromInterruption,
    seekBackward,
    seekForward,
    seekToProgress,
    seekToSeconds,
    setSpeed,
    soundRef: state.soundRef,
    status: state.status,
    toggleMute,
    togglePlayPause,
    unloadAudio,
  };
}
