/**
 * useAudioPlayback Hook - Main orchestrator
 * Audio playback integration using expo-av for Voice Notes feature.
 */

import { useEffect } from 'react';
import type { UseAudioPlaybackOptions, UseAudioPlaybackReturn } from './types';
import { usePlaybackHooks } from './usePlaybackHooks';
import { useAppStatePlayback } from './useAppStatePlayback';
import { buildPlaybackReturnValue } from './buildPlaybackReturnValue';

/**
 * Hook for audio playback with full control over media playback.
 * Orchestrates expo-av Audio.Sound with app state management and interruption handling.
 *
 * @description
 * Provides comprehensive audio playback features:
 * - Load/unload audio from URIs
 * - Play/pause/replay controls
 * - Seek to specific position or skip forward/backward
 * - Playback speed control (0.5x - 2.0x)
 * - Mute/unmute
 * - Automatic pause on app background
 * - Resume after interruptions (phone calls, Siri, etc.)
 *
 * @param options - Configuration options
 * @param options.uri - Audio file URI to load initially
 * @param options.autoPlay - Whether to start playing immediately after load (default: false)
 * @param options.onPlaybackEnd - Callback when audio finishes playing
 * @param options.onInterruptionEnded - Callback when audio interruption ends
 * @returns Object with playback controls and status
 *
 * @example
 * ```tsx
 * function VoiceNotePlayer({ audioUri }) {
 *   const {
 *     loadAudio,
 *     play,
 *     pause,
 *     status,
 *     seekToProgress,
 *     setSpeed
 *   } = useAudioPlayback({
 *     onPlaybackEnd: () => console.log('Finished playing')
 *   });
 *
 *   useEffect(() => {
 *     loadAudio(audioUri);
 *   }, [audioUri, loadAudio]);
 *
 *   return (
 *     <View>
 *       <Button onPress={status.isPlaying ? pause : play}>
 *         {status.isPlaying ? 'Pause' : 'Play'}
 *       </Button>
 *       <Slider
 *         value={status.progress}
 *         onValueChange={seekToProgress}
 *       />
 *       <Button onPress={() => setSpeed(1.5)}>1.5x</Button>
 *     </View>
 *   );
 * }
 * ```
 */
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
      sound?.unloadAsync().catch(() => {});
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
