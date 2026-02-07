/**
 * HabitEditScreen Component
 *
 * Full-screen modal for editing an existing habit's properties.
 * OPTIMIZED: Section cards, FadeInDown animations, type scale
 */

import { Keyboard, Modal, Pressable, ScrollView, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EditHeader } from './EditHeader';
import { NameInputSection } from './NameInputSection';
import { CustomizeSection } from './CustomizeSection';
import { DangerZone } from './DangerZone';
import { useHabitEditScreen } from './useHabitEditScreen';
import type { HabitEditScreenProps } from './types';

// eslint-disable-next-line max-lines-per-function
export default function HabitEditScreen({
  visible,
  habitId,
  onClose,
}: HabitEditScreenProps) {
  const insets = useSafeAreaInsets();
  const state = useHabitEditScreen({ habitId, onClose });

  if (!visible || !habitId) {
    return null;
  }

  return (
    <Modal animationType='slide' visible={visible} onRequestClose={onClose}>
      {/* OPTIMIZED: Gradient background */}
      <LinearGradient colors={['#faf9f7', '#f5f3f0']} style={{ flex: 1 }}>
        <EditHeader
          paddingTop={insets.top + 8}
          onCancel={() => {
            state.triggerSelection();
            onClose();
          }}
          onSave={() => void state.handleSave()}
        />

        <ScrollView
          className='flex-1'
          contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
          keyboardDismissMode='on-drag'
          keyboardShouldPersistTaps='handled'
          showsVerticalScrollIndicator={false}
        >
          <Pressable onPress={Keyboard.dismiss}>
            <View className='flex-1 gap-4 px-4'>
              {/* OPTIMIZED: Card wrapper + stagger animation */}
              <Animated.View
                className='rounded-2xl bg-white p-4 shadow-md'
                entering={FadeInDown.delay(0).springify().damping(18)}
              >
                <NameInputSection
                  habitName={state.habitName}
                  onChangeText={state.setHabitName}
                />
              </Animated.View>

              <Animated.View
                className='rounded-2xl bg-white p-4 shadow-md'
                entering={FadeInDown.delay(50).springify().damping(18)}
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

              {/* OPTIMIZED: DangerZone with red tint */}
              <Animated.View
                className='rounded-2xl bg-red-50 p-4 shadow-sm'
                entering={FadeInDown.delay(100).springify().damping(18)}
              >
                <DangerZone
                  onArchive={state.handleArchive}
                  onDelete={state.handleDelete}
                />
              </Animated.View>
            </View>
          </Pressable>
        </ScrollView>
      </LinearGradient>
    </Modal>
  );
}
