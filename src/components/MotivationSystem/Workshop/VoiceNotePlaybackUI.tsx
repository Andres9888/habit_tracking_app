/**
 * VoiceNotePlaybackUI Component
 * Audio playback interface with progress bar for Voice Notes feature
 *
 * Part of the Motivation System Workshop tab
 * Story T10.4: Playback UI with progress bar
 *
 * Features:
 * - Play/Pause toggle button
 * - Progress bar with seek functionality
 * - Current position and duration display
 * - Playback speed control (0.5x, 1x, 1.5x, 2x)
 * - Loading and error states
 * - Teal accent color (consistent with VoiceNotesSection)
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  GestureResponderEvent,
  LayoutChangeEvent,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
  Extrapolation,
  runOnJS,
} from 'react-native-reanimated';
import {
  Play,
  Pause,
  RotateCcw,
  AlertCircle,
  Volume2,
  VolumeX,
} from 'lucide-react-native';
import { clsx } from 'clsx';
import * as Haptics from 'expo-haptics';
import {
  useAudioPlayback,
  PlaybackSpeed,
  PLAYBACK_SPEEDS,
} from '../../../hooks/useAudioPlayback';

// Animation spring config
const SPRING_BUTTON = { damping: 15, stiffness: 300 };

export interface VoiceNotePlaybackUIProps {
  /** URI of the audio file to play */
  audioUri: string;
  /** Optional label for the voice note */
  label?: string;
  /** Duration in seconds (for initial display before loading) */
  initialDuration?: number;
  /** Whether this is the Day 1 recording */
  isDay1?: boolean;
  /** Callback when playback starts */
  onPlayStart?: () => void;
  /** Callback when playback finishes */
  onPlayFinish?: () => void;
  /** Callback when an error occurs */
  onError?: (error: Error) => void;
  /** Whether to reduce motion for accessibility */
  reduceMotion?: boolean;
  /** Whether to show compact mode (less UI elements) */
  compact?: boolean;
  /** Whether to show speed controls */
  showSpeedControl?: boolean;
  /** Whether to show mute button */
  showMuteButton?: boolean;
}

/**
 * PlayPauseButton Component
 * Animated play/pause toggle button
 */
function PlayPauseButton({
  isPlaying,
  isLoading,
  isFinished,
  onPress,
  reduceMotion = false,
}: {
  isPlaying: boolean;
  isLoading: boolean;
  isFinished: boolean;
  onPress: () => void;
  reduceMotion?: boolean;
}) {
  const scale = useSharedValue(1);

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    if (!reduceMotion) {
      scale.value = withSpring(0.9, SPRING_BUTTON);
    }
  }, [reduceMotion, scale]);

  const handlePressOut = useCallback(() => {
    if (!reduceMotion) {
      scale.value = withSpring(1, SPRING_BUTTON);
    }
  }, [reduceMotion, scale]);

  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  }, [onPress]);

  if (isLoading) {
    return (
      <View className='h-10 w-10 items-center justify-center rounded-full bg-teal-100'>
        <ActivityIndicator color='#14b8a6' size='small' />
      </View>
    );
  }

  return (
    <Animated.View style={buttonStyle}>
      <Pressable
        accessibilityLabel={
          isFinished ? 'Replay' : isPlaying ? 'Pause' : 'Play'
        }
        accessibilityRole='button'
        className='h-10 w-10 items-center justify-center rounded-full bg-teal-500'
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {isFinished ? (
          <RotateCcw className='text-white' size={18} />
        ) : isPlaying ? (
          <Pause className='text-white' fill='white' size={18} />
        ) : (
          <Play className='text-white' fill='white' size={18} />
        )}
      </Pressable>
    </Animated.View>
  );
}

/**
 * ProgressBar Component
 * Seekable progress bar with animated fill
 */
function ProgressBar({
  progress,
  onSeek,
  isDisabled = false,
  reduceMotion = false,
}: {
  progress: number;
  onSeek: (progress: number) => void;
  isDisabled?: boolean;
  reduceMotion?: boolean;
}) {
  const [barWidth, setBarWidth] = useState(0);
  const animatedProgress = useSharedValue(progress);
  const isDragging = useSharedValue(false);

  // Update animated progress when prop changes (unless dragging)
  useEffect(() => {
    if (!isDragging.value) {
      animatedProgress.value = reduceMotion
        ? progress
        : withTiming(progress, { duration: 100 });
    }
  }, [progress, reduceMotion, animatedProgress, isDragging]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${animatedProgress.value * 100}%`,
  }));

  const thumbStyle = useAnimatedStyle(() => ({
    left: `${animatedProgress.value * 100}%`,
    transform: [{ translateX: -6 }],
  }));

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    setBarWidth(event.nativeEvent.layout.width);
  }, []);

  const handleSeek = useCallback(
    (event: GestureResponderEvent) => {
      if (isDisabled || barWidth === 0) return;

      const { locationX } = event.nativeEvent;
      const newProgress = Math.max(0, Math.min(1, locationX / barWidth));

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      animatedProgress.value = newProgress;
      onSeek(newProgress);
    },
    [isDisabled, barWidth, onSeek, animatedProgress]
  );

  const handleTouchStart = useCallback(() => {
    isDragging.value = true;
  }, [isDragging]);

  const handleTouchEnd = useCallback(() => {
    isDragging.value = false;
  }, [isDragging]);

  return (
    <Pressable
      accessibilityLabel='Seek through audio'
      accessibilityRole='adjustable'
      className='relative h-6 justify-center'
      disabled={isDisabled}
      onLayout={handleLayout}
      onPress={handleSeek}
      onTouchEnd={handleTouchEnd}
      onTouchStart={handleTouchStart}
    >
      {/* Track background */}
      <View className='h-1 w-full rounded-full bg-stone-200' />

      {/* Progress fill */}
      <Animated.View
        className='absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-teal-500'
        style={progressStyle}
      />

      {/* Thumb indicator */}
      <Animated.View
        className='absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-teal-600 shadow-sm'
        style={thumbStyle}
      />
    </Pressable>
  );
}

/**
 * SpeedControl Component
 * Playback speed selector
 */
function SpeedControl({
  currentSpeed,
  onSpeedChange,
}: {
  currentSpeed: PlaybackSpeed;
  onSpeedChange: (speed: PlaybackSpeed) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSpeedPress = useCallback(
    (speed: PlaybackSpeed) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onSpeedChange(speed);
      setIsOpen(false);
    },
    [onSpeedChange]
  );

  const toggleOpen = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsOpen((prev) => !prev);
  }, []);

  return (
    <View className='relative'>
      <Pressable
        accessibilityLabel={`Playback speed: ${currentSpeed}x`}
        accessibilityRole='button'
        className='rounded-lg bg-stone-100 px-2 py-1'
        onPress={toggleOpen}
      >
        <Text className='text-xs font-medium text-stone-600'>
          {currentSpeed}x
        </Text>
      </Pressable>

      {isOpen && (
        <View className='absolute bottom-full right-0 mb-1 rounded-lg bg-white p-1 shadow-lg'>
          {PLAYBACK_SPEEDS.map((speed) => (
            <Pressable
              key={speed}
              accessibilityLabel={`Set speed to ${speed}x`}
              accessibilityRole='button'
              className={clsx(
                'rounded-md px-3 py-1.5',
                currentSpeed === speed ? 'bg-teal-100' : ''
              )}
              onPress={() => handleSpeedPress(speed)}
            >
              <Text
                className={clsx(
                  'text-sm font-medium',
                  currentSpeed === speed ? 'text-teal-700' : 'text-stone-600'
                )}
              >
                {speed}x
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

/**
 * VoiceNotePlaybackUI - Main component
 *
 * Displays audio playback interface with:
 * - Play/Pause button
 * - Progress bar with seek functionality
 * - Time display (current/total or current/remaining)
 * - Optional speed controls
 * - Loading and error states
 */
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
  const [hasStartedPlayback, setHasStartedPlayback] = useState(false);

  const {
    status,
    loadAudio,
    play,
    pause,
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
  } = useAudioPlayback({
    onError,
    onFinish: onPlayFinish,
  });

  // Load audio when component mounts or URI changes
  useEffect(() => {
    if (audioUri) {
      loadAudio(audioUri);
    }
  }, [audioUri, loadAudio]);

  // Track when playback starts
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

  const isFinished = status.state === 'finished';
  const hasError = status.state === 'error';
  const displayDuration =
    status.durationSeconds > 0
      ? formattedDuration
      : initialDuration > 0
        ? formatInitialDuration(initialDuration)
        : '0:00';

  // Error state
  if (hasError) {
    return (
      <View className='flex-row items-center gap-3 rounded-lg bg-rose-50 p-3'>
        <View className='h-10 w-10 items-center justify-center rounded-full bg-rose-100'>
          <AlertCircle className='text-rose-500' size={18} />
        </View>
        <View className='flex-1'>
          <Text className='text-sm font-medium text-rose-700'>
            Playback Error
          </Text>
          <Text className='text-xs text-rose-600'>
            {status.errorMessage || 'Unable to play audio'}
          </Text>
        </View>
        <Pressable
          accessibilityLabel='Retry playback'
          accessibilityRole='button'
          className='rounded-lg bg-rose-200 px-3 py-1.5'
          onPress={() => loadAudio(audioUri)}
        >
          <Text className='text-xs font-medium text-rose-700'>Retry</Text>
        </Pressable>
      </View>
    );
  }

  // Compact mode
  if (compact) {
    return (
      <View className='flex-row items-center gap-3'>
        <PlayPauseButton
          isFinished={isFinished}
          isLoading={isLoading}
          isPlaying={isPlaying}
          reduceMotion={reduceMotion}
          onPress={handlePlayPausePress}
        />

        <View className='flex-1'>
          <ProgressBar
            isDisabled={!isReady}
            progress={status.progress}
            reduceMotion={reduceMotion}
            onSeek={handleSeek}
          />
        </View>

        <Text className='min-w-[48px] text-right text-xs text-stone-500'>
          {isReady ? formattedPosition : '0:00'}/{displayDuration}
        </Text>
      </View>
    );
  }

  // Full mode
  return (
    <View className='rounded-xl bg-stone-50 p-4'>
      {/* Header with label */}
      {(label || isDay1) && (
        <View className='mb-3 flex-row items-center gap-2'>
          <Text
            className='flex-1 text-sm font-medium text-stone-700'
            numberOfLines={1}
          >
            {label || 'Voice Note'}
          </Text>
          {isDay1 && (
            <View className='rounded-full bg-amber-100 px-2 py-0.5'>
              <Text className='text-xs font-medium text-amber-700'>Day 1</Text>
            </View>
          )}
        </View>
      )}

      {/* Main playback row */}
      <View className='flex-row items-center gap-3'>
        <PlayPauseButton
          isFinished={isFinished}
          isLoading={isLoading}
          isPlaying={isPlaying}
          reduceMotion={reduceMotion}
          onPress={handlePlayPausePress}
        />

        <View className='flex-1'>
          <ProgressBar
            isDisabled={!isReady}
            progress={status.progress}
            reduceMotion={reduceMotion}
            onSeek={handleSeek}
          />
        </View>
      </View>

      {/* Time and controls row */}
      <View className='mt-2 flex-row items-center justify-between'>
        <Text className='text-xs text-stone-500'>
          {isReady ? formattedPosition : '0:00'}
        </Text>

        <View className='flex-row items-center gap-2'>
          {showMuteButton && isReady && (
            <Pressable
              accessibilityLabel={status.isMuted ? 'Unmute' : 'Mute'}
              accessibilityRole='button'
              className='rounded-lg bg-stone-100 p-1.5'
              onPress={toggleMute}
            >
              {status.isMuted ? (
                <VolumeX className='text-stone-500' size={14} />
              ) : (
                <Volume2 className='text-stone-500' size={14} />
              )}
            </Pressable>
          )}

          {showSpeedControl && isReady && (
            <SpeedControl
              currentSpeed={status.speed}
              onSpeedChange={handleSpeedChange}
            />
          )}
        </View>

        <Text className='text-xs text-stone-500'>
          {isReady ? formattedRemaining : `-${displayDuration}`}
        </Text>
      </View>
    </View>
  );
}

/**
 * Helper to format initial duration before audio is loaded
 */
function formatInitialDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default VoiceNotePlaybackUI;
