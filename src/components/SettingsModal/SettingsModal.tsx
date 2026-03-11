/* eslint-disable max-lines, max-lines-per-function */
/**
 * SettingsModal Component
 */

import React, { useCallback } from 'react';
import { Modal, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ErrorBoundary, ScreenErrorFallback } from '../ErrorBoundary';
import ArchivedHabitsModal from '../ArchivedHabitsModal';
import { SettingsModalSkeleton } from '../SkeletonLoader';
import { useSettingsModalLogic } from './SettingsModal.hooks';
import { getSettingsColors } from './colors';
import { SettingsHeader } from './SettingsHeader';
import { SettingsContent } from './SettingsContent';
import { SortPicker } from './SortPicker';
import { useThemeColors } from '../../theme/ThemeContext';
import type { HabitSortMode } from '../../features/habits/types';
import type { SettingsModalProps } from './types';

function SettingsModalContent({
  completionSoundEnabled = false,
  dayShape = 'square',
  habitCompletionIcon = 'chain',
  isHighContrastActive = false,
  onChangeCompletionSoundEnabled = () => {},
  onChangeDayShape = () => {},
  onChangeHabitCompletionIcon = () => {},
  onClose,
  visible,
  streakRemindersEnabled = false,
  streakReminderTime = '20:00',
  isPremium = false,
  isLoading = false,
  onToggleStreakReminders = () => {},
  onChangeStreakReminderTime = () => {},
  onPremiumUpsell,
  onExportHabitsData = () => {},
  archivedHabitsCount = 0,
  settingsDocument,
}: SettingsModalProps) {
  const {
    habitSortMode,
    showGradientFill,
    setShowGradientFill,
    setHabitSortMode,
    view,
    setView,
    handleClose,
  } = useSettingsModalLogic({
    onClose,
    settingsDocument,
    visible,
  });
  const insets = useSafeAreaInsets();
  const { isDark } = useThemeColors();
  const colors = getSettingsColors(isHighContrastActive, isDark);

  const handleSortSelect = useCallback(
    (mode: HabitSortMode) => {
      void setHabitSortMode(mode);
      setView('settings');
    },
    [setHabitSortMode, setView]
  );

  if (!visible) return null;

  if (view === 'archived') {
    return (
      <Modal
        accessibilityViewIsModal
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

  if (view === 'sort') {
    return (
      <Modal
        accessibilityViewIsModal
        animationType='slide'
        visible={visible}
        onRequestClose={() => setView('settings')}
      >
        <SortPicker
          currentMode={habitSortMode as HabitSortMode}
          onBack={() => setView('settings')}
          onSelect={handleSortSelect}
        />
      </Modal>
    );
  }

  return (
    <Modal
      accessibilityViewIsModal
      animationType='slide'
      visible={visible}
      onRequestClose={handleClose}
    >
      <View
        className='flex-1 bg-background'
        style={{ backgroundColor: colors.background }}
      >
        {isLoading ? (
          <SettingsModalSkeleton />
        ) : (
          <>
            <SettingsHeader
              colors={colors}
              paddingTop={insets.top + 8}
              onClose={handleClose}
            />
            <SettingsContent
              archivedHabitsCount={archivedHabitsCount}
              bottomInset={insets.bottom}
              colors={colors}
              completionSoundEnabled={completionSoundEnabled}
              dayShape={dayShape}
              habitCompletionIcon={habitCompletionIcon}
              habitSortMode={habitSortMode}
              isHighContrastActive={isHighContrastActive}
              isPremium={isPremium}
              showGradientFill={showGradientFill}
              streakRemindersEnabled={streakRemindersEnabled}
              streakReminderTime={streakReminderTime}
              onChangeCompletionSoundEnabled={onChangeCompletionSoundEnabled}
              onChangeDayShape={onChangeDayShape}
              onChangeHabitCompletionIcon={onChangeHabitCompletionIcon}
              onChangeShowGradientFill={setShowGradientFill}
              onChangeStreakReminderTime={onChangeStreakReminderTime}
              onOpenArchivedHabits={() => setView('archived')}
              onExportHabitsData={onExportHabitsData}
              onOpenSortPicker={() => setView('sort')}
              onPremiumUpsell={onPremiumUpsell}
              onToggleStreakReminders={onToggleStreakReminders}
            />
          </>
        )}
      </View>
    </Modal>
  );
}

export default function SettingsModal(props: SettingsModalProps) {
  return (
    <ErrorBoundary
      fallback={
        <Modal
          accessibilityViewIsModal
          animationType='slide'
          visible={props.visible}
          onRequestClose={props.onClose}
        >
          <ScreenErrorFallback
            error={null}
            screenName='Settings'
            onGoBack={props.onClose}
            onRetry={() => {}}
          />
        </Modal>
      }
    >
      <SettingsModalContent {...props} />
    </ErrorBoundary>
  );
}
