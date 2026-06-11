/* eslint-disable max-lines, max-lines-per-function */
/**
 * SettingsModal Component
 */

import React, { useCallback } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ErrorBoundary, ScreenErrorFallback } from '../ErrorBoundary';
import ArchivedHabitsModal from '../ArchivedHabitsModal';
import Modal from '../Modal';
import { SettingsModalSkeleton } from '../SkeletonLoader';
import { useSettingsModalLogic } from './SettingsModal.hooks';
import { getSettingsColors } from './colors';
import { SettingsHeader } from './SettingsHeader';
import { AccountPage } from './AccountPage';
import { SettingsContent } from './SettingsContent';
import { SortPicker } from './SortPicker';
import { useThemeColors } from '../../theme/ThemeContext';
import type { HabitSortMode } from '../../features/habits/types';
import type { SettingsModalProps } from './types';

const fullScreenModalStyle = {
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0,
};

function SettingsModalContent({
  completionSoundEnabled = false,
  completionSoundType = 'chime',
  dayShape = 'square',
  habitCompletionIcon = 'chain',
  isHighContrastActive = false,
  onChangeCompletionSoundEnabled = () => {},
  onChangeCompletionSoundType = () => {},
  onChangeDayShape = () => {},
  onChangeHabitCompletionIcon = () => {},
  onChangeStickyCalendarHeader = () => {},
  onClose,
  visible,
  streakRemindersEnabled = false,
  streakReminderTime = '20:00',
  stickyCalendarHeader = false,
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
    compactView,
    setCompactView,
    darkModePreference,
    setDarkModePreference,
    highContrastMode,
    setHighContrastMode,
    habitSortMode,
    showGradientFill,
    setShowGradientFill,
    showStreakConnections,
    setShowStreakConnections,
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
    },
    [setHabitSortMode]
  );

  const handleRequestClose = useCallback(() => {
    if (view !== 'settings') {
      setView('settings');
      return;
    }
    onClose();
  }, [onClose, setView, view]);

  return (
    <Modal
      disableBackdropClose
      disableGestureClose
      backdropOpacity={0}
      variant='fullScreen'
      visible={visible}
      onClose={handleRequestClose}
      style={fullScreenModalStyle}
    >
      {view === 'archived' ? (
        <View className='flex-1' style={{ backgroundColor: colors.background }}>
          <ArchivedHabitsModal
            onBack={() => setView('settings')}
            onClose={handleClose}
          />
        </View>
      ) : null}

      {view === 'account' ? (
        <View className='flex-1' style={{ backgroundColor: colors.background }}>
          <AccountPage
            highContrastMode={isHighContrastActive}
            isPremium={isPremium}
            onBack={() => setView('settings')}
            onClose={handleClose}
            onPremiumUpsell={onPremiumUpsell}
          />
        </View>
      ) : null}

      {view === 'sort' ? (
        <SortPicker
          currentMode={habitSortMode as HabitSortMode}
          onBack={() => setView('settings')}
          onSelect={handleSortSelect}
        />
      ) : null}

      {view === 'settings' ? (
        <View className='flex-1' style={{ backgroundColor: colors.background }}>
          {isLoading ? (
            <SettingsModalSkeleton />
          ) : (
            <>
              <SettingsHeader colors={colors} onClose={handleClose} />
              <SettingsContent
                archivedHabitsCount={archivedHabitsCount}
                bottomInset={insets.bottom}
                colors={colors}
                compactView={compactView}
                onChangeCompactView={setCompactView}
                completionSoundEnabled={completionSoundEnabled}
                completionSoundType={completionSoundType}
                darkModePreference={darkModePreference}
                onChangeDarkModePreference={setDarkModePreference}
                highContrastEnabled={highContrastMode}
                onChangeHighContrast={setHighContrastMode}
                dayShape={dayShape}
                habitCompletionIcon={habitCompletionIcon}
                habitSortMode={habitSortMode}
                isHighContrastActive={isHighContrastActive}
                isPremium={isPremium}
                showGradientFill={showGradientFill}
                showStreakConnections={showStreakConnections}
                stickyCalendarHeader={stickyCalendarHeader}
                streakRemindersEnabled={streakRemindersEnabled}
                streakReminderTime={streakReminderTime}
                onChangeCompletionSoundEnabled={onChangeCompletionSoundEnabled}
                onChangeCompletionSoundType={onChangeCompletionSoundType}
                onChangeDayShape={onChangeDayShape}
                onChangeHabitCompletionIcon={onChangeHabitCompletionIcon}
                onChangeShowGradientFill={setShowGradientFill}
                onChangeShowStreakConnections={setShowStreakConnections}
                onChangeStickyCalendarHeader={onChangeStickyCalendarHeader}
                onChangeStreakReminderTime={onChangeStreakReminderTime}
                onOpenAccount={() => setView('account')}
                onOpenArchivedHabits={() => setView('archived')}
                onExportHabitsData={onExportHabitsData}
                onOpenSortPicker={() => setView('sort')}
                onPremiumUpsell={onPremiumUpsell}
                onToggleStreakReminders={onToggleStreakReminders}
              />
            </>
          )}
        </View>
      ) : null}
    </Modal>
  );
}

export default function SettingsModal(props: SettingsModalProps) {
  return (
    <ErrorBoundary
      fallback={
        <Modal
          disableBackdropClose
          disableGestureClose
          backdropOpacity={0}
          variant='fullScreen'
          visible={props.visible}
          onClose={props.onClose}
          style={fullScreenModalStyle}
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
