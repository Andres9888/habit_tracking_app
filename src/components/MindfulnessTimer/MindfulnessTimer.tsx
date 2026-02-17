/**
 * MindfulnessTimer Component
 *
 * A full-screen meditation/breathing timer overlay that appears when
 * completing mindfulness-related habits. Features:
 * - Preset durations: 1, 3, 5, 10, 15 minutes
 * - Animated breathing circle (inhale 4s → hold 4s → exhale 4s)
 * - Gentle chime sound at completion
 * - Auto-completes the habit when timer finishes
 * - Calm dark UI with subtle animations
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  Easing,
  FadeInUp,
} from 'react-native-reanimated';
import { useBreathingAnimation } from './useBreathingAnimation';
import { TIMER_PRESETS, type BreathingPhase } from './mindfulnessUtils';
import { HapticPatterns } from '../../utils/haptics/patterns';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CIRCLE_SIZE = SCREEN_WIDTH * 0.6;

interface MindfulnessTimerProps {
  /** Whether the timer modal is visible */
  visible: boolean;
  /** Habit name to display */
  habitName: string;
  /** Called when the timer completes — should trigger habit completion */
  onComplete: () => void;
  /** Called when user dismisses without completing */
  onDismiss: () => void;
}

/** Phase display labels */
const PHASE_LABELS: Record<BreathingPhase, string> = {
  inhale: 'Breathe In',
  hold: 'Hold',
  exhale: 'Breathe Out',
};

function formatTime(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function MindfulnessTimer({
  visible,
  habitName,
  onComplete,
  onDismiss,
}: MindfulnessTimerProps) {
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<BreathingPhase>('inhale');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phaseTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { breathingStyle } = useBreathingAnimation(isRunning);

  // Phase tracking
  useEffect(() => {
    if (!isRunning) {
      if (phaseTimerRef.current) clearInterval(phaseTimerRef.current);
      return;
    }
    let elapsed = 0;
    phaseTimerRef.current = setInterval(() => {
      elapsed = (elapsed + 100) % 12000; // 12s cycle
      const sec = elapsed / 1000;
      if (sec < 4) setCurrentPhase('inhale');
      else if (sec < 8) setCurrentPhase('hold');
      else setCurrentPhase('exhale');
    }, 100);
    return () => {
      if (phaseTimerRef.current) clearInterval(phaseTimerRef.current);
    };
  }, [isRunning]);

  // Countdown timer
  useEffect(() => {
    if (!isRunning || timeRemaining <= 0) return;

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          setIsFinished(true);
          // Gentle haptic for completion "chime"
          HapticPatterns.success();
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, timeRemaining]);

  const handleSelectDuration = useCallback((minutes: number) => {
    setSelectedDuration(minutes);
    setTimeRemaining(minutes * 60);
    setIsRunning(true);
    setIsFinished(false);
    HapticPatterns.tap();
  }, []);

  const handleFinishComplete = useCallback(() => {
    HapticPatterns.success();
    onComplete();
    resetState();
  }, [onComplete]);

  const handleDismiss = useCallback(() => {
    setIsRunning(false);
    onDismiss();
    resetState();
  }, [onDismiss]);

  const resetState = () => {
    setSelectedDuration(null);
    setTimeRemaining(0);
    setIsRunning(false);
    setIsFinished(false);
    setCurrentPhase('inhale');
  };

  // Progress for the ring (0 → 1)
  const progress =
    selectedDuration && selectedDuration > 0
      ? 1 - timeRemaining / (selectedDuration * 60)
      : 0;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      statusBarTranslucent
      onRequestClose={handleDismiss}
    >
      <View style={styles.overlay}>
        <Animated.View
          entering={SlideInDown.springify().damping(18)}
          style={styles.container}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleDismiss} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.habitTitle} numberOfLines={1}>
              {habitName}
            </Text>
            <View style={styles.closeButton} />
          </View>

          {/* Duration Selection */}
          {!selectedDuration && !isFinished && (
            <Animated.View entering={FadeIn.duration(300)} style={styles.durationSection}>
              <Text style={styles.promptText}>Choose your session</Text>
              <Text style={styles.subtitleText}>Find a comfortable position and relax</Text>
              <View style={styles.presetsRow}>
                {TIMER_PRESETS.map((mins) => (
                  <TouchableOpacity
                    key={mins}
                    style={styles.presetButton}
                    onPress={() => handleSelectDuration(mins)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.presetNumber}>{mins}</Text>
                    <Text style={styles.presetLabel}>min</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Animated.View>
          )}

          {/* Active Timer */}
          {isRunning && (
            <Animated.View entering={FadeIn.duration(500)} style={styles.timerSection}>
              {/* Breathing Circle */}
              <View style={styles.circleContainer}>
                {/* Progress ring background */}
                <View style={styles.progressRingBg}>
                  <View
                    style={[
                      styles.progressRingFill,
                      {
                        // Simple progress indicator via border
                        borderTopColor:
                          progress > 0.25 ? '#6EE7B7' : 'transparent',
                        borderRightColor:
                          progress > 0.5 ? '#6EE7B7' : 'transparent',
                        borderBottomColor:
                          progress > 0.75 ? '#6EE7B7' : 'transparent',
                        borderLeftColor: '#6EE7B7',
                        transform: [{ rotate: `${progress * 360}deg` }],
                      },
                    ]}
                  />
                </View>
                <Animated.View style={[styles.breathingCircle, breathingStyle]}>
                  <View style={styles.innerCircle}>
                    <Text style={styles.phaseText}>
                      {PHASE_LABELS[currentPhase]}
                    </Text>
                    <Text style={styles.timerText}>
                      {formatTime(timeRemaining)}
                    </Text>
                  </View>
                </Animated.View>
              </View>

              {/* Pause/Stop */}
              <TouchableOpacity
                style={styles.stopButton}
                onPress={handleDismiss}
                activeOpacity={0.7}
              >
                <Text style={styles.stopButtonText}>End Session</Text>
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* Completion */}
          {isFinished && (
            <Animated.View entering={FadeInUp.springify().damping(18)} style={styles.finishedSection}>
              <Text style={styles.finishedEmoji}>🪷</Text>
              <Text style={styles.finishedTitle}>Session Complete</Text>
              <Text style={styles.finishedSubtitle}>
                {selectedDuration} minute{selectedDuration !== 1 ? 's' : ''} of mindfulness
              </Text>
              <TouchableOpacity
                style={styles.completeButton}
                onPress={handleFinishComplete}
                activeOpacity={0.8}
              >
                <Text style={styles.completeButtonText}>
                  Complete Habit ✓
                </Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: SCREEN_WIDTH - 32,
    maxWidth: 400,
    backgroundColor: '#1A1A2E',
    borderRadius: 24,
    paddingBottom: 32,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 16,
    fontWeight: '600',
  },
  habitTitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 17,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 8,
  },

  // Duration Selection
  durationSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  promptText: {
    color: '#E2E8F0',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitleText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 15,
    marginBottom: 32,
  },
  presetsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  presetButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(110, 231, 183, 0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(110, 231, 183, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  presetNumber: {
    color: '#6EE7B7',
    fontSize: 22,
    fontWeight: '700',
  },
  presetLabel: {
    color: 'rgba(110, 231, 183, 0.6)',
    fontSize: 11,
    fontWeight: '500',
    marginTop: -2,
  },

  // Active Timer
  timerSection: {
    alignItems: 'center',
    paddingTop: 24,
    paddingHorizontal: 24,
  },
  circleContainer: {
    width: CIRCLE_SIZE + 16,
    height: CIRCLE_SIZE + 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  progressRingBg: {
    position: 'absolute',
    width: CIRCLE_SIZE + 16,
    height: CIRCLE_SIZE + 16,
    borderRadius: (CIRCLE_SIZE + 16) / 2,
    borderWidth: 3,
    borderColor: 'rgba(110, 231, 183, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressRingFill: {
    position: 'absolute',
    width: CIRCLE_SIZE + 16,
    height: CIRCLE_SIZE + 16,
    borderRadius: (CIRCLE_SIZE + 16) / 2,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  breathingCircle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: 'rgba(110, 231, 183, 0.08)',
    borderWidth: 2,
    borderColor: 'rgba(110, 231, 183, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCircle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  phaseText: {
    color: '#6EE7B7',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  timerText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 42,
    fontWeight: '200',
    fontVariant: ['tabular-nums'],
    letterSpacing: 2,
  },
  stopButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  stopButtonText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
    fontWeight: '600',
  },

  // Finished
  finishedSection: {
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 24,
  },
  finishedEmoji: {
    fontSize: 56,
    marginBottom: 16,
  },
  finishedTitle: {
    color: '#E2E8F0',
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 8,
  },
  finishedSubtitle: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 15,
    marginBottom: 32,
  },
  completeButton: {
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: '#059669',
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
});

export default MindfulnessTimer;
