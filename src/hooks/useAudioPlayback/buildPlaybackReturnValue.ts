/**
 * buildPlaybackReturnValue - Assembles the return value for useAudioPlayback
 */

import type {
  PlaybackSpeed,
  PlaybackStatus,
  UseAudioPlaybackReturn,
} from './types';
import { formatDuration } from './formatUtils';

interface BuildPlaybackReturnValueParams {
  status: PlaybackStatus;
  loadAudio: (uri: string) => Promise<void>;
  unloadAudio: () => Promise<void>;
  play: () => Promise<void>;
  pause: () => Promise<void>;
  togglePlayPause: () => Promise<void>;
  replay: () => Promise<void>;
  resumeFromInterruption: () => Promise<void>;
  seekBackward: (seconds?: number) => Promise<void>;
  seekForward: (seconds?: number) => Promise<void>;
  seekToProgress: (progress: number) => Promise<void>;
  seekToSeconds: (seconds: number) => Promise<void>;
  setSpeed: (speed: PlaybackSpeed) => Promise<void>;
  toggleMute: () => Promise<void>;
}

export function buildPlaybackReturnValue(
  params: BuildPlaybackReturnValueParams
): UseAudioPlaybackReturn {
  const { status } = params;
  const remainingSeconds = status.durationSeconds - status.positionSeconds;

  return {
    formattedDuration: formatDuration(status.durationSeconds),
    formattedPosition: formatDuration(status.positionSeconds),
    formattedRemaining: `-${formatDuration(Math.max(0, remainingSeconds))}`,
    isInterrupted: status.state === 'interrupted',
    isLoading: status.state === 'loading',
    isPlaying: status.state === 'playing',
    isReady: ['ready', 'playing', 'paused', 'finished'].includes(status.state),
    loadAudio: params.loadAudio,
    pause: params.pause,
    play: params.play,
    replay: params.replay,
    resumeFromInterruption: params.resumeFromInterruption,
    seekBackward: params.seekBackward,
    seekForward: params.seekForward,
    seekToProgress: params.seekToProgress,
    seekToSeconds: params.seekToSeconds,
    setSpeed: params.setSpeed,
    status,
    toggleMute: params.toggleMute,
    togglePlayPause: params.togglePlayPause,
    unloadAudio: params.unloadAudio,
  };
}
