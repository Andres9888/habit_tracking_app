/**
 * useAudioRecording Hook Tests
 * Story T10.2: Audio recording integration (expo-av)
 *
 * Tests:
 * - Permission handling (including graceful denial handling)
 * - Recording lifecycle (start, stop, pause, resume)
 * - Duration tracking
 * - Error handling
 * - Max duration enforcement
 * - State transitions
 * - Open settings functionality
 */

import { renderHook, act, waitFor } from '@testing-library/react-native';
import { Alert, Linking, Platform } from 'react-native';

// Mock expo-av
const mockRequestPermissionsAsync = jest.fn();
const mockSetAudioModeAsync = jest.fn();
const mockStopAndUnloadAsync = jest.fn();
const mockPauseAsync = jest.fn();
const mockStartAsync = jest.fn();
const mockGetURI = jest.fn();

const mockRecording = {
  stopAndUnloadAsync: mockStopAndUnloadAsync,
  pauseAsync: mockPauseAsync,
  startAsync: mockStartAsync,
  getURI: mockGetURI,
};

const mockCreateAsync = jest.fn();

jest.mock('expo-av', () => ({
  Audio: {
    requestPermissionsAsync: () => mockRequestPermissionsAsync(),
    setAudioModeAsync: (options: any) => mockSetAudioModeAsync(options),
    Recording: {
      createAsync: (options: any, callback: any, interval: any) =>
        mockCreateAsync(options, callback, interval),
    },
    AndroidOutputFormat: {
      MPEG_4: 'MPEG_4',
    },
    AndroidAudioEncoder: {
      AAC: 'AAC',
    },
    IOSOutputFormat: {
      MPEG4AAC: 'MPEG4AAC',
    },
    IOSAudioQuality: {
      HIGH: 'HIGH',
    },
  },
}));

// Mock Linking
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return {
    ...RN,
    Linking: {
      openURL: jest.fn(),
      openSettings: jest.fn(),
    },
    Alert: {
      alert: jest.fn(),
    },
    Platform: {
      OS: 'ios',
    },
  };
});

import { useAudioRecording } from '../useAudioRecording';

describe('useAudioRecording', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock implementations
    mockRequestPermissionsAsync.mockResolvedValue({ granted: true });
    mockSetAudioModeAsync.mockResolvedValue(undefined);
    mockCreateAsync.mockResolvedValue({ recording: mockRecording });
    mockStopAndUnloadAsync.mockResolvedValue(undefined);
    mockPauseAsync.mockResolvedValue(undefined);
    mockStartAsync.mockResolvedValue(undefined);
    mockGetURI.mockReturnValue('file:///recording.m4a');
  });

  describe('Initial state', () => {
    it('initializes with idle state', () => {
      const { result } = renderHook(() => useAudioRecording());

      expect(result.current.status.state).toBe('idle');
      expect(result.current.status.durationSeconds).toBe(0);
      expect(result.current.status.meteringLevel).toBe(0);
      expect(result.current.status.hasPermission).toBeNull();
      expect(result.current.status.canAskAgain).toBe(true);
      expect(result.current.status.errorMessage).toBeNull();
      expect(result.current.status.recordingUri).toBeNull();
    });

    it('has correct derived states when idle', () => {
      const { result } = renderHook(() => useAudioRecording());

      expect(result.current.isRecording).toBe(false);
      expect(result.current.isPaused).toBe(false);
      expect(result.current.canStartRecording).toBe(true);
      expect(result.current.formattedDuration).toBe('00:00');
      expect(result.current.isMaxDurationReached).toBe(false);
    });

    it('exports openSettings and showPermissionAlert functions', () => {
      const { result } = renderHook(() => useAudioRecording());

      expect(typeof result.current.openSettings).toBe('function');
      expect(typeof result.current.showPermissionAlert).toBe('function');
    });
  });

  describe('Permission handling', () => {
    it('requests permission and updates state when granted', async () => {
      mockRequestPermissionsAsync.mockResolvedValue({
        granted: true,
        canAskAgain: true,
      });

      const { result } = renderHook(() => useAudioRecording());

      let permissionGranted: boolean | undefined;
      await act(async () => {
        permissionGranted = await result.current.requestPermission();
      });

      expect(permissionGranted).toBe(true);
      expect(result.current.status.hasPermission).toBe(true);
      expect(result.current.status.canAskAgain).toBe(true);
      expect(result.current.status.state).toBe('idle');
    });

    it('updates state when permission is denied with canAskAgain=true', async () => {
      mockRequestPermissionsAsync.mockResolvedValue({
        granted: false,
        canAskAgain: true,
      });

      const { result } = renderHook(() => useAudioRecording());

      let permissionGranted: boolean | undefined;
      await act(async () => {
        permissionGranted = await result.current.requestPermission();
      });

      expect(permissionGranted).toBe(false);
      expect(result.current.status.hasPermission).toBe(false);
      expect(result.current.status.canAskAgain).toBe(true);
      expect(result.current.status.state).toBe('permission-denied');
      expect(result.current.status.errorMessage).toBe(
        'Microphone permission denied. Please try again.'
      );
    });

    it('updates state when permission is permanently denied (canAskAgain=false)', async () => {
      mockRequestPermissionsAsync.mockResolvedValue({
        granted: false,
        canAskAgain: false,
      });

      const { result } = renderHook(() => useAudioRecording());

      let permissionGranted: boolean | undefined;
      await act(async () => {
        permissionGranted = await result.current.requestPermission();
      });

      expect(permissionGranted).toBe(false);
      expect(result.current.status.hasPermission).toBe(false);
      expect(result.current.status.canAskAgain).toBe(false);
      expect(result.current.status.state).toBe('permission-denied');
      expect(result.current.status.errorMessage).toBe(
        'Microphone permission denied. Please enable it in Settings.'
      );
    });

    it('calls onPermissionDenied callback with canAskAgain value', async () => {
      const onPermissionDenied = jest.fn();
      mockRequestPermissionsAsync.mockResolvedValue({
        granted: false,
        canAskAgain: false,
      });

      const { result } = renderHook(() =>
        useAudioRecording({ onPermissionDenied })
      );

      await act(async () => {
        await result.current.requestPermission();
      });

      expect(onPermissionDenied).toHaveBeenCalledWith(false);
    });

    it('does not call onPermissionDenied when permission is granted', async () => {
      const onPermissionDenied = jest.fn();
      mockRequestPermissionsAsync.mockResolvedValue({
        granted: true,
        canAskAgain: true,
      });

      const { result } = renderHook(() =>
        useAudioRecording({ onPermissionDenied })
      );

      await act(async () => {
        await result.current.requestPermission();
      });

      expect(onPermissionDenied).not.toHaveBeenCalled();
    });

    it('handles permission request error', async () => {
      const onError = jest.fn();
      mockRequestPermissionsAsync.mockRejectedValue(
        new Error('Permission error')
      );

      const { result } = renderHook(() => useAudioRecording({ onError }));

      await act(async () => {
        await result.current.requestPermission();
      });

      expect(result.current.status.state).toBe('error');
      expect(result.current.status.hasPermission).toBe(false);
      expect(result.current.status.canAskAgain).toBe(true);
      expect(onError).toHaveBeenCalledWith(expect.any(Error));
    });

    it('defaults canAskAgain to true when not provided in response', async () => {
      mockRequestPermissionsAsync.mockResolvedValue({ granted: false });

      const { result } = renderHook(() => useAudioRecording());

      await act(async () => {
        await result.current.requestPermission();
      });

      expect(result.current.status.canAskAgain).toBe(true);
    });
  });

  describe('Open Settings functionality', () => {
    beforeEach(() => {
      (Linking.openURL as jest.Mock).mockClear();
      (Linking.openSettings as jest.Mock).mockClear();
      (Alert.alert as jest.Mock).mockClear();
    });

    it('openSettings opens app-settings URL on iOS', () => {
      // Platform is mocked as iOS in the mock setup
      const { result } = renderHook(() => useAudioRecording());

      act(() => {
        result.current.openSettings();
      });

      expect(Linking.openURL).toHaveBeenCalledWith('app-settings:');
    });

    it('openSettings calls onOpenSettings callback', () => {
      const onOpenSettings = jest.fn();
      const { result } = renderHook(() =>
        useAudioRecording({ onOpenSettings })
      );

      act(() => {
        result.current.openSettings();
      });

      expect(onOpenSettings).toHaveBeenCalledTimes(1);
    });

    it('showPermissionAlert displays an alert with Open Settings option', () => {
      const { result } = renderHook(() => useAudioRecording());

      act(() => {
        result.current.showPermissionAlert();
      });

      expect(Alert.alert).toHaveBeenCalledWith(
        'Microphone Access Required',
        'To record voice notes, please allow microphone access in your device Settings.',
        expect.arrayContaining([
          expect.objectContaining({ text: 'Cancel' }),
          expect.objectContaining({ text: 'Open Settings' }),
        ])
      );
    });
  });

  describe('Recording lifecycle', () => {
    it('starts recording successfully', async () => {
      const { result } = renderHook(() => useAudioRecording());

      await act(async () => {
        await result.current.startRecording();
      });

      expect(mockRequestPermissionsAsync).toHaveBeenCalled();
      expect(mockSetAudioModeAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          allowsRecordingIOS: true,
        })
      );
      expect(mockCreateAsync).toHaveBeenCalled();
      expect(result.current.status.state).toBe('recording');
      expect(result.current.isRecording).toBe(true);
    });

    it('does not start recording when permission is denied', async () => {
      mockRequestPermissionsAsync.mockResolvedValue({ granted: false });

      const { result } = renderHook(() => useAudioRecording());

      await act(async () => {
        await result.current.startRecording();
      });

      expect(result.current.status.state).toBe('permission-denied');
      expect(result.current.isRecording).toBe(false);
      expect(mockCreateAsync).not.toHaveBeenCalled();
    });

    it('stops recording and returns URI', async () => {
      const onRecordingComplete = jest.fn();
      const { result } = renderHook(() =>
        useAudioRecording({ onRecordingComplete })
      );

      // Start recording first
      await act(async () => {
        await result.current.startRecording();
      });

      // Stop recording
      let uri: string | null = null;
      await act(async () => {
        uri = await result.current.stopRecording();
      });

      expect(uri).toBe('file:///recording.m4a');
      expect(mockStopAndUnloadAsync).toHaveBeenCalled();
      expect(result.current.status.state).toBe('stopped');
      expect(result.current.status.recordingUri).toBe('file:///recording.m4a');
      expect(onRecordingComplete).toHaveBeenCalledWith(
        'file:///recording.m4a',
        expect.any(Number)
      );
    });

    it('pauses recording', async () => {
      const { result } = renderHook(() => useAudioRecording());

      // Start recording
      await act(async () => {
        await result.current.startRecording();
      });

      // Pause recording
      await act(async () => {
        await result.current.pauseRecording();
      });

      expect(mockPauseAsync).toHaveBeenCalled();
      expect(result.current.status.state).toBe('paused');
      expect(result.current.isPaused).toBe(true);
    });

    it('resumes paused recording', async () => {
      const { result } = renderHook(() => useAudioRecording());

      // Start and pause
      await act(async () => {
        await result.current.startRecording();
      });
      await act(async () => {
        await result.current.pauseRecording();
      });

      // Resume
      await act(async () => {
        await result.current.resumeRecording();
      });

      expect(mockStartAsync).toHaveBeenCalled();
      expect(result.current.status.state).toBe('recording');
      expect(result.current.isRecording).toBe(true);
    });

    it('cancels recording without saving', async () => {
      const { result } = renderHook(() => useAudioRecording());

      // Start recording
      await act(async () => {
        await result.current.startRecording();
      });

      // Cancel recording
      await act(async () => {
        await result.current.cancelRecording();
      });

      expect(mockStopAndUnloadAsync).toHaveBeenCalled();
      expect(result.current.status.state).toBe('idle');
      expect(result.current.status.recordingUri).toBeNull();
      expect(result.current.status.durationSeconds).toBe(0);
    });
  });

  describe('Duration tracking', () => {
    it('formats duration correctly', () => {
      const { result } = renderHook(() => useAudioRecording());

      // Initial state
      expect(result.current.formattedDuration).toBe('00:00');
    });

    it('tracks max duration reached', async () => {
      const onMaxDurationReached = jest.fn();
      const { result } = renderHook(() =>
        useAudioRecording({
          maxDurationSeconds: 10,
          onMaxDurationReached,
        })
      );

      // Start recording
      await act(async () => {
        await result.current.startRecording();
      });

      // Simulate recording status update with max duration
      const statusCallback = mockCreateAsync.mock.calls[0][1];

      await act(async () => {
        statusCallback({
          isRecording: true,
          durationMillis: 10000, // 10 seconds
          metering: -30,
        });
      });

      expect(onMaxDurationReached).toHaveBeenCalled();
      expect(result.current.isMaxDurationReached).toBe(true);
    });
  });

  describe('Error handling', () => {
    it('handles recording start error', async () => {
      const onError = jest.fn();
      mockCreateAsync.mockRejectedValue(new Error('Recording failed'));

      const { result } = renderHook(() => useAudioRecording({ onError }));

      await act(async () => {
        await result.current.startRecording();
      });

      expect(result.current.status.state).toBe('error');
      expect(result.current.status.errorMessage).toBe('Recording failed');
      expect(onError).toHaveBeenCalledWith(expect.any(Error));
    });

    it('handles recording stop error', async () => {
      const onError = jest.fn();
      mockStopAndUnloadAsync.mockRejectedValue(new Error('Stop failed'));

      const { result } = renderHook(() => useAudioRecording({ onError }));

      // Start recording
      await act(async () => {
        await result.current.startRecording();
      });

      // Stop with error
      await act(async () => {
        await result.current.stopRecording();
      });

      expect(result.current.status.state).toBe('error');
      expect(onError).toHaveBeenCalled();
    });
  });

  describe('State reset', () => {
    it('resets state to idle', async () => {
      const { result } = renderHook(() => useAudioRecording());

      // Start and stop recording
      await act(async () => {
        await result.current.startRecording();
      });
      await act(async () => {
        await result.current.stopRecording();
      });

      // Reset
      act(() => {
        result.current.reset();
      });

      expect(result.current.status.state).toBe('idle');
      expect(result.current.status.durationSeconds).toBe(0);
      expect(result.current.status.recordingUri).toBeNull();
      expect(result.current.canStartRecording).toBe(true);
    });

    it('preserves permission status on reset', async () => {
      const { result } = renderHook(() => useAudioRecording());

      // Request permission
      await act(async () => {
        await result.current.requestPermission();
      });

      // Reset
      act(() => {
        result.current.reset();
      });

      expect(result.current.status.hasPermission).toBe(true);
    });
  });

  describe('Metering level normalization', () => {
    it('normalizes metering levels to 0-1 range', async () => {
      const { result } = renderHook(() => useAudioRecording());

      await act(async () => {
        await result.current.startRecording();
      });

      const statusCallback = mockCreateAsync.mock.calls[0][1];

      // Test various metering levels
      await act(async () => {
        statusCallback({
          isRecording: true,
          durationMillis: 1000,
          metering: -160, // Silence
        });
      });
      expect(result.current.status.meteringLevel).toBe(0);

      await act(async () => {
        statusCallback({
          isRecording: true,
          durationMillis: 2000,
          metering: 0, // Max volume
        });
      });
      expect(result.current.status.meteringLevel).toBe(1);

      await act(async () => {
        statusCallback({
          isRecording: true,
          durationMillis: 3000,
          metering: -80, // Mid-range
        });
      });
      expect(result.current.status.meteringLevel).toBe(0.5);
    });
  });

  describe('Derived state helpers', () => {
    it('canStartRecording is true only in idle/stopped states', async () => {
      const { result } = renderHook(() => useAudioRecording());

      // Initially true (idle)
      expect(result.current.canStartRecording).toBe(true);

      // False while recording
      await act(async () => {
        await result.current.startRecording();
      });
      expect(result.current.canStartRecording).toBe(false);

      // False while paused
      await act(async () => {
        await result.current.pauseRecording();
      });
      expect(result.current.canStartRecording).toBe(false);

      // True after stopped
      await act(async () => {
        await result.current.stopRecording();
      });
      expect(result.current.canStartRecording).toBe(true);
    });
  });
});
