/* eslint-disable max-lines-per-function */
/**
 * SettingsModal Component (v2)
 *
 * Full-screen modal for app settings with dark theme and animations.
 * Features:
 * - Account management with subscription status
 * - Notification preferences
 * - Visual customization options
 * - App and legal sections
 * - Data export and account deletion
 *
 * Uses react-native-reanimated for 60fps animations
 * and expo-haptics for tactile feedback.
 */

import React, { useCallback, useState } from 'react';
import { Modal, View, StyleSheet, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import ArchivedHabitsModal from '../ArchivedHabitsModal';
import { SettingsHeader } from './SettingsHeader';
import { SettingsContent } from './SettingsContent';
import { SETTINGS_COLORS } from './types';
import type { SettingsModalProps } from './types';

type SettingsView = 'settings' | 'archived';

export default function SettingsModal({
  visible,
  onClose,
  dayShape = 'square',
  habitCompletionIcon = 'chain',
  showWeekCompletionBar = true,
  onChangeDayShape = () => {},
  onChangeHabitCompletionIcon = () => {},
  onChangeShowWeekCompletionBar = () => {},
}: SettingsModalProps) {
  const [view, setView] = useState<SettingsView>('settings');
  const insets = useSafeAreaInsets();

  const handleClose = useCallback(() => {
    setView('settings'); // Reset view on close
    onClose();
  }, [onClose]);

  const handleOpenArchivedHabits = useCallback(() => {
    setView('archived');
  }, []);

  const handleBackFromArchived = useCallback(() => {
    setView('settings');
  }, []);

  if (!visible) return null;

  // Show archived habits sub-view
  if (view === 'archived') {
    return (
      <Modal
        statusBarTranslucent
        animationType='slide'
        visible={visible}
        onRequestClose={handleClose}
      >
        <ArchivedHabitsModal
          onBack={handleBackFromArchived}
          onClose={handleClose}
        />
      </Modal>
    );
  }

  // Main settings view
  return (
    <Modal
      statusBarTranslucent
      animationType='slide'
      visible={visible}
      onRequestClose={handleClose}
    >
      <StatusBar barStyle='light-content' />
      <LinearGradient
        colors={[
          SETTINGS_COLORS.background,
          SETTINGS_COLORS.backgroundGradientEnd,
        ]}
        style={styles.container}
      >
        <View style={{ paddingTop: insets.top }}>
          <SettingsHeader paddingTop={16} onClose={handleClose} />
        </View>
        <SettingsContent
          dayShape={dayShape}
          habitCompletionIcon={habitCompletionIcon}
          showWeekCompletionBar={showWeekCompletionBar}
          onChangeDayShape={onChangeDayShape}
          onChangeHabitCompletionIcon={onChangeHabitCompletionIcon}
          onChangeShowWeekCompletionBar={onChangeShowWeekCompletionBar}
          onClose={handleClose}
          onOpenArchivedHabits={handleOpenArchivedHabits}
        />
      </LinearGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
