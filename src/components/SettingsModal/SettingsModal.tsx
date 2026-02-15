/* eslint-disable max-lines, max-lines-per-function */
/**
 * SettingsModal Component
 */

import React from 'react';
import { Modal, View } from 'react-native';

import { useQuery } from 'convex/react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { SettingsModalProps } from './types';
import ArchivedHabitsModal from '../ArchivedHabitsModal';
import { ErrorBoundary, ScreenErrorFallback } from '../ErrorBoundary';
import { SettingsContent } from './SettingsContent';
import { SettingsHeader } from './SettingsHeader';
import { SettingsModalSkeleton } from '../SkeletonLoader';
import { api } from '../../../convex/_generated/api';
import { getSettingsColors } from './colors';
import { useSettingsModalLogic } from './SettingsModal.hooks';
import { useThemeColors } from '../../theme/ThemeContext';

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
  onClose,
  visible,
  streakRemindersEnabled = false,
  streakReminderTime = '20:00',
  isPremium = false,
  isLoading = false,
  onToggleStreakReminders = () => {},
  onChangeStreakReminderTime = () => {},
  onPremiumUpsell,
}: SettingsModalProps) {
  const {
    darkModePreference,
    setDarkModePreference,
    showGradientFill,
    setShowGradientFill,
    view,
    setView,
    handleClose,
  } = useSettingsModalLogic({
    onClose,
    visible,
  });
  const insets = useSafeAreaInsets();
  const { isDark } = useThemeColors();
  const colors = getSettingsColors(isHighContrastActive, isDark);
  const archivedHabits = useQuery(api.habits.listArchived);
  const archivedHabitsCount = archivedHabits?.length ?? 0;

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

  return (
    <Modal animationType='slide' visible={visible} onRequestClose={handleClose}>
      accessibilityViewIsModal
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
              colors={colors}
              completionSoundEnabled={completionSoundEnabled}
              completionSoundType={completionSoundType}
              darkModePreference={darkModePreference}
              dayShape={dayShape}
              habitCompletionIcon={habitCompletionIcon}
              isHighContrastActive={isHighContrastActive}
              isPremium={isPremium}
              showGradientFill={showGradientFill}
              streakRemindersEnabled={streakRemindersEnabled}
              streakReminderTime={streakReminderTime}
              onChangeCompletionSoundEnabled={onChangeCompletionSoundEnabled}
              onChangeCompletionSoundType={onChangeCompletionSoundType}
              onChangeDarkModePreference={setDarkModePreference}
              onChangeDayShape={onChangeDayShape}
              onChangeHabitCompletionIcon={onChangeHabitCompletionIcon}
              onChangeShowGradientFill={setShowGradientFill}
              onChangeStreakReminderTime={onChangeStreakReminderTime}
              onOpenArchivedHabits={() => setView('archived')}
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
