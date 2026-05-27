/* eslint-disable max-lines */
/** HabitEditScreen - Matches Create modal style (bottom sheet, stagger animations) */
import { useCallback, useRef } from 'react';
import {
  findNodeHandle,
  Keyboard,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSwipeDismiss } from '../../components/CreateHabitModal/hooks/useSwipeDismiss';
import { ScreenErrorBoundary } from '../../components/ErrorBoundary';
import { useThemeColors } from '../../theme/ThemeContext';
import { borderRadius } from '../../theme/spacing';
import { AdvancedOptionsSection } from '../../components/AdvancedOptions';
import { EditHeader } from './EditHeader';
import { HabitEditSkeleton } from './HabitEditSkeleton';
import { NameInputSection } from './NameInputSection';
import { CustomizeSection } from './CustomizeSection';
import { useHabitEditScreen } from './useHabitEditScreen';
import type { HabitEditScreenProps } from './types';

// eslint-disable-next-line max-lines-per-function
function HabitEditScreenContent({
  visible,
  habitId,
  onClose,
  onHabitRemoved,
}: HabitEditScreenProps) {
  const insets = useSafeAreaInsets();
  const { colors: themeColors } = useThemeColors();
  const { animateOut, backdropStyle, panGesture, sheetStyle } = useSwipeDismiss(
    { visible, onClose }
  );
  const state = useHabitEditScreen({
    habitId,
    onClose: animateOut,
    onHabitRemoved,
  });
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollContentRef = useRef<View>(null);
  const reminderSectionRef = useRef<View>(null);

  const handleReminderToggle = useCallback(
    (enabled: boolean) => {
      state.handleReminderToggle(enabled);
      if (!enabled) return;
      // Wait for expanded reminder content to finish laying out, then scroll
      // so the daily-reminder container's top sits at the top of the viewport.
      setTimeout(() => {
        const node = reminderSectionRef.current;
        const contentNode = scrollContentRef.current;
        if (!node || !contentNode) return;
        const contentHandle = findNodeHandle(contentNode);
        if (contentHandle == null) return;
        node.measureLayout(
          contentHandle,
          (_x, y) => {
            scrollViewRef.current?.scrollTo({
              y: Math.max(0, y - 8),
              animated: true,
            });
          },
          () => {}
        );
      }, 250);
    },
    [state]
  );

  return (
    <Modal
      accessibilityViewIsModal
      statusBarTranslucent
      transparent
      animationType='none'
      visible={visible}
      onRequestClose={animateOut}
    >
      <View className='flex-1'>
        <Pressable style={StyleSheet.absoluteFill} onPress={animateOut}>
          <Animated.View className='flex-1 bg-black' style={backdropStyle} />
        </Pressable>
        <GestureDetector gesture={panGesture}>
          <Animated.View
            className='overflow-hidden rounded-t-3xl shadow-2xl'
            style={[
              styles.sheet,
              sheetStyle,
              { backgroundColor: themeColors.surface },
            ]}
          >
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              className='flex-1'
            >
              {state.isLoading ? (
                <View style={{ paddingTop: Math.max(insets.top + 4, 12) }}>
                  <HabitEditSkeleton />
                </View>
              ) : (
                <View style={{ flex: 1 }}>
                  <View style={styles.dragHandleRow}>
                    <View
                      style={[
                        styles.dragHandle,
                        { backgroundColor: themeColors.gray[300] },
                      ]}
                    />
                  </View>
                  <EditHeader
                    canSave={state.habitName.trim().length > 0}
                    isSaving={state.isSaving}
                    paddingTop={Math.max(insets.top + 4, 12)}
                    onCancel={() => {
                      state.triggerSelection();
                      animateOut();
                    }}
                    onSave={() => void state.handleSave()}
                  />
                  <ScrollView
                    ref={scrollViewRef}
                    className='flex-1'
                    contentContainerStyle={{
                      paddingBottom: insets.bottom + 32,
                    }}
                    keyboardDismissMode='on-drag'
                    keyboardShouldPersistTaps='handled'
                    showsVerticalScrollIndicator={false}
                  >
                    <View ref={scrollContentRef} collapsable={false}>
                      <Pressable onPress={Keyboard.dismiss}>
                      <NameInputSection
                        habitName={state.habitName}
                        onChangeText={state.setHabitName}
                      />
                      <View className='px-6'>
                        <CustomizeSection
                          habitName={state.habitName}
                          remindersEnabled={state.remindersEnabled}
                          reminderSectionRef={reminderSectionRef}
                          reminderTime={state.reminderTime}
                          selectedColor={state.selectedColor}
                          selectedEmoji={state.selectedEmoji}
                          onColorSelect={state.handleColorSelect}
                          onEmojiSelect={state.handleEmojiSelect}
                          onReminderTimeChange={state.handleReminderTimeChange}
                          onReminderToggle={handleReminderToggle}
                        />
                      </View>
                      <AdvancedOptionsSection
                        growthType={state.growthType}
                        progressEmojis={state.progressEmojis}
                        streakGoal={state.streakGoal}
                        strengthAlgorithm={state.strengthAlgorithm}
                        onExpand={() =>
                          scrollViewRef.current?.scrollToEnd({ animated: true })
                        }
                        onProgressEmojisChange={
                          state.handleProgressEmojisChange
                        }
                        onStreakGoalChange={state.handleStreakGoalChange}
                        onStrengthAlgorithmChange={
                          state.handleStrengthAlgorithmChange
                        }
                      />
                      </Pressable>
                    </View>
                  </ScrollView>
                </View>
              )}
            </KeyboardAvoidingView>
          </Animated.View>
        </GestureDetector>
      </View>
    </Modal>
  );
}

export default function HabitEditScreen(props: HabitEditScreenProps) {
  if (!props.visible || !props.habitId) return null;

  return (
    <ScreenErrorBoundary screenName='Edit Habit' onGoBack={props.onClose}>
      <HabitEditScreenContent {...props} />
    </ScreenErrorBoundary>
  );
}

const styles = StyleSheet.create({
  dragHandle: { borderRadius: borderRadius.xs, height: 5, width: 36 },
  dragHandleRow: { alignItems: 'center', paddingBottom: 4, paddingTop: 8 },
  sheet: StyleSheet.absoluteFillObject,
});
