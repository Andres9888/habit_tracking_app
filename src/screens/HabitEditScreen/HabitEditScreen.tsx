/* eslint-disable max-lines */
/**
 * HabitEditScreen - Full-screen slide modal for editing a habit.
 *
 * Matches CreateHabitModal with an app-controlled full-screen slide so close
 * can play the entrance path in reverse before unmount.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  findNodeHandle,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenErrorBoundary } from '../../components/ErrorBoundary';
import Modal from '../../components/Modal';
import { EXIT_DURATIONS } from '../../components/Modal/Modal.constants';
import { useThemeColors } from '../../theme/ThemeContext';
import { spacing } from '../../theme/spacing';
import { HabitFormBody } from '../../components/CreateHabitModal/components/HabitFormBody';
import { ModalHeader } from '../../components/CreateHabitModal/components/ModalHeader';
import { HABIT_COLORS } from '../../components/CreateHabitModal/constants';
import { HabitEditSkeleton } from './HabitEditSkeleton';
import { useHabitEditScreen } from './useHabitEditScreen';
import type { HabitEditScreenProps } from './types';

// eslint-disable-next-line max-lines-per-function
function HabitEditScreenContent({
  visible,
  habitId,
  initialHabit,
  onClose,
  onHabitRemoved,
}: HabitEditScreenProps) {
  const insets = useSafeAreaInsets();
  const { colors: themeColors } = useThemeColors();
  // Dismiss the keyboard on every exit path (save-success, delete, cancel,
  // Android back) — the old swipe-dismiss did this in animateOut().
  const handleClose = useCallback(() => {
    Keyboard.dismiss();
    onClose();
  }, [onClose]);
  const state = useHabitEditScreen({
    habitId,
    initialHabit,
    onClose: handleClose,
    onHabitRemoved,
  });
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollContentRef = useRef<View>(null);
  const reminderSectionRef = useRef<View>(null);
  const [showNameError, setShowNameError] = useState(false);

  const handleNameChange = useCallback(
    (text: string) => {
      setShowNameError(false);
      state.setHabitName(text);
    },
    [state.setHabitName]
  );

  const handleReminderToggle = useCallback(
    (enabled: boolean) => {
      state.handleReminderToggle(enabled);
      if (!enabled) return;
      // Wait for expanded reminder content to lay out, then scroll its top
      // to the top of the viewport.
      setTimeout(() => {
        const node = reminderSectionRef.current;
        const contentNode = scrollContentRef.current;
        if (!node || !contentNode) return;
        const contentHandle = findNodeHandle(contentNode);
        if (contentHandle == null) return;
        node.measureLayout(
          contentHandle,
          (_x, y) =>
            scrollViewRef.current?.scrollTo({
              y: Math.max(0, y - 8),
              animated: true,
            }),
          () => {}
        );
      }, 250);
    },
    [state.handleReminderToggle]
  );

  return (
    <Modal
      disableBackdropClose
      disableGestureClose
      backdropOpacity={0}
      variant='fullScreen'
      visible={visible}
      onClose={handleClose}
      style={{
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
      }}
    >
      <View className='flex-1' style={{ backgroundColor: themeColors.surface }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className='flex-1'
        >
          {state.isLoading ? (
            <View style={{ paddingTop: Math.max(insets.top + 4, 12) }}>
              <HabitEditSkeleton />
            </View>
          ) : (
            <>
              <ModalHeader
                isEditMode
                habitName={state.habitName}
                isSaving={state.isSaving}
                onClose={handleClose}
                onSave={() => void state.handleSave()}
                onValidationError={() => setShowNameError(true)}
              />
              <ScrollView
                ref={scrollViewRef}
                className='flex-1'
                contentContainerStyle={{
                  paddingBottom: insets.bottom + spacing.xl,
                }}
                keyboardDismissMode='on-drag'
                keyboardShouldPersistTaps='handled'
                showsVerticalScrollIndicator={false}
              >
                <View ref={scrollContentRef} collapsable={false}>
                  <Pressable onPress={Keyboard.dismiss}>
                    <HabitFormBody
                      colors={HABIT_COLORS}
                      effortMinutes={state.effortMinutes}
                      growthType={state.growthType}
                      habitName={state.habitName}
                      initialEmojiLocked={false}
                      isNewHabit={false}
                      placeholder='Update your habit name'
                      progressEmojis={state.progressEmojis}
                      reminderEnabled={state.remindersEnabled}
                      reminderSectionRef={reminderSectionRef}
                      reminderTime={state.reminderTime}
                      selectedColor={state.selectedColor}
                      selectedEmoji={state.selectedEmoji}
                      showNameError={showNameError}
                      streakGoal={state.streakGoal}
                      strengthAlgorithm={state.strengthAlgorithm}
                      title='Edit your habit'
                      onAdvancedExpand={() =>
                        scrollViewRef.current?.scrollToEnd({ animated: true })
                      }
                      onColorSelect={state.handleColorSelect}
                      onEffortMinutesChange={state.handleEffortMinutesChange}
                      onEmojiSelect={state.handleEmojiSelect}
                      onHabitNameChange={handleNameChange}
                      onProgressEmojisChange={state.handleProgressEmojisChange}
                      onReminderTimeChange={state.handleReminderTimeChange}
                      onReminderToggle={handleReminderToggle}
                      onStreakGoalChange={state.handleStreakGoalChange}
                      onStrengthAlgorithmChange={
                        state.handleStrengthAlgorithmChange
                      }
                    />
                  </Pressable>
                </View>
              </ScrollView>
            </>
          )}
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

export default function HabitEditScreen(props: HabitEditScreenProps) {
  const [shouldRender, setShouldRender] = useState(
    props.visible && !!props.habitId
  );
  const [renderedHabitId, setRenderedHabitId] = useState(props.habitId);
  const [renderedInitialHabit, setRenderedInitialHabit] = useState(
    props.initialHabit
  );

  useEffect(() => {
    if (props.visible && props.habitId) {
      setRenderedHabitId(props.habitId);
      setRenderedInitialHabit(props.initialHabit);
      setShouldRender(true);
      return;
    }

    const timeout = setTimeout(() => {
      setShouldRender(false);
      setRenderedHabitId(null);
      setRenderedInitialHabit(null);
    }, EXIT_DURATIONS.fullScreen);

    return () => clearTimeout(timeout);
  }, [props.habitId, props.initialHabit, props.visible]);

  if (!shouldRender || !renderedHabitId) return null;

  return (
    <ScreenErrorBoundary screenName='Edit Habit' onGoBack={props.onClose}>
      <HabitEditScreenContent
        {...props}
        habitId={renderedHabitId}
        initialHabit={renderedInitialHabit}
      />
    </ScreenErrorBoundary>
  );
}
