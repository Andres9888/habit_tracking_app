/**
 * ActivationModal Component
 * 
 * Pre-habit notification modal that primes users for habit execution.
 * 
 * **Trigger:** 
 * - Scheduled notification at habit reminder time
 * - Manual activation from habit quick actions
 * 
 * **Display:**
 * - Full-screen modal with stone-50 background
 * - Header with close button
 * - Habit card showing streak and completion stats
 * - Motivation content sections:
 *   - "Your Why" (featured, from user's vision board)
 *   - WOOP IF-THEN reminder (implementation intentions)
 *   - Cue/trigger reminder (habit cue system)
 * - Action buttons at bottom
 * 
 * **Actions:**
 * - Start Now (glowing primary button) - marks habit complete, closes modal
 * - Snooze - reschedules notification, closes modal
 * - Just 2 Min - commits to minimal version, closes modal
 * 
 * **Modal Type:** Shared Modal component with 'fullScreen' variant
 * 
 * **Lifecycle:**
 * - Opens: visible=true from notification or manual trigger
 * - Closes: onClose via any action button or close button
 * - Returns habit data via callbacks (onStartNow, onSnooze, onJustTwoMin)
 * 
 * **Pattern:** Uses shared Modal (fullScreen variant)
 * Part of Motivation System - Activation phase (T7.1)
 * 
 * **Scientific Basis:**
 * - Implementation intentions (Gollwitzer, 1999): 2-3x follow-through
 * - Andrew Huberman Dual Visualization: Success OR failure based on motivation
 * - BJ Fogg's Tiny Habits: "Just 2 min" reduces activation energy
 * 
 * Respects reduce motion preference for animations
 */

import React, { useCallback } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Modal } from '../../../Modal';
import { ActivationModalHeader } from './ActivationModalHeader';
import { ActivationModalContent } from './ActivationModalContent';
import { ActivationModalActions } from './ActivationModalActions';
import type { ActivationModalProps } from './types';

/**
 * ActivationModal - Main component
 *
 * Pre-habit notification modal that primes users for habit execution.
 * Displays:
 * 1. Habit card with streak/completion stats
 * 2. Your Why (featured)
 * 3. WOOP IF-THEN reminder
 * 4. Cue/trigger reminder
 * 5. Start Now button (glowing)
 * 6. Quick actions: Snooze, Just 2 Min
 */
export function ActivationModal({
  visible,
  onClose,
  habit,
  onStartNow,
  onSnooze,
  onJustTwoMin,
  reduceMotion = false,
}: ActivationModalProps) {
  const insets = useSafeAreaInsets();

  const handleStartNow = useCallback(() => {
    onStartNow?.();
    onClose();
  }, [onStartNow, onClose]);

  const handleSnooze = useCallback(() => {
    onSnooze?.();
    onClose();
  }, [onSnooze, onClose]);

  const handleJustTwoMin = useCallback(() => {
    onJustTwoMin?.();
    onClose();
  }, [onJustTwoMin, onClose]);

  // Don't render if no habit data
  if (!habit) return null;

  return (
    <Modal
      respectReduceMotion={!reduceMotion}
      variant='fullScreen'
      visible={visible}
      onClose={onClose}
    >
      <View accessibilityViewIsModal className='flex-1 bg-stone-50' style={{ paddingTop: insets.top }}>
        <ActivationModalHeader onClose={onClose} />
        <ActivationModalContent
          habit={habit}
          reduceMotion={reduceMotion}
          visible={visible}
        />
        <ActivationModalActions
          habit={habit}
          paddingBottom={Math.max(insets.bottom, 16)}
          reduceMotion={reduceMotion}
          visible={visible}
          onJustTwoMin={handleJustTwoMin}
          onSnooze={handleSnooze}
          onStartNow={handleStartNow}
        />
      </View>
    </Modal>
  );
}

export default ActivationModal;
