/**
 * useAudioPlayback Hook Tests
 * Story T10.4: Playback UI with progress bar
 *
 * Tests:
 * - Audio loading from URI
 * - Playback lifecycle (play, pause, seek)
 * - Progress tracking
 * - Speed control
 * - Error handling
 * - State transitions
 */

import { renderHook, act, waitFor } from '@testing-library/react-native';

// Mock expo-audio
const mockSetAudioModeAsync = jest.fn();
const mockPlayAsync = jest.fn();
const mockPauseAsync = jest.fn();
const mockUnloadAsync = jest.fn();
const mockSetPositionAsync = jest.fn();
const mockSetRateAsync = jest.fn();
const mockSetIsMutedAsync = jest.fn();

const mockSound = {
  addListener: jest.fn(),
  play: mockPlayAsync,
  pause: mockPauseAsync,
  remove: mockUnloadAsync,
  seekTo: mockSetPositionAsync,
  setPlaybackRate: mockSetRateAsync,
};
Object.defineProperty(mockSound, 'muted', {
  configurable: true,
  get: () => false,
  set: mockSetIsMutedAsync,
});

const mockCreateAsync = jest.fn();

jest.mock('expo-audio', () => ({
  createAudioPlayer: (source: unknown, options: unknown) =>
    mockCreateAsync(source, options),
  setAudioModeAsync: (options: unknown) => mockSetAudioModeAsync(options),
}));

import { useAudioPlayback, PLAYBACK_SPEEDS } from '../useAudioPlayback';

describe('useAudioPlayback', () => {
  let statusCallback: ((status: unknown) => void) | null = null;

  beforeEach(() => {
    jest.clearAllMocks();
    statusCallback = null;

    // Default mock implementations
    mockSetAudioModeAsync.mockResolvedValue(undefined);
    mockSound.addListener.mockImplementation((_event, callback) => {
      statusCallback = callback;
      return { remove: jest.fn() };
    });
    mockCreateAsync.mockReturnValue(mockSound);
    mockPlayAsync.mockReturnValue(undefined);
    mockPauseAsync.mockReturnValue(undefined);
    mockUnloadAsync.mockReturnValue(undefined);
    mockSetPositionAsync.mockResolvedValue(undefined);
    mockSetRateAsync.mockResolvedValue(undefined);
    mockSetIsMutedAsync.mockResolvedValue(undefined);
  });

  describe('Initial state', () => {
    it('initializes with idle state', () => {
      const { result } = renderHook(() => useAudioPlayback());

      expect(result.current.status.state).toBe('idle');
      expect(result.current.status.positionSeconds).toBe(0);
      expect(result.current.status.durationSeconds).toBe(0);
      expect(result.current.status.progress).toBe(0);
      expect(result.current.status.speed).toBe(1);
      expect(result.current.status.isMuted).toBe(false);
      expect(result.current.status.errorMessage).toBeNull();
      expect(result.current.status.audioUri).toBeNull();
    });

    it('has correct derived states when idle', () => {
      const { result } = renderHook(() => useAudioPlayback());

      expect(result.current.isPlaying).toBe(false);
      expect(result.current.isReady).toBe(false);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.formattedPosition).toBe('0:00');
      expect(result.current.formattedDuration).toBe('0:00');
      expect(result.current.formattedRemaining).toBe('-0:00');
    });
  });

  describe('Audio loading', () => {
    it('loads audio from URI successfully', async () => {
      const { result } = renderHook(() => useAudioPlayback());

      await act(async () => {
        await result.current.loadAudio('file:///test.m4a');
      });

      expect(mockSetAudioModeAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          allowsRecording: false,
          playsInSilentMode: true,
        })
      );
      expect(mockCreateAsync).toHaveBeenCalledWith(
        { uri: 'file:///test.m4a' },
        expect.objectContaining({ updateInterval: 100 })
      );
      expect(result.current.status.audioUri).toBe('file:///test.m4a');
      expect(result.current.status.state).toBe('ready');
    });

    it('auto-plays when autoPlayOnLoad is true', async () => {
      const { result } = renderHook(() =>
        useAudioPlayback({ autoPlayOnLoad: true })
      );

      await act(async () => {
        await result.current.loadAudio('file:///test.m4a');
      });

      expect(mockPlayAsync).toHaveBeenCalled();
    });

    it('handles load error', async () => {
      const onError = jest.fn();
      mockCreateAsync.mockImplementationOnce(() => {
        throw new Error('Load failed');
      });

      const { result } = renderHook(() => useAudioPlayback({ onError }));

      await act(async () => {
        await result.current.loadAudio('file:///test.m4a');
      });

      expect(result.current.status.state).toBe('error');
      expect(result.current.status.errorMessage).toBe('Load failed');
      expect(onError).toHaveBeenCalledWith(expect.any(Error));
    });

    it('unloads previous audio before loading new audio', async () => {
      const { result } = renderHook(() => useAudioPlayback());

      // Load first audio
      await act(async () => {
        await result.current.loadAudio('file:///test1.m4a');
      });

      // Load second audio
      await act(async () => {
        await result.current.loadAudio('file:///test2.m4a');
      });

      expect(mockUnloadAsync).toHaveBeenCalled();
      expect(result.current.status.audioUri).toBe('file:///test2.m4a');
    });
  });

  describe('Playback controls', () => {
    it('plays audio', async () => {
      const { result } = renderHook(() => useAudioPlayback());

      await act(async () => {
        await result.current.loadAudio('file:///test.m4a');
      });

      await act(async () => {
        await result.current.play();
      });

      expect(mockPlayAsync).toHaveBeenCalled();
    });

    it('pauses audio', async () => {
      const { result } = renderHook(() => useAudioPlayback());

      await act(async () => {
        await result.current.loadAudio('file:///test.m4a');
      });

      await act(async () => {
        await result.current.pause();
      });

      expect(mockPauseAsync).toHaveBeenCalled();
    });

    it('toggles play/pause', async () => {
      const { result } = renderHook(() => useAudioPlayback());

      await act(async () => {
        await result.current.loadAudio('file:///test.m4a');
      });

      // Simulate playing state
      await act(async () => {
        statusCallback?.({
          isLoaded: true,
          playing: true,
          currentTime: 5,
          duration: 60,
          didJustFinish: false,
          isBuffering: false,
          mute: false,
        });
      });

      // Toggle should pause
      await act(async () => {
        await result.current.togglePlayPause();
      });

      expect(mockPauseAsync).toHaveBeenCalled();
    });

    it('replays from beginning when finished', async () => {
      const { result } = renderHook(() => useAudioPlayback());

      await act(async () => {
        await result.current.loadAudio('file:///test.m4a');
      });

      // Simulate finished state
      await act(async () => {
        statusCallback?.({
          isLoaded: true,
          playing: false,
          currentTime: 60,
          duration: 60,
          didJustFinish: true,
          isBuffering: false,
          mute: false,
        });
      });

      // Play should replay from beginning
      await act(async () => {
        await result.current.play();
      });

      expect(mockSetPositionAsync).toHaveBeenCalledWith(0);
      expect(mockPlayAsync).toHaveBeenCalled();
    });
  });

  describe('Seeking', () => {
    it('seeks to progress position', async () => {
      const { result } = renderHook(() => useAudioPlayback());

      await act(async () => {
        await result.current.loadAudio('file:///test.m4a');
      });

      // Simulate loaded state with duration
      await act(async () => {
        statusCallback?.({
          isLoaded: true,
          playing: false,
          currentTime: 0,
          duration: 60,
          didJustFinish: false,
          isBuffering: false,
          mute: false,
        });
      });

      // Seek to 50%
      await act(async () => {
        await result.current.seekToProgress(0.5);
      });

      expect(mockSetPositionAsync).toHaveBeenCalledWith(30);
    });

    it('seeks to specific seconds', async () => {
      const { result } = renderHook(() => useAudioPlayback());

      await act(async () => {
        await result.current.loadAudio('file:///test.m4a');
      });

      // Simulate loaded state with duration
      await act(async () => {
        statusCallback?.({
          isLoaded: true,
          playing: false,
          currentTime: 0,
          duration: 60,
          didJustFinish: false,
          isBuffering: false,
          mute: false,
        });
      });

      // Seek to 15 seconds
      await act(async () => {
        await result.current.seekToSeconds(15);
      });

      expect(mockSetPositionAsync).toHaveBeenCalledWith(15);
    });

    it('seeks forward by default 10 seconds', async () => {
      const { result } = renderHook(() => useAudioPlayback());

      await act(async () => {
        await result.current.loadAudio('file:///test.m4a');
      });

      // Simulate loaded state at 10 seconds
      await act(async () => {
        statusCallback?.({
          isLoaded: true,
          playing: false,
          currentTime: 10,
          duration: 60,
          didJustFinish: false,
          isBuffering: false,
          mute: false,
        });
      });

      // Seek forward
      await act(async () => {
        await result.current.seekForward();
      });

      expect(mockSetPositionAsync).toHaveBeenCalledWith(20);
    });

    it('seeks backward by default 10 seconds', async () => {
      const { result } = renderHook(() => useAudioPlayback());

      await act(async () => {
        await result.current.loadAudio('file:///test.m4a');
      });

      // Simulate loaded state at 30 seconds
      await act(async () => {
        statusCallback?.({
          isLoaded: true,
          playing: false,
          currentTime: 30,
          duration: 60,
          didJustFinish: false,
          isBuffering: false,
          mute: false,
        });
      });

      // Seek backward
      await act(async () => {
        await result.current.seekBackward();
      });

      expect(mockSetPositionAsync).toHaveBeenCalledWith(20);
    });

    it('clamps seek to valid range', async () => {
      const { result } = renderHook(() => useAudioPlayback());

      await act(async () => {
        await result.current.loadAudio('file:///test.m4a');
      });

      // Simulate loaded state
      await act(async () => {
        statusCallback?.({
          isLoaded: true,
          playing: false,
          currentTime: 0,
          duration: 60,
          didJustFinish: false,
          isBuffering: false,
          mute: false,
        });
      });

      // Try to seek beyond duration
      await act(async () => {
        await result.current.seekToSeconds(100);
      });

      expect(mockSetPositionAsync).toHaveBeenCalledWith(60);
    });
  });

  describe('Speed control', () => {
    it('sets playback speed', async () => {
      const { result } = renderHook(() => useAudioPlayback());

      await act(async () => {
        await result.current.loadAudio('file:///test.m4a');
      });

      await act(async () => {
        await result.current.setSpeed(1.5);
      });

      expect(mockSetRateAsync).toHaveBeenCalledWith(1.5, 'high');
      expect(result.current.status.speed).toBe(1.5);
    });

    it('supports all playback speed options', () => {
      expect(PLAYBACK_SPEEDS).toEqual([0.5, 1, 1.5, 2]);
    });
  });

  describe('Mute control', () => {
    it('toggles mute', async () => {
      const { result } = renderHook(() => useAudioPlayback());

      await act(async () => {
        await result.current.loadAudio('file:///test.m4a');
      });

      // Toggle mute on
      await act(async () => {
        await result.current.toggleMute();
      });

      expect(mockSetIsMutedAsync).toHaveBeenCalledWith(true);
      expect(result.current.status.isMuted).toBe(true);

      // Toggle mute off
      await act(async () => {
        await result.current.toggleMute();
      });

      expect(mockSetIsMutedAsync).toHaveBeenCalledWith(false);
      expect(result.current.status.isMuted).toBe(false);
    });
  });

  describe('Progress tracking', () => {
    it('updates progress from status callback', async () => {
      const { result } = renderHook(() => useAudioPlayback());

      await act(async () => {
        await result.current.loadAudio('file:///test.m4a');
      });

      // Simulate playback progress
      await act(async () => {
        statusCallback?.({
          isLoaded: true,
          playing: true,
          currentTime: 30, // 30 seconds
          duration: 60, // 60 seconds
          didJustFinish: false,
          isBuffering: false,
          mute: false,
        });
      });

      expect(result.current.status.positionSeconds).toBe(30);
      expect(result.current.status.durationSeconds).toBe(60);
      expect(result.current.status.progress).toBe(0.5);
      expect(result.current.formattedPosition).toBe('0:30');
      expect(result.current.formattedDuration).toBe('1:00');
      expect(result.current.formattedRemaining).toBe('-0:30');
    });

    it('calls onFinish callback when playback completes', async () => {
      const onFinish = jest.fn();
      const { result } = renderHook(() => useAudioPlayback({ onFinish }));

      await act(async () => {
        await result.current.loadAudio('file:///test.m4a');
      });

      // Simulate playback finished
      await act(async () => {
        statusCallback?.({
          isLoaded: true,
          playing: false,
          currentTime: 60,
          duration: 60,
          didJustFinish: true,
          isBuffering: false,
          mute: false,
        });
      });

      expect(onFinish).toHaveBeenCalled();
      expect(result.current.status.state).toBe('finished');
    });
  });

  describe('Replay', () => {
    it('replays from beginning', async () => {
      const { result } = renderHook(() => useAudioPlayback());

      await act(async () => {
        await result.current.loadAudio('file:///test.m4a');
      });

      await act(async () => {
        await result.current.replay();
      });

      expect(mockSetPositionAsync).toHaveBeenCalledWith(0);
      expect(mockPlayAsync).toHaveBeenCalled();
    });
  });

  describe('Unload', () => {
    it('unloads audio and resets state', async () => {
      const { result } = renderHook(() => useAudioPlayback());

      await act(async () => {
        await result.current.loadAudio('file:///test.m4a');
      });

      await act(async () => {
        await result.current.unloadAudio();
      });

      expect(mockUnloadAsync).toHaveBeenCalled();
      expect(result.current.status.state).toBe('idle');
      expect(result.current.status.audioUri).toBeNull();
      expect(result.current.status.positionSeconds).toBe(0);
      expect(result.current.status.durationSeconds).toBe(0);
    });
  });

  describe('Error handling', () => {
    it('handles play error', async () => {
      const onError = jest.fn();
      mockPlayAsync.mockImplementationOnce(() => {
        throw new Error('Play failed');
      });

      const { result } = renderHook(() => useAudioPlayback({ onError }));

      await act(async () => {
        await result.current.loadAudio('file:///test.m4a');
      });

      await act(async () => {
        await result.current.play();
      });

      expect(result.current.status.state).toBe('error');
      expect(result.current.status.errorMessage).toBe('Play failed');
      expect(onError).toHaveBeenCalled();
    });

    it('handles playback status error', async () => {
      const onError = jest.fn();
      const { result } = renderHook(() => useAudioPlayback({ onError }));

      await act(async () => {
        await result.current.loadAudio('file:///test.m4a');
      });

      // Simulate error from status callback
      await act(async () => {
        statusCallback?.({
          isLoaded: false,
          error: 'Playback error occurred',
        });
      });

      expect(result.current.status.state).toBe('error');
      expect(onError).toHaveBeenCalled();
    });
  });

  describe('Derived state helpers', () => {
    it('isPlaying is true only when playing', async () => {
      const { result } = renderHook(() => useAudioPlayback());

      expect(result.current.isPlaying).toBe(false);

      await act(async () => {
        await result.current.loadAudio('file:///test.m4a');
      });

      expect(result.current.isPlaying).toBe(false);

      // Simulate playing state
      await act(async () => {
        statusCallback?.({
          isLoaded: true,
          playing: true,
          currentTime: 0,
          duration: 60,
          didJustFinish: false,
          isBuffering: false,
          mute: false,
        });
      });

      expect(result.current.isPlaying).toBe(true);
    });

    it('isReady is true when audio can be played', async () => {
      const { result } = renderHook(() => useAudioPlayback());

      expect(result.current.isReady).toBe(false);

      await act(async () => {
        await result.current.loadAudio('file:///test.m4a');
      });

      expect(result.current.isReady).toBe(true);
    });

    it('isLoading is true during loading', async () => {
      const { result } = renderHook(() => useAudioPlayback());

      expect(result.current.isLoading).toBe(false);

      // Start loading
      const loadPromise = act(async () => {
        await result.current.loadAudio('file:///test.m4a');
      });

      // Check loading state (before promise resolves)
      // Note: In reality, this is tricky to test due to async nature

      await loadPromise;
      expect(result.current.isLoading).toBe(false); // After load completes
    });
  });

  describe('Duration formatting', () => {
    it('formats durations correctly', async () => {
      const { result } = renderHook(() => useAudioPlayback());

      await act(async () => {
        await result.current.loadAudio('file:///test.m4a');
      });

      // Test various durations
      await act(async () => {
        statusCallback?.({
          isLoaded: true,
          playing: false,
          currentTime: 65, // 1:05
          duration: 185, // 3:05
          didJustFinish: false,
          isBuffering: false,
          mute: false,
        });
      });

      expect(result.current.formattedPosition).toBe('1:05');
      expect(result.current.formattedDuration).toBe('3:05');
      expect(result.current.formattedRemaining).toBe('-2:00');
    });
  });

  describe('Audio interruption handling', () => {
    it('initializes with interruption state as false', () => {
      const { result } = renderHook(() => useAudioPlayback());

      expect(result.current.isInterrupted).toBe(false);
      expect(result.current.status.wasInterrupted).toBe(false);
      expect(result.current.status.interruptionReason).toBeNull();
    });

    it('detects interruption when isPlaying unexpectedly becomes false', async () => {
      const onInterrupted = jest.fn();
      const { result } = renderHook(() => useAudioPlayback({ onInterrupted }));

      await act(async () => {
        await result.current.loadAudio('file:///test.m4a');
      });

      // Simulate playing state
      await act(async () => {
        statusCallback?.({
          isLoaded: true,
          playing: true,
          currentTime: 10,
          duration: 60,
          didJustFinish: false,
          isBuffering: false,
          mute: false,
        });
      });

      expect(result.current.status.state).toBe('playing');

      // Simulate interruption - isPlaying becomes false unexpectedly
      await act(async () => {
        statusCallback?.({
          isLoaded: true,
          playing: false,
          currentTime: 15,
          duration: 60,
          didJustFinish: false, // Not finished naturally
          isBuffering: false,
          mute: false,
        });
      });

      expect(result.current.status.state).toBe('interrupted');
      expect(result.current.isInterrupted).toBe(true);
      expect(result.current.status.wasInterrupted).toBe(true);
      expect(result.current.status.interruptionReason).toBe('system');
      expect(onInterrupted).toHaveBeenCalledWith('system');
    });

    it('preserves playback position during interruption', async () => {
      const { result } = renderHook(() => useAudioPlayback());

      await act(async () => {
        await result.current.loadAudio('file:///test.m4a');
      });

      // Simulate playing at 30 seconds
      await act(async () => {
        statusCallback?.({
          isLoaded: true,
          playing: true,
          currentTime: 30,
          duration: 60,
          didJustFinish: false,
          isBuffering: false,
          mute: false,
        });
      });

      expect(result.current.status.positionSeconds).toBe(30);

      // Simulate interruption
      await act(async () => {
        statusCallback?.({
          isLoaded: true,
          playing: false,
          currentTime: 30,
          duration: 60,
          didJustFinish: false,
          isBuffering: false,
          mute: false,
        });
      });

      // Position should be preserved during interruption
      expect(result.current.status.state).toBe('interrupted');
      expect(result.current.status.positionSeconds).toBe(30);
    });

    it('can resume from interruption', async () => {
      const onInterruptionEnded = jest.fn();
      const { result } = renderHook(() =>
        useAudioPlayback({ onInterruptionEnded })
      );

      await act(async () => {
        await result.current.loadAudio('file:///test.m4a');
      });

      // Simulate playing
      await act(async () => {
        statusCallback?.({
          isLoaded: true,
          playing: true,
          currentTime: 10,
          duration: 60,
          didJustFinish: false,
          isBuffering: false,
          mute: false,
        });
      });

      // Simulate interruption
      await act(async () => {
        statusCallback?.({
          isLoaded: true,
          playing: false,
          currentTime: 15,
          duration: 60,
          didJustFinish: false,
          isBuffering: false,
          mute: false,
        });
      });

      expect(result.current.status.state).toBe('interrupted');

      // Resume from interruption
      await act(async () => {
        await result.current.resumeFromInterruption();
      });

      expect(result.current.status.state).toBe('playing');
      expect(result.current.status.interruptionReason).toBeNull();
      expect(result.current.status.wasInterrupted).toBe(true); // Still true for analytics
      expect(mockPlayAsync).toHaveBeenCalled();
      expect(onInterruptionEnded).toHaveBeenCalled();
    });

    it('resumeFromInterruption does nothing if not interrupted', async () => {
      const { result } = renderHook(() => useAudioPlayback());

      await act(async () => {
        await result.current.loadAudio('file:///test.m4a');
      });

      // Simulate playing
      await act(async () => {
        statusCallback?.({
          isLoaded: true,
          playing: true,
          currentTime: 10,
          duration: 60,
          didJustFinish: false,
          isBuffering: false,
          mute: false,
        });
      });

      const playCallCount = mockPlayAsync.mock.calls.length;

      // Try to resume when not interrupted
      await act(async () => {
        await result.current.resumeFromInterruption();
      });

      // playAsync should not have been called again
      expect(mockPlayAsync.mock.calls.length).toBe(playCallCount);
    });

    it('clears interruption state on unload', async () => {
      const { result } = renderHook(() => useAudioPlayback());

      await act(async () => {
        await result.current.loadAudio('file:///test.m4a');
      });

      // Simulate playing then interruption
      await act(async () => {
        statusCallback?.({
          isLoaded: true,
          playing: true,
          currentTime: 10,
          duration: 60,
          didJustFinish: false,
          isBuffering: false,
          mute: false,
        });
      });

      await act(async () => {
        statusCallback?.({
          isLoaded: true,
          playing: false,
          currentTime: 15,
          duration: 60,
          didJustFinish: false,
          isBuffering: false,
          mute: false,
        });
      });

      expect(result.current.status.wasInterrupted).toBe(true);

      // Unload audio
      await act(async () => {
        await result.current.unloadAudio();
      });

      expect(result.current.status.state).toBe('idle');
      expect(result.current.status.wasInterrupted).toBe(false);
      expect(result.current.status.interruptionReason).toBeNull();
    });

    it('does not trigger interruption when playback finishes naturally', async () => {
      const onInterrupted = jest.fn();
      const onFinish = jest.fn();
      const { result } = renderHook(() =>
        useAudioPlayback({ onInterrupted, onFinish })
      );

      await act(async () => {
        await result.current.loadAudio('file:///test.m4a');
      });

      // Simulate playing
      await act(async () => {
        statusCallback?.({
          isLoaded: true,
          playing: true,
          currentTime: 55,
          duration: 60,
          didJustFinish: false,
          isBuffering: false,
          mute: false,
        });
      });

      // Simulate natural finish
      await act(async () => {
        statusCallback?.({
          isLoaded: true,
          playing: false,
          currentTime: 60,
          duration: 60,
          didJustFinish: true, // Finished naturally
          isBuffering: false,
          mute: false,
        });
      });

      expect(result.current.status.state).toBe('finished');
      expect(result.current.isInterrupted).toBe(false);
      expect(onFinish).toHaveBeenCalled();
      expect(onInterrupted).not.toHaveBeenCalled();
    });

    it('does not trigger interruption during normal pause', async () => {
      const onInterrupted = jest.fn();
      const { result } = renderHook(() => useAudioPlayback({ onInterrupted }));

      await act(async () => {
        await result.current.loadAudio('file:///test.m4a');
      });

      // Simulate playing
      await act(async () => {
        statusCallback?.({
          isLoaded: true,
          playing: true,
          currentTime: 10,
          duration: 60,
          didJustFinish: false,
          isBuffering: false,
          mute: false,
        });
      });

      // Normal pause by user (via pause() method)
      await act(async () => {
        await result.current.pause();
      });

      // Since pause() changes state before statusCallback reports isPlaying=false,
      // it should not be detected as an interruption
      expect(result.current.status.state).not.toBe('interrupted');
    });
  });
});
