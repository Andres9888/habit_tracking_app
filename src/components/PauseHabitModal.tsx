/**
 * PauseHabitModal Component
 * 
 * Center alert confirmation dialog for pausing a habit.
 * 
 * **Trigger:** Long-press habit card → "Pause" option in quick actions
 * 
 * **Display:**
 * - Centered alert dialog with backdrop
 * - Habit name in title
 * - Explanation: progress preserved, can resume from Settings
 * - Two action buttons: Cancel, Pause Habit
 * 
 * **Actions:**
 * - Cancel: Dismisses modal, no changes
 * - Pause Habit: Confirms pause, hides habit from daily list
 * 
 * **Modal Type:** Shared Modal component with 'centerAlert' variant
 * 
 * **Lifecycle:**
 * - Opens: visible=true from habit quick actions
 * - Closes: onCancel (no change) or onConfirm (pauses habit)
 * - Uses spring animations for enter/exit
 * 
 * **Pattern:** Uses shared Modal with centerAlert variant (scale + fade animation)
 * Based on UX specification - explains pause behavior clearly
 * Progress and strength are preserved when paused
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Modal } from './Modal';
import { Button } from './Button/Button';
import { useAppTheme } from '../theme';
import { typography } from '../theme/typography';

interface PauseHabitModalProps {
  visible: boolean;
  habitName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function PauseHabitModal({
  visible,
  habitName,
  onConfirm,
  onCancel,
}: PauseHabitModalProps) {
  const theme = useAppTheme();

  return (
    <Modal variant='centerAlert' visible={visible} onClose={onCancel}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: theme.custom.colors.gray[900] }]}>
          Pause "{habitName}"?
        </Text>

        <Text
          style={[styles.message, { color: theme.custom.colors.gray[600] }]}
        >
          This habit will be hidden from your daily list, but your progress and
          strength will be preserved. You can resume it anytime from Settings.
        </Text>

        <View style={styles.buttonContainer}>
          <Button style={styles.button} variant='secondary' onPress={onCancel}>
            Cancel
          </Button>
          <Button style={styles.button} variant='primary' onPress={onConfirm}>
            Pause Habit
          </Button>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  container: {
    // Modal already has padding, but we can add vertical spacing
  },
  message: {
    fontSize: typography.body.fontSize,
    lineHeight: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
  title: {
    fontSize: typography.heading2.fontSize,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
});

export default PauseHabitModal;
