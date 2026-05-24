import { useCallback } from 'react';
import type { RefObject } from 'react';
import {
  Keyboard,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import type { View as ViewType } from 'react-native';
import type { ScrollView as ScrollViewType } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { CreateHabitFormCentered } from './CreateHabitFormCentered';
import { ScrollForMoreHint } from './ScrollForMoreHint';
import { HABIT_COLORS } from '../constants';
import type { useCenteredFormCallbacks } from '../hooks/useCenteredFormCallbacks';
import type { useHabitForm } from '../hooks/useHabitForm';

interface CreateHabitScrollContentProps {
  form: ReturnType<typeof useHabitForm>;
  callbacks: ReturnType<typeof useCenteredFormCallbacks>;
  scrollViewRef: RefObject<ScrollViewType | null>;
  scrollContentRef: RefObject<ViewType | null>;
  reminderSectionRef: RefObject<ViewType | null>;
  showNameError: boolean;
}

export function CreateHabitScrollContent({
  form,
  callbacks,
  scrollViewRef,
  scrollContentRef,
  reminderSectionRef,
  showNameError,
}: CreateHabitScrollContentProps) {
  const scrollY = useSharedValue(0);
  const viewportHeight = useSharedValue(0);
  const contentHeight = useSharedValue(0);

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      scrollY.value = e.nativeEvent.contentOffset.y;
    },
    [scrollY]
  );

  return (
    <View className='flex-1'>
      <ScrollView
        ref={scrollViewRef}
        className='flex-1'
        contentContainerStyle={{ paddingBottom: 120 }}
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
        <Pressable accessible={false} onPress={Keyboard.dismiss}>
          <View ref={scrollContentRef} collapsable={false}>
            <CreateHabitFormCentered
              autoFocus
              colors={HABIT_COLORS}
              habitName={form.habitName}
              progressEmojis={form.progressEmojis}
              reminderEnabled={form.remindersEnabled}
              reminderSectionRef={reminderSectionRef}
              reminderTime={form.reminderTime}
              selectedColor={form.selectedColor}
              selectedEmoji={form.selectedEmoji}
              showNameError={showNameError}
              streakGoal={form.streakGoal}
              strengthAlgorithm={form.strengthAlgorithm}
              onAdvancedExpand={() =>
                scrollViewRef.current?.scrollToEnd({ animated: true })
              }
              onColorSelect={callbacks.handleColorSelect}
              onEmojiSelect={callbacks.handleEmojiSelect}
              onHabitNameChange={callbacks.handleNameChange}
              onProgressEmojisChange={form.setProgressEmojis}
              onReminderTimeChange={callbacks.handleReminderTimeChange}
              onReminderToggle={callbacks.handleReminderToggle}
              onStreakGoalChange={form.setStreakGoal}
              onStrengthAlgorithmChange={form.setStrengthAlgorithm}
              onSubmit={callbacks.handleSubmit}
            />
          </View>
        </Pressable>
      </ScrollView>
      <ScrollForMoreHint
        contentHeight={contentHeight}
        scrollY={scrollY}
        viewportHeight={viewportHeight}
      />
    </View>
  );
}
