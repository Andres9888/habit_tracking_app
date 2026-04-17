/* eslint-disable max-lines */
/** HabitEditScreen - Matches Create modal style (bottom sheet, stagger animations) */
import {
  Keyboard,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSwipeDismiss } from '../../components/CreateHabitModal/hooks/useSwipeDismiss';
import { ScreenErrorBoundary } from '../../components/ErrorBoundary';
import { useThemeColors } from '../../theme/ThemeContext';
import { borderRadius, shadows } from '../../theme/spacing';
import { EditHeader } from './EditHeader';
import { HabitEditSkeleton } from './HabitEditSkeleton';
import { NameInputSection } from './NameInputSection';
import { CustomizeSection } from './CustomizeSection';
import { DangerZone } from './DangerZone';
import { SectionLabel } from './SectionLabel';
import { StreakGoalSection } from './StreakGoalSection';
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
                <Animated.View
                  entering={FadeIn.duration(300)}
                  style={{ flex: 1 }}
                >
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
                    className='flex-1'
                    contentContainerStyle={{
                      paddingBottom: insets.bottom + 32,
                    }}
                    keyboardDismissMode='on-drag'
                    keyboardShouldPersistTaps='handled'
                    showsVerticalScrollIndicator={false}
                  >
                    <Pressable onPress={Keyboard.dismiss}>
                      <NameInputSection
                        habitName={state.habitName}
                        onChangeText={state.setHabitName}
                      />
                      <Animated.View
                        className='px-6'
                        entering={FadeInUp.delay(280).springify().damping(18)}
                      >
                        <CustomizeSection
                          habitName={state.habitName}
                          progressEmojis={state.progressEmojis}
                          remindersEnabled={state.remindersEnabled}
                          reminderTime={state.reminderTime}
                          selectedColor={state.selectedColor}
                          selectedEmoji={state.selectedEmoji}
                          strengthAlgorithm={state.strengthAlgorithm}
                          onColorSelect={state.handleColorSelect}
                          onEmojiSelect={state.handleEmojiSelect}
                          onProgressEmojisChange={
                            state.handleProgressEmojisChange
                          }
                          onReminderTimeChange={state.handleReminderTimeChange}
                          onReminderToggle={state.handleReminderToggle}
                          onStrengthAlgorithmChange={
                            state.handleStrengthAlgorithmChange
                          }
                        />
                        <StreakGoalSection
                          streakGoal={state.streakGoal}
                          onStreakGoalChange={state.handleStreakGoalChange}
                        />
                      </Animated.View>
                      <SectionLabel
                        delay={400}
                        text='DANGER ZONE'
                        variant='danger'
                      />
                      <Animated.View
                        className='mx-6 rounded-2xl p-4'
                        entering={FadeInUp.delay(460).springify().damping(18)}
                        style={{
                          backgroundColor: themeColors.card,
                          ...shadows.card,
                        }}
                      >
                        <DangerZone
                          onArchive={state.handleArchive}
                          onDelete={state.handleDelete}
                        />
                      </Animated.View>
                    </Pressable>
                  </ScrollView>
                </Animated.View>
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
