/**
 * PauseHabitModal Component
 * Based on UX Specification - Confirmation modal for pausing habits
 *
 * Shows a center alert modal with pause confirmation message
 * Explains that progress is preserved and habit can be resumed from Settings
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Modal } from './Modal';
import { Button } from './Button/Button';
import { useAppTheme } from '../theme';

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
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
});

export default PauseHabitModal;
