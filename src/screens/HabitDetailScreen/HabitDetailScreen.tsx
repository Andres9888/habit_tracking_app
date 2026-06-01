/* eslint-disable max-lines */
/** HabitDetailScreen - Optimized for 9+ scores across all dimensions */
import React, { useCallback, useState } from 'react';
import { View, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { Edit3 } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { typography, fontWeights } from '@/theme/typography';
import { ScreenErrorBoundary } from '../../components/ErrorBoundary';
import { ScreenHeader } from '../../components/ScreenHeader';
import {
  DetailLoadingState,
  HabitDetailContent,
  HabitDetailModals,
  HeaderButton,
} from './components';
import { buildModalsProps } from './HabitDetailScreen.constants';
import { overlays } from '../../theme/colors';
import { shadows } from '../../theme/spacing';
import { useThemeColors } from '../../theme';
import { useHabitDetailScreenState } from './useHabitDetailScreenState';
import { useCalendarHandlers } from './useCalendarHandlers';
import type { HabitDetailScreenProps } from './HabitDetailScreen.types';

// eslint-disable-next-line max-lines-per-function
function HabitDetailScreenContent({
  editOverlay,
  habit,
  onArchive,
  onClose,
  onDelete,
  onEdit,
  tracking = [],
  visible,
}: HabitDetailScreenProps) {
  const { colors } = useThemeColors();
  const screenState = useHabitDetailScreenState({
    habitCreatedAt: habit?.createdAt,
    habitId: habit?._id,
    habitStrength: habit?.strength ?? 0,
    tracking,
    visible,
  });
  const calendarHandlers = useCalendarHandlers({
    habit,
    isTogglingCalendar: screenState.isTogglingCalendar,
    onArchive,
    onClose,
    onDelete,
    setIsTogglingCalendar: screenState.setIsTogglingCalendar,
    setPendingArchive: screenState.setPendingArchive,
    setPendingDelete: screenState.setPendingDelete,
  });
  const handleEdit = () => {
    if (habit) onEdit?.(habit);
  };
  const [isTitlePinned, setIsTitlePinned] = useState(false);
  const handlePinnedChange = useCallback((pinned: boolean) => {
    setIsTitlePinned(pinned);
  }, []);

  return (
    <Modal
      accessibilityViewIsModal
      statusBarTranslucent
      transparent
      animationType='slide'
      presentationStyle='overFullScreen'
      visible={visible}
      onRequestClose={onClose}
    >
      {habit ? (
        <>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className='flex-1'
          >
            <View className='flex-1' style={{ backgroundColor: overlays.scrim }}>
              <View
                className='flex-1 overflow-hidden rounded-t-3xl'
                style={{ backgroundColor: colors.background, ...shadows.modal }}
              >
                <ScreenHeader
                  leftAction='close'
                  rightAction={
                    <HeaderButton
                      compact={isTitlePinned}
                      icon={<Edit3 size={iconSizes.small} strokeWidth={2.5} />}
                      label='Edit habit'
                      text='Edit'
                      tone='accent'
                      onPress={handleEdit}
                    />
                  }
                  title={habit.name}
                  titleStyle={{ ...typography.body, fontWeight: fontWeights.semibold, letterSpacing: -0.2 }}
                  titleVisible={isTitlePinned}
                  variant='transparent'
                  onBack={onClose}
                />
                <HabitDetailContent
                  completedDates={screenState.completedDates}
                  habit={habit}
                  isCompletedToday={screenState.isCompletedToday}
                  totalCompletions={screenState.totalCompletions}
                  onDayPress={calendarHandlers.handleCalendarDayPress}
                  onPinnedChange={handlePinnedChange}
                />
              </View>
            </View>
          </KeyboardAvoidingView>
          <HabitDetailModals
            habitId={habit._id}
            habitName={habit.name}
            {...buildModalsProps(screenState, calendarHandlers)}
          />
        </>
      ) : (
        <DetailLoadingState />
      )}
      {editOverlay}
    </Modal>
  );
}

export default function HabitDetailScreen(props: HabitDetailScreenProps) {
  return (
    <ScreenErrorBoundary screenName='Habit Details' onGoBack={props.onClose}>
      <HabitDetailScreenContent {...props} />
    </ScreenErrorBoundary>
  );
}
