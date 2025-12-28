/**
 * VoiceNotesSection Component
 * Audio recording interface for Voice Notes feature
 *
 * Part of the Motivation System Workshop tab
 * Story T10.2-T10.8: Voice Notes recording and playback
 *
 * Scientific Basis:
 * - Voice has 40% higher emotional recall than text (cognitive psychology)
 * - Hearing your own voice from Day 1 creates powerful emotional anchor
 * - Self-generated audio reinforces commitment through auditory memory
 *
 * Business Model:
 * - Premium feature: 1 free recording, unlimited for premium users
 * - Day 1 recording prominently featured in Rescue Mode
 */

import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Pressable, Alert, Platform } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withSequence,
  withRepeat,
  interpolate,
  runOnJS,
  cancelAnimation,
  Easing,
} from 'react-native-reanimated';
import {
  Mic,
  Square,
  Plus,
  Check,
  AlertCircle,
  Pause,
  Play,
  ChevronDown,
  ChevronUp,
} from 'lucide-react-native';
import { clsx } from 'clsx';
import * as Haptics from 'expo-haptics';
import {
  useAudioRecording,
  RecordingState,
} from '../../../hooks/useAudioRecording';
import { VoiceNotePlaybackUI } from './VoiceNotePlaybackUI';

export interface VoiceNoteSummary {
  id: string;
  duration: number;
  label?: string;
  createdAt: number;
  isDay1?: boolean;
  /** Audio URI for playback */
  audioUrl?: string;
}

export interface VoiceNotesSectionProps {
  /** List of existing voice notes */
  voiceNotes: VoiceNoteSummary[];
  /** Number of voice notes (for premium gating) */
  voiceNoteCount: number;
  /** Whether user has premium access */
  isPremium: boolean;
  /** Callback when a new recording is saved */
  onSaveRecording: (
    audioUri: string,
    durationSeconds: number,
    isDay1: boolean
  ) => Promise<void>;
  /** Callback when user taps to view all notes */
  onViewAllNotes: () => void;
  /** Callback when user hits premium limit */
  onPremiumRequired: () => void;
  /** Callback when a voice note starts playing */
  onPlayStart?: (noteId: string) => void;
  /** Callback when playback finishes */
  onPlayFinish?: (noteId: string) => void;
  /** Whether to run entrance animations */
  shouldAnimate?: boolean;
  /** Whether to skip animations for accessibility */
  reduceMotion?: boolean;
  /** Section index for staggered animation timing */
  sectionIndex?: number;
}

// Animation spring configs
const SPRING_BUTTON = { damping: 15, stiffness: 300 };
const SPRING_BOUNCY = { damping: 8, stiffness: 300 };
const SPRING_GENTLE = { damping: 28, mass: 1.2, stiffness: 180 };
const STAGGER_DELAY = 80;
const BASE_CHECKMARK_DELAY = 600;

// Premium limits
const FREE_TIER_MAX_NOTES = 1;
const MAX_RECORDING_DURATION = 300; // 5 minutes

/**
 * PulsingIcon Component for Empty State Icons
 */
function PulsingIcon({
  children,
  reduceMotion = false,
}: {
  children: React.ReactNode;
  reduceMotion?: boolean;
}) {
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  useEffect(() => {
    if (reduceMotion) {
      opacity.value = 1;
      scale.value = 1;
      return;
    }

    const pulseOpacity = () => {
      opacity.value = withTiming(0.5, { duration: 1000 }, (finished) => {
        if (finished) {
          opacity.value = withTiming(1, { duration: 1000 }, (finished2) => {
            if (finished2) {
              runOnJS(pulseOpacity)();
            }
          });
        }
      });
    };

    const pulseScale = () => {
      scale.value = withTiming(1.05, { duration: 1000 }, (finished) => {
        if (finished) {
          scale.value = withTiming(1, { duration: 1000 }, (finished2) => {
            if (finished2) {
              runOnJS(pulseScale)();
            }
          });
        }
      });
    };

    pulseOpacity();
    pulseScale();
  }, [reduceMotion, opacity, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
}

/**
 * CompletionCheckmark Component
 */
function CompletionCheckmark({
  isVisible,
  sectionIndex,
  shouldAnimate,
  reduceMotion = false,
}: {
  isVisible: boolean;
  sectionIndex: number;
  shouldAnimate: boolean;
  reduceMotion?: boolean;
}) {
  const scale = useSharedValue(
    isVisible && shouldAnimate && !reduceMotion ? 0 : isVisible ? 1 : 0
  );
  const opacity = useSharedValue(
    isVisible && shouldAnimate && !reduceMotion ? 0 : isVisible ? 1 : 0
  );

  useEffect(() => {
    if (!isVisible) {
      scale.value = 0;
      opacity.value = 0;
      return;
    }

    if (!shouldAnimate || reduceMotion) {
      scale.value = 1;
      opacity.value = 1;
      return;
    }

    const delay = sectionIndex * STAGGER_DELAY + BASE_CHECKMARK_DELAY;

    const timeout = setTimeout(() => {
      scale.value = withSequence(
        withSpring(1.2, SPRING_BOUNCY),
        withSpring(1, { damping: 15, stiffness: 200 })
      );
      opacity.value = withTiming(1, { duration: 150 });
    }, delay);

    return () => clearTimeout(timeout);
  }, [isVisible, shouldAnimate, reduceMotion, sectionIndex, scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  if (!isVisible) return null;

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          position: 'absolute',
          right: -4,
          top: -4,
        },
      ]}
    >
      <View className='h-5 w-5 items-center justify-center rounded-full bg-emerald-500 shadow-sm'>
        <Check className='text-white' size={12} strokeWidth={3} />
      </View>
    </Animated.View>
  );
}

/**
 * SectionCard Component for consistent styling with press animation
 */
function SectionCard({
  children,
  className,
  onPress,
  accessibilityLabel,
  disabled,
}: {
  children: React.ReactNode;
  className?: string;
  onPress?: () => void;
  accessibilityLabel?: string;
  disabled?: boolean;
}) {
  const scale = useSharedValue(1);
  const shadowOpacity = useSharedValue(0.08);
  const elevation = useSharedValue(2);

  const animatedStyle = useAnimatedStyle(() => ({
    elevation: elevation.value,
    shadowOffset: {
      height: interpolate(elevation.value, [1, 2], [1, 2]),
      width: 0,
    },
    shadowOpacity: shadowOpacity.value,
    shadowRadius: interpolate(elevation.value, [1, 2], [2, 4]),
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    'worklet';
    scale.value = withSpring(0.98, SPRING_BUTTON);
    shadowOpacity.value = withSpring(0.04, SPRING_BUTTON);
    elevation.value = withSpring(1, SPRING_BUTTON);
  }, [scale, shadowOpacity, elevation]);

  const handlePressOut = useCallback(() => {
    'worklet';
    scale.value = withSpring(1, SPRING_BUTTON);
    shadowOpacity.value = withSpring(0.08, SPRING_BUTTON);
    elevation.value = withSpring(2, SPRING_BUTTON);
  }, [scale, shadowOpacity, elevation]);

  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  }, [onPress]);

  if (onPress) {
    return (
      <Animated.View style={[animatedStyle, { shadowColor: '#78716c' }]}>
        <Pressable
          accessibilityLabel={accessibilityLabel}
          accessibilityRole='button'
          accessibilityState={{ disabled }}
          className={clsx('rounded-2xl bg-white p-4', className)}
          disabled={disabled}
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          {children}
        </Pressable>
      </Animated.View>
    );
  }

  return (
    <View
      className={clsx(
        'rounded-2xl bg-white p-4 shadow-sm shadow-stone-200/50',
        className
      )}
    >
      {children}
    </View>
  );
}

/**
 * AnimatedSection Component for staggered entrance animations
 */
function AnimatedSection({
  children,
  index,
  shouldAnimate,
  reduceMotion = false,
}: {
  children: React.ReactNode;
  index: number;
  shouldAnimate: boolean;
  reduceMotion?: boolean;
}) {
  const INITIAL_TRANSLATE_Y = 24;

  const translateY = useSharedValue(
    shouldAnimate && !reduceMotion ? INITIAL_TRANSLATE_Y : 0
  );
  const opacity = useSharedValue(shouldAnimate && !reduceMotion ? 0 : 1);

  useEffect(() => {
    if (!shouldAnimate || reduceMotion) {
      translateY.value = 0;
      opacity.value = 1;
      return;
    }

    const delay = index * STAGGER_DELAY;

    const timeout = setTimeout(() => {
      translateY.value = withSpring(0, SPRING_GENTLE);
      opacity.value = withTiming(1, { duration: 300 });
    }, delay);

    return () => clearTimeout(timeout);
  }, [shouldAnimate, reduceMotion, index, translateY, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
}

/**
 * WaveformVisualization Component
 * Displays an animated waveform during recording
 */
function WaveformVisualization({
  meteringLevel,
  isRecording,
  isPaused,
  reduceMotion = false,
}: {
  meteringLevel: number;
  isRecording: boolean;
  isPaused: boolean;
  reduceMotion?: boolean;
}) {
  const barCount = 20;
  const animatedHeights = Array.from({ length: barCount }, () =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useSharedValue(0.2)
  );

  useEffect(() => {
    if (!isRecording || isPaused || reduceMotion) {
      // Reset all bars to minimum height
      for (const height of animatedHeights) {
        height.value = withTiming(0.2, { duration: 200 });
      }
      return;
    }

    // Animate bars based on metering level
    for (const [index, height] of animatedHeights.entries()) {
      // Create variation across bars
      const variation = Math.sin(
        (index / barCount) * Math.PI * 2 + Date.now() / 200
      );
      const targetHeight =
        0.2 + meteringLevel * 0.8 * (0.5 + (0.5 * (1 + variation)) / 2);

      height.value = withTiming(Math.min(1, Math.max(0.2, targetHeight)), {
        duration: 100,
        easing: Easing.out(Easing.ease),
      });
    }
  }, [meteringLevel, isRecording, isPaused, reduceMotion, animatedHeights]);

  return (
    <View className='h-8 flex-row items-center justify-center gap-0.5'>
      {animatedHeights.map((height, index) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const animatedStyle = useAnimatedStyle(() => ({
          height: `${height.value * 100}%`,
        }));

        return (
          <Animated.View
            key={index}
            className='w-1 rounded-full bg-teal-500'
            style={animatedStyle}
          />
        );
      })}
    </View>
  );
}

/**
 * RecordingControls Component
 * Controls for recording: record, pause, stop
 */
function RecordingControls({
  state,
  isRecording,
  isPaused,
  formattedDuration,
  isMaxDurationReached,
  onStartRecording,
  onStopRecording,
  onPauseRecording,
  onResumeRecording,
  onCancelRecording,
}: {
  state: RecordingState;
  isRecording: boolean;
  isPaused: boolean;
  formattedDuration: string;
  isMaxDurationReached: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onPauseRecording: () => void;
  onResumeRecording: () => void;
  onCancelRecording: () => void;
}) {
  const recordButtonScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0);

  // Pulsing animation for recording button
  useEffect(() => {
    if (isRecording && !isPaused) {
      pulseOpacity.value = withRepeat(
        withTiming(0.4, { duration: 1000 }),
        -1,
        true
      );
    } else {
      cancelAnimation(pulseOpacity);
      pulseOpacity.value = withTiming(0, { duration: 200 });
    }
  }, [isRecording, isPaused, pulseOpacity]);

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: recordButtonScale.value }],
  }));

  const handlePressIn = useCallback(() => {
    recordButtonScale.value = withSpring(0.95, SPRING_BUTTON);
  }, [recordButtonScale]);

  const handlePressOut = useCallback(() => {
    recordButtonScale.value = withSpring(1, SPRING_BUTTON);
  }, [recordButtonScale]);

  const handleRecordPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (isRecording) {
      if (isPaused) {
        onResumeRecording();
      } else {
        onPauseRecording();
      }
    } else {
      onStartRecording();
    }
  }, [
    isRecording,
    isPaused,
    onStartRecording,
    onPauseRecording,
    onResumeRecording,
  ]);

  const handleStopPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    onStopRecording();
  }, [onStopRecording]);

  const handleCancelPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(
      'Cancel Recording',
      'Are you sure you want to discard this recording?',
      [
        { style: 'cancel', text: 'Keep Recording' },
        { onPress: onCancelRecording, style: 'destructive', text: 'Discard' },
      ]
    );
  }, [onCancelRecording]);

  // Show loading state
  if (state === 'preparing' || state === 'stopping') {
    return (
      <View className='items-center py-4'>
        <Text className='text-sm text-stone-500'>
          {state === 'preparing' ? 'Preparing...' : 'Saving...'}
        </Text>
      </View>
    );
  }

  // Show error state
  if (state === 'error' || state === 'permission-denied') {
    return (
      <View className='items-center py-4'>
        <View className='flex-row items-center gap-2'>
          <AlertCircle className='text-rose-500' size={16} />
          <Text className='text-sm text-rose-600'>
            {state === 'permission-denied'
              ? 'Microphone access required'
              : 'Recording failed'}
          </Text>
        </View>
        <Pressable
          className='mt-2 rounded-lg bg-teal-100 px-4 py-2'
          onPress={onStartRecording}
        >
          <Text className='text-sm font-medium text-teal-700'>Try Again</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className='items-center gap-4'>
      {/* Duration display */}
      {(isRecording || isPaused) && (
        <View className='flex-row items-center gap-2'>
          <Text
            className={clsx(
              'text-2xl font-bold',
              isMaxDurationReached ? 'text-rose-500' : 'text-stone-800'
            )}
          >
            {formattedDuration}
          </Text>
          {isMaxDurationReached && (
            <Text className='text-xs text-rose-500'>Max reached</Text>
          )}
        </View>
      )}

      {/* Recording controls */}
      <View className='flex-row items-center gap-6'>
        {/* Cancel button (only during recording) */}
        {(isRecording || isPaused) && (
          <Pressable
            accessibilityLabel='Cancel recording'
            accessibilityRole='button'
            className='h-12 w-12 items-center justify-center rounded-full bg-stone-100'
            onPress={handleCancelPress}
          >
            <Text className='text-xs font-medium text-stone-500'>Cancel</Text>
          </Pressable>
        )}

        {/* Main record/pause button */}
        <View className='relative'>
          {/* Pulse effect */}
          <Animated.View
            className='absolute inset-0 rounded-full bg-teal-500'
            style={[pulseStyle, { transform: [{ scale: 1.3 }] }]}
          />

          <Animated.View style={buttonStyle}>
            <Pressable
              accessibilityLabel={
                isRecording
                  ? isPaused
                    ? 'Resume recording'
                    : 'Pause recording'
                  : 'Start recording'
              }
              accessibilityRole='button'
              className={clsx(
                'h-16 w-16 items-center justify-center rounded-full',
                isRecording && !isPaused ? 'bg-teal-600' : 'bg-teal-500'
              )}
              onPress={handleRecordPress}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
            >
              {isRecording ? (
                isPaused ? (
                  <Play className='text-white' fill='white' size={28} />
                ) : (
                  <Pause className='text-white' fill='white' size={28} />
                )
              ) : (
                <Mic className='text-white' size={28} />
              )}
            </Pressable>
          </Animated.View>
        </View>

        {/* Stop button (only during recording) */}
        {(isRecording || isPaused) && (
          <Pressable
            accessibilityLabel='Stop and save recording'
            accessibilityRole='button'
            className='h-12 w-12 items-center justify-center rounded-full bg-rose-500'
            onPress={handleStopPress}
          >
            <Square className='text-white' fill='white' size={20} />
          </Pressable>
        )}
      </View>

      {/* Instructions */}
      {!isRecording && !isPaused && (
        <Text className='text-sm text-stone-500'>
          Tap to record a voice note
        </Text>
      )}
    </View>
  );
}

/**
 * VoiceNoteItem Component
 * Individual voice note with expandable playback UI
 */
function VoiceNoteItem({
  note,
  reduceMotion = false,
  onPlayStart,
  onPlayFinish,
}: {
  note: VoiceNoteSummary;
  reduceMotion?: boolean;
  onPlayStart?: () => void;
  onPlayFinish?: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const expandedHeight = useSharedValue(0);
  const rotateIcon = useSharedValue(0);

  const handleToggleExpand = useCallback(() => {
    if (!note.audioUrl) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const willExpand = !isExpanded;
    setIsExpanded(willExpand);

    if (reduceMotion) {
      expandedHeight.value = willExpand ? 1 : 0;
      rotateIcon.value = willExpand ? 1 : 0;
    } else {
      expandedHeight.value = withSpring(willExpand ? 1 : 0, SPRING_BUTTON);
      rotateIcon.value = withSpring(willExpand ? 1 : 0, SPRING_BUTTON);
    }
  }, [note.audioUrl, isExpanded, reduceMotion, expandedHeight, rotateIcon]);

  const expandedStyle = useAnimatedStyle(() => ({
    height: expandedHeight.value === 0 ? 0 : 'auto',
    opacity: expandedHeight.value,
    overflow: 'hidden' as const,
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotateIcon.value * 180}deg` }],
  }));

  const hasPlayback = !!note.audioUrl;

  return (
    <View className='rounded-lg bg-stone-50'>
      {/* Header row - always visible */}
      <Pressable
        accessibilityLabel={
          hasPlayback
            ? `${note.label || 'Recording'}, ${formatDuration(note.duration)}. ${isExpanded ? 'Collapse' : 'Expand'} to ${isExpanded ? 'hide' : 'play'}`
            : `${note.label || 'Recording'}, ${formatDuration(note.duration)}`
        }
        accessibilityRole={hasPlayback ? 'button' : 'text'}
        className='flex-row items-center gap-3 p-3'
        disabled={!hasPlayback}
        onPress={handleToggleExpand}
      >
        <View className='h-8 w-8 items-center justify-center rounded-full bg-teal-100'>
          <Mic className='text-teal-600' size={14} />
        </View>
        <View className='flex-1'>
          <Text className='text-sm font-medium text-stone-700'>
            {note.label || `Recording ${formatDuration(note.duration)}`}
          </Text>
          <Text className='text-xs text-stone-500'>
            {formatRelativeTime(note.createdAt)}
            {note.isDay1 && ' • Day 1'}
          </Text>
        </View>
        <Text className='mr-2 text-xs text-stone-400'>
          {formatDuration(note.duration)}
        </Text>
        {hasPlayback && (
          <Animated.View style={iconStyle}>
            <ChevronDown className='text-stone-400' size={16} />
          </Animated.View>
        )}
      </Pressable>

      {/* Expandable playback UI */}
      {hasPlayback && isExpanded && (
        <Animated.View style={expandedStyle}>
          <View className='border-t border-stone-100 p-3'>
            <VoiceNotePlaybackUI
              compact
              audioUri={note.audioUrl}
              initialDuration={note.duration}
              isDay1={note.isDay1}
              label={note.label}
              reduceMotion={reduceMotion}
              showSpeedControl={false}
              onPlayFinish={onPlayFinish}
              onPlayStart={onPlayStart}
            />
          </View>
        </Animated.View>
      )}
    </View>
  );
}

/**
 * VoiceNotesList Component
 * Displays list of existing voice notes with expandable playback
 */
function VoiceNotesList({
  voiceNotes,
  onViewAllNotes,
  onPlayStart,
  onPlayFinish,
  reduceMotion = false,
}: {
  voiceNotes: VoiceNoteSummary[];
  onViewAllNotes: () => void;
  onPlayStart?: (noteId: string) => void;
  onPlayFinish?: (noteId: string) => void;
  reduceMotion?: boolean;
}) {
  if (voiceNotes.length === 0) {
    return null;
  }

  const displayNotes = voiceNotes.slice(0, 3);
  const hasMore = voiceNotes.length > 3;

  return (
    <View className='mt-4 border-t border-stone-100 pt-4'>
      <View className='mb-2 flex-row items-center justify-between'>
        <Text className='text-sm font-medium text-stone-600'>
          Your Recordings ({voiceNotes.length})
        </Text>
        {hasMore && (
          <Pressable onPress={onViewAllNotes}>
            <Text className='text-xs font-medium text-teal-600'>View All</Text>
          </Pressable>
        )}
      </View>

      <View className='gap-2'>
        {displayNotes.map((note) => (
          <VoiceNoteItem
            key={note.id}
            note={note}
            reduceMotion={reduceMotion}
            onPlayFinish={() => onPlayFinish?.(note.id)}
            onPlayStart={() => onPlayStart?.(note.id)}
          />
        ))}
      </View>
    </View>
  );
}

/**
 * Format seconds as MM:SS
 */
function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Format timestamp as relative time
 */
function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
}

/**
 * VoiceNotesSection - Main component
 *
 * Displays voice notes recording interface with:
 * - Recording button with waveform visualization
 * - List of existing recordings
 * - Premium gating (1 free, unlimited premium)
 * - Teal accent color
 */
export function VoiceNotesSection({
  voiceNotes,
  voiceNoteCount,
  isPremium,
  onSaveRecording,
  onViewAllNotes,
  onPremiumRequired,
  onPlayStart,
  onPlayFinish,
  shouldAnimate = false,
  reduceMotion = false,
  sectionIndex = 0,
}: VoiceNotesSectionProps) {
  const [isDay1Recording, setIsDay1Recording] = useState(false);
  const hasVoiceNotes = voiceNoteCount > 0;

  // Check if user can record (premium or under free limit)
  const canRecord = isPremium || voiceNoteCount < FREE_TIER_MAX_NOTES;

  // Use the audio recording hook
  const {
    status,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    cancelRecording,
    reset,
    isRecording,
    isPaused,
    formattedDuration,
    isMaxDurationReached,
  } = useAudioRecording({
    maxDurationSeconds: MAX_RECORDING_DURATION,
    onError: (error) => {
      console.error('Recording error:', error);
    },
    onMaxDurationReached: () => {
      // Auto-stop when max duration reached
      handleStopRecording();
    },
    onRecordingComplete: async (uri, durationSeconds) => {
      // Determine if this should be marked as Day 1
      const shouldMarkAsDay1 = isDay1Recording || voiceNoteCount === 0;

      try {
        await onSaveRecording(uri, durationSeconds, shouldMarkAsDay1);
        reset();
        setIsDay1Recording(false);
      } catch {
        Alert.alert('Error', 'Failed to save recording. Please try again.');
      }
    },
  });

  const handleStartRecording = useCallback(() => {
    if (!canRecord) {
      onPremiumRequired();
      return;
    }
    startRecording();
  }, [canRecord, onPremiumRequired, startRecording]);

  const handleStopRecording = useCallback(async () => {
    await stopRecording();
  }, [stopRecording]);

  const handleSectionPress = useCallback(() => {
    // If not recording, check premium status
    if (!isRecording && !canRecord) {
      onPremiumRequired();
    }
  }, [isRecording, canRecord, onPremiumRequired]);

  return (
    <AnimatedSection
      index={sectionIndex}
      reduceMotion={reduceMotion}
      shouldAnimate={shouldAnimate}
    >
      <SectionCard
        accessibilityLabel={hasVoiceNotes ? 'Voice notes' : 'Add voice note'}
        className='border-l-4 border-l-teal-400'
        disabled={isRecording || isPaused}
        onPress={handleSectionPress}
      >
        <View className='flex-row items-start gap-3'>
          {/* Icon with completion checkmark */}
          <View className='relative h-10 w-10 items-center justify-center rounded-xl bg-teal-100'>
            {hasVoiceNotes ? (
              <Mic className='text-teal-500' size={20} />
            ) : (
              <PulsingIcon reduceMotion={reduceMotion}>
                <Mic className='text-teal-500' size={20} />
              </PulsingIcon>
            )}
            <CompletionCheckmark
              isVisible={hasVoiceNotes}
              reduceMotion={reduceMotion}
              sectionIndex={sectionIndex}
              shouldAnimate={shouldAnimate}
            />
          </View>

          {/* Content area */}
          <View className='flex-1'>
            <View className='mb-1 flex-row items-center justify-between'>
              <Text className='font-semibold text-stone-800'>Voice Notes</Text>
              {!hasVoiceNotes && !isRecording && (
                <View className='flex-row items-center gap-1'>
                  <Plus className='text-teal-600' size={12} />
                  <Text className='text-xs font-medium text-teal-600'>
                    Record
                  </Text>
                </View>
              )}
              {!isPremium && (
                <View className='rounded-full bg-amber-100 px-2 py-0.5'>
                  <Text className='text-xs font-medium text-amber-700'>
                    {voiceNoteCount}/{FREE_TIER_MAX_NOTES} Free
                  </Text>
                </View>
              )}
            </View>

            {/* Description when not recording */}
            {!isRecording && !isPaused && !hasVoiceNotes && (
              <Text className='text-sm text-stone-500'>
                Record your motivation for powerful recall
              </Text>
            )}

            {/* Waveform visualization during recording */}
            {(isRecording || isPaused) && (
              <View className='mt-2'>
                <WaveformVisualization
                  isPaused={isPaused}
                  isRecording={isRecording}
                  meteringLevel={status.meteringLevel}
                  reduceMotion={reduceMotion}
                />
              </View>
            )}
          </View>
        </View>

        {/* Recording controls */}
        {(isRecording ||
          isPaused ||
          status.state === 'preparing' ||
          status.state === 'stopping' ||
          status.state === 'error' ||
          status.state === 'permission-denied') && (
          <View className='mt-4 border-t border-stone-100 pt-4'>
            <RecordingControls
              formattedDuration={formattedDuration}
              isMaxDurationReached={isMaxDurationReached}
              isPaused={isPaused}
              isRecording={isRecording}
              state={status.state}
              onCancelRecording={cancelRecording}
              onPauseRecording={pauseRecording}
              onResumeRecording={resumeRecording}
              onStartRecording={handleStartRecording}
              onStopRecording={handleStopRecording}
            />
          </View>
        )}

        {/* Record button for initial state */}
        {!isRecording &&
          !isPaused &&
          status.state !== 'preparing' &&
          status.state !== 'stopping' &&
          status.state !== 'error' &&
          status.state !== 'permission-denied' && (
            <View className='mt-4 items-center'>
              <Pressable
                accessibilityLabel='Start recording'
                accessibilityRole='button'
                className={clsx(
                  'flex-row items-center gap-2 rounded-full px-4 py-2',
                  canRecord ? 'bg-teal-500' : 'bg-stone-300'
                )}
                onPress={handleStartRecording}
              >
                <Mic className='text-white' size={16} />
                <Text className='font-medium text-white'>
                  {hasVoiceNotes ? 'New Recording' : 'Record Your Day 1'}
                </Text>
              </Pressable>
            </View>
          )}

        {/* List of existing voice notes */}
        {!isRecording && !isPaused && (
          <VoiceNotesList
            reduceMotion={reduceMotion}
            voiceNotes={voiceNotes}
            onPlayFinish={onPlayFinish}
            onPlayStart={onPlayStart}
            onViewAllNotes={onViewAllNotes}
          />
        )}
      </SectionCard>
    </AnimatedSection>
  );
}

export default VoiceNotesSection;
