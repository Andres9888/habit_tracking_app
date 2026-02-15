/** HabitEditScreen - Matches Create modal style (bottom sheet, stagger animations) */

import { Keyboard, Modal, Pressable, ScrollView, View } from 'react-native';
import { KeyboardAvoidingView, Platform } from 'react-native';

import Animated, { FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { HabitEditScreenProps } from './types';
import { CustomizeSection } from './CustomizeSection';
import { DangerZone } from './DangerZone';
import { EditHeader } from './EditHeader';
import { HabitEditSkeleton } from './HabitEditSkeleton';
import { NameInputSection } from './NameInputSection';
import { ScreenErrorBoundary } from '../../components/ErrorBoundary';
import { SectionLabel } from './SectionLabel';
import { useHabitEditScreen } from './useHabitEditScreen';
import { useThemeColors } from '../../theme/ThemeContext';

// eslint-disable-next-line max-lines-per-function
function HabitEditScreenContent({
  visible,
  habitId,
  onClose,
}: HabitEditScreenProps) {
  const insets = useSafeAreaInsets();
  const state = useHabitEditScreen({ habitId, onClose });
  const { colors: themeColors } = useThemeColors();
  return (
    <Modal
      transparent
      animationType='slide'
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className='flex-1'
      >
        <View className='flex-1 bg-black/50'>
          <View
            className='flex-1 overflow-hidden rounded-t-3xl shadow-2xl'
            style={{ backgroundColor: themeColors.background }}
          >
            {state.isLoading ? (
              <View style={{ paddingTop: Math.max(insets.top + 4, 12) }}>
                <HabitEditSkeleton />
              </View>
            ) : (
              <>
            <EditHeader
              canSave={state.habitName.trim().length >= 2}
              isSaving={state.isSaving}
              paddingTop={Math.max(insets.top + 4, 12)}
              onCancel={() => {
                state.triggerSelection();
                onClose();
              }}
              onSave={() => void state.handleSave()}
            />
            <ScrollView
              className='flex-1'
              contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
              keyboardDismissMode='on-drag'
              keyboardShouldPersistTaps='handled'
              showsVerticalScrollIndicator={false}
            >
              <Pressable onPress={Keyboard.dismiss}>
                <View className='pt-4'>
                  <NameInputSection
                    habitName={state.habitName}
                    onChangeText={state.setHabitName}
                  />
                </View>
                <SectionLabel delay={220} text='CUSTOMIZE' />
                <Animated.View
                  className='px-4'
                  entering={FadeInUp.delay(280).springify().damping(18)}
                >
                  <CustomizeSection
                    habitName={state.habitName}
                    remindersEnabled={state.remindersEnabled}
                    reminderTime={state.reminderTime}
                    selectedColor={state.selectedColor}
                    selectedEmoji={state.selectedEmoji}
                    onColorSelect={state.handleColorSelect}
                    onEmojiSelect={state.handleEmojiSelect}
                    onReminderTimeChange={state.handleReminderTimeChange}
                    onReminderToggle={state.handleReminderToggle}
                  />
                </Animated.View>
                <SectionLabel delay={340} text='DANGER ZONE' variant='danger' />
                <Animated.View
                  className='mx-4 rounded-2xl bg-red-50/50 p-4'
                  entering={FadeInUp.delay(400).springify().damping(18)}
                >
                  <DangerZone
                    onArchive={state.handleArchive}
                    onDelete={state.handleDelete}
                  />
                </Animated.View>
              </Pressable>
            </ScrollView>
            </>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export default function HabitEditScreen(props: HabitEditScreenProps) {
  if (!props.visible || !props.habitId) return null;

  return (
    <ScreenErrorBoundary screenName="Edit Habit" onGoBack={props.onClose}>
      <HabitEditScreenContent {...props} />
    </ScreenErrorBoundary>
  );
}
