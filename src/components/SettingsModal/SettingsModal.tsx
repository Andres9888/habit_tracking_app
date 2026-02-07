/**
 * SettingsModal Component
 *
 * Full-screen modal for app settings. Manages navigation between:
 * - Main settings view (visual preferences, account)
 * - Archived habits sub-view
 *
 * Provides controls for:
 * - Visual preferences (progress bar, icons, shapes)
 * - Habit management (archived habits)
 * - Account actions (sign out, delete)
 *
 * Supports high contrast mode for accessibility.
 */

import React from 'react';
import { Modal, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ArchivedHabitsModal from '../ArchivedHabitsModal';
import { useSettingsModalLogic } from './SettingsModal.hooks';
import { getSettingsColors } from './colors';
import { SettingsHeader } from './SettingsHeader';
import { SettingsContent } from './SettingsContent';
import type { SettingsModalProps } from './types';

export default function SettingsModal({
  dayShape = 'square',
  habitCompletionIcon = 'chain',
  isHighContrastActive = false,
  onChangeDayShape = () => {},
  onChangeHabitCompletionIcon = () => {},
  onClose,
  visible,
}: SettingsModalProps) {
  const { view, setView, handleClose } = useSettingsModalLogic({
    onClose,
    visible,
  });
  const insets = useSafeAreaInsets();
  const colors = getSettingsColors(isHighContrastActive);

  if (!visible) return null;

  if (view === 'archived') {
    return (
      <Modal
        animationType='slide'
        visible={visible}
        onRequestClose={handleClose}
      >
        <ArchivedHabitsModal
          onBack={() => setView('settings')}
          onClose={handleClose}
        />
      </Modal>
    );
  }

  return (
    <Modal animationType='slide' visible={visible} onRequestClose={handleClose}>
      <View
        className='flex-1 bg-background'
        style={{ backgroundColor: colors.background }}
      >
        <SettingsHeader
          colors={colors}
          paddingTop={insets.top + 8}
          onClose={handleClose}
        />
        <SettingsContent
          colors={colors}
          dayShape={dayShape}
          habitCompletionIcon={habitCompletionIcon}
          isHighContrastActive={isHighContrastActive}
          onChangeDayShape={onChangeDayShape}
          onChangeHabitCompletionIcon={onChangeHabitCompletionIcon}
          onOpenArchivedHabits={() => setView('archived')}
        />
      </View>
    </Modal>
  );
}
