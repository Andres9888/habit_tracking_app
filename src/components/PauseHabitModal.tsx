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
import { Button } from './Button';
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
    <Modal visible={visible} onClose={onCancel} variant="centerAlert">
      <View style={styles.container}>
        <Text style={[styles.title, { color: theme.custom.colors.gray[900] }]}>
          Pause "{habitName}"?
        </Text>

        <Text style={[styles.message, { color: theme.custom.colors.gray[600] }]}>
          This habit will be hidden from your daily list, but your progress and strength will be preserved.
          You can resume it anytime from Settings.
        </Text>

        <View style={styles.buttonContainer}>
          <Button
            variant="secondary"
            onPress={onCancel}
            style={styles.button}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onPress={onConfirm}
            style={styles.button}
          >
            Pause Habit
          </Button>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    // Modal already has padding, but we can add vertical spacing
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
  },
});

export default PauseHabitModal;
