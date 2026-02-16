/* eslint-disable max-lines, max-lines-per-function */
/**
 * SettingsModal Component
 * 
 * Full-screen modal for app-wide settings and preferences.
 * 
 * **Trigger:** Gear icon in main navigation
 * 
 * **Display:**
 * - App preferences (dark mode, sounds, visual settings)
 * - Habit display options (completion icon, day shape, gradient fill)
 * - Premium features (streak reminders)
 * - Navigation to archived/paused habits
 * 
 * **Actions:**
 * - Toggle dark mode (Auto/Light/Dark)
 * - Toggle completion sound and select sound type
 * - Change habit completion icon (chain/checkmark)
 * - Change day shape (square/circle)
 * - Toggle gradient fill on habit cards
 * - Configure streak reminders (Premium)
 * - Navigate to archived habits (separate modal)
 * - Close settings
 * 
 * **Modal Type:** React Native Modal (slide animation)
 * 
 * **Lifecycle:**
 * - Opens: visible prop set to true
 * - Closes: onClose callback via X button or back gesture
 * - Sub-navigation: Can navigate to ArchivedHabitsModal (changes view state)
 * 
 * **Pattern:** Uses RN Modal directly (not shared Modal component)
 * Has internal view state for navigating to archived habits sub-screen
 */

import React from 'react';
import { Modal, View } from 'react-native';
import { useQuery } from 'convex/react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api } from '../../../convex/_generated/api';
import { ErrorBoundary, ScreenErrorFallback } from '../ErrorBoundary';
import ArchivedHabitsModal from '../ArchivedHabitsModal';
import { SettingsModalSkeleton } from '../SkeletonLoader';
import { useSettingsModalLogic } from './SettingsModal.hooks';
import { getSettingsColors } from './colors';
import { SettingsHeader } from './SettingsHeader';
import { SettingsContent } from './SettingsContent';
import { useThemeColors } from '../../theme/ThemeContext';
import type { SettingsModalProps } from './types';

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
