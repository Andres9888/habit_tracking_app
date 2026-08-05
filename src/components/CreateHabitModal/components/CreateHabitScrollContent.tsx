import type { RefObject } from 'react';
import { Keyboard, Pressable, ScrollView, View } from 'react-native';
import type {
  ScrollView as ScrollViewType,
  View as ViewType,
} from 'react-native';
import STRINGS from '@/constants/strings';
import { spacing } from '@/theme/spacing';
import { HabitFormBody } from './HabitFormBody';
import { ScrollForMoreHint } from './ScrollForMoreHint';
import { useCreateHabitScrollMetrics } from './useCreateHabitScrollMetrics';
import { HABIT_COLORS } from '../constants';
import type { useCenteredFormCallbacks } from '../hooks/useCenteredFormCallbacks';
import type { useHabitForm } from '../hooks/useHabitForm';
import { useHabitNamePlaceholder } from '../hooks/useHabitNamePlaceholder';

interface CreateHabitScrollContentProps {
  active: boolean;
  visible: boolean;
  form: ReturnType<typeof useHabitForm>;
  callbacks: ReturnType<typeof useCenteredFormCallbacks>;
  scrollViewRef: RefObject<ScrollViewType | null>;
  scrollContentRef: RefObject<ViewType | null>;
  reminderSectionRef: RefObject<ViewType | null>;
  showNameError: boolean;
}

export function CreateHabitScrollContent({
  active,
  visible,
  form,
  callbacks,
  scrollViewRef,
  scrollContentRef,
  reminderSectionRef,
  showNameError,
}: CreateHabitScrollContentProps) {
  const { isReady: isPlaceholderReady, placeholder: habitNamePlaceholder } =
    useHabitNamePlaceholder(active);
  const { contentHeight, handleScroll, scrollY, viewportHeight } =
    useCreateHabitScrollMetrics();

  return (
    <View className='flex-1'>
      <ScrollView
        ref={scrollViewRef}
        className='flex-1'
        contentContainerStyle={{ paddingBottom: spacing.xl }}
        keyboardDismissMode='on-drag'
        keyboardShouldPersistTaps='handled'
        scrollEventThrottle={16}
        onContentSizeChange={(_w, h) => {
          contentHeight.value = h;
        }}
        onLayout={(e) => {
          viewportHeight.value = e.nativeEvent.layout.height;
        }}
        onScroll={handleScroll}
      >
        <View ref={scrollContentRef} collapsable={false}>
          <Pressable accessible={false} onPress={Keyboard.dismiss}>
            <HabitFormBody
              autoFocus={visible}
              colors={HABIT_COLORS}
              effortMinutes={form.effortMinutes}
              habitName={form.habitName}
              isNewHabit
              placeholder={isPlaceholderReady ? habitNamePlaceholder : ''}
              title={STRINGS.CREATE_HABIT.nameTitle}
              progressEmojis={form.progressEmojis}
              reminderEnabled={form.remindersEnabled}
              reminderSectionRef={reminderSectionRef}
              reminderTime={form.reminderTime}
              selectedColor={form.selectedColor}
              selectedEmoji={form.selectedEmoji}
              showNameError={showNameError}
              snapReminderDefaultToPreset
              streakGoal={form.streakGoal}
              strengthAlgorithm={form.strengthAlgorithm}
              onAdvancedExpand={() =>
                scrollViewRef.current?.scrollToEnd({ animated: true })
              }
              onColorSelect={callbacks.handleColorSelect}
              onEffortMinutesChange={form.setEffortMinutes}
              onEmojiSelect={callbacks.handleEmojiSelect}
              onHabitNameChange={callbacks.handleNameChange}
              onProgressEmojisChange={form.setProgressEmojis}
              onReminderTimeChange={callbacks.handleReminderTimeChange}
              onReminderToggle={callbacks.handleReminderToggle}
              onStreakGoalChange={form.setStreakGoal}
              onStrengthAlgorithmChange={form.setStrengthAlgorithm}
            />
          </Pressable>
        </View>
      </ScrollView>
      <ScrollForMoreHint
        contentHeight={contentHeight}
        scrollY={scrollY}
        viewportHeight={viewportHeight}
      />
    </View>
  );
}
