/**
 * useAudioPlayback Hook - Main orchestrator
 * Audio playback integration using expo-audio for Voice Notes feature.
 */

import { useEffect } from 'react';
import type { UseAudioPlaybackOptions, UseAudioPlaybackReturn } from './types';
import { usePlaybackHooks } from './usePlaybackHooks';
import { useAppStatePlayback } from './useAppStatePlayback';
import { buildPlaybackReturnValue } from './buildPlaybackReturnValue';

export function useAudioPlayback(
  options?: UseAudioPlaybackOptions
): UseAudioPlaybackReturn {
  const hooks = usePlaybackHooks(options);

  useAppStatePlayback(
    {
      currentState: hooks.status.state,
      handleInterruption: hooks.handleInterruption,
      previousAppStateRef: hooks.previousAppStateRef,
    },
    { onInterruptionEnded: options?.onInterruptionEnded }
  );

  useEffect(() => {
    const sound = hooks.soundRef.current;
    return () => {
      sound?.remove();
    };
  }, [hooks.soundRef]);

  return buildPlaybackReturnValue({
    loadAudio: hooks.loadAudio,
    pause: hooks.pause,
    play: hooks.play,
    replay: hooks.replay,
    resumeFromInterruption: hooks.resumeFromInterruption,
    seekBackward: hooks.seekBackward,
    seekForward: hooks.seekForward,
    seekToProgress: hooks.seekToProgress,
    seekToSeconds: hooks.seekToSeconds,
    setSpeed: hooks.setSpeed,
    status: hooks.status,
    toggleMute: hooks.toggleMute,
    togglePlayPause: hooks.togglePlayPause,
    unloadAudio: hooks.unloadAudio,
  });
}

export default useAudioPlayback;
