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
  onChangeShowWeekCompletionBar = () => {},
  onClose,
  showWeekCompletionBar = true,
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
          showWeekCompletionBar={showWeekCompletionBar}
          onChangeDayShape={onChangeDayShape}
          onChangeHabitCompletionIcon={onChangeHabitCompletionIcon}
          onChangeShowWeekCompletionBar={onChangeShowWeekCompletionBar}
          onOpenArchivedHabits={() => setView('archived')}
        />
      </View>
    </Modal>
  );
}
