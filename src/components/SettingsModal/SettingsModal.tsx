/**
 * SettingsModal Component
 */

import React, { useCallback } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ErrorBoundary } from '../ErrorBoundary';
import Modal from '../Modal';
import { useSettingsModalLogic } from './SettingsModal.hooks';
import { SettingsModalFallback } from './components/SettingsModalFallback';
import { SettingsMainView } from './components/SettingsMainView';
import { fullScreenModalStyle } from './SettingsContent.constants';
import type { SettingsModalProps } from './types';

function SettingsModalContent(props: SettingsModalProps) {
  const logic = useSettingsModalLogic({
    onClose: props.onClose,
    settingsDocument: props.settingsDocument,
    visible: props.visible,
  });
  const insets = useSafeAreaInsets();

  const handleRequestClose = useCallback(() => {
    if (logic.view !== 'settings') {
      logic.setView('settings');
      return;
    }
    props.onClose();
  }, [logic, props.onClose]);

  return (
    <Modal
      disableBackdropClose
      disableGestureClose
      backdropOpacity={0}
      variant='fullScreen'
      visible={props.visible}
      onClose={handleRequestClose}
      style={fullScreenModalStyle}
    >
      <SettingsMainView
        archivedHabitsCount={props.archivedHabitsCount ?? 0}
        compactView={logic.compactView}
        completionSoundEnabled={props.completionSoundEnabled}
        completionSoundType={props.completionSoundType}
        dayShape={props.dayShape}
        habitCompletionIcon={props.habitCompletionIcon}
        handleClose={logic.handleClose}
        habitSortMode={logic.habitSortMode}
        insets={insets}
        isLoading={props.isLoading ?? false}
        isPremium={props.isPremium ?? false}
        setCompactView={logic.setCompactView}
        setDarkModePreference={logic.setDarkModePreference}
        setHabitSortMode={logic.setHabitSortMode}
        connectorStyle={logic.connectorStyle}
        setConnectorStyle={logic.setConnectorStyle}
        setShowGradientFill={logic.setShowGradientFill}
        setView={logic.setView}
        showGradientFill={logic.showGradientFill}
        stickyCalendarHeader={props.stickyCalendarHeader}
        streakRemindersEnabled={props.streakRemindersEnabled}
        streakReminderTime={props.streakReminderTime}
        darkModePreference={logic.darkModePreference}
        onChangeCompletionSoundEnabled={props.onChangeCompletionSoundEnabled}
        onChangeCompletionSoundType={props.onChangeCompletionSoundType}
        onChangeDayShape={props.onChangeDayShape}
        onChangeHabitCompletionIcon={props.onChangeHabitCompletionIcon}
        onChangeStickyCalendarHeader={props.onChangeStickyCalendarHeader}
        onChangeStreakReminderTime={props.onChangeStreakReminderTime}
        onExportHabitsData={props.onExportHabitsData}
        onPremiumUpsell={props.onPremiumUpsell}
        onToggleStreakReminders={props.onToggleStreakReminders}
        view={logic.view}
        viewDirection={logic.viewDirection}
      />
    </Modal>
  );
}

export default function SettingsModal(props: SettingsModalProps) {
  return (
    <ErrorBoundary
      fallback={
        <SettingsModalFallback
          visible={props.visible}
          onClose={props.onClose}
        />
      }
    >
      <SettingsModalContent {...props} />
    </ErrorBoundary>
  );
}
