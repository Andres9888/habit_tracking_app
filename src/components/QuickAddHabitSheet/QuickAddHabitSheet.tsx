/**
 * QuickAddHabitSheet - Minimal bottom sheet for rapid habit creation.
 *
 * Shows a compact form with just habit name + emoji picker + save button.
 * Designed for speed — skip the full creation modal when you just want
 * to add a habit quickly.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMutation } from 'convex/react';
import { Sparkles, X } from 'lucide-react-native';

import { api } from '../../../convex/_generated/api';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';
import { markFirstHabitCreated } from '../../hooks/useStreakReminders/useStreakReminderSettings';
import { EmojiPicker } from '../EmojiPicker';
import { useSheetAnimations } from './useSheetAnimations';
import type { QuickAddHabitSheetProps } from './types';

/** Common habit emojis for quick selection */
const QUICK_EMOJIS = ['💪', '📚', '🧘', '🏃', '💧', '🎯', '✍️', '😴'];

/** Default color for new habits */
const DEFAULT_COLOR = '#059669';

export function QuickAddHabitSheet({
  visible,
  onClose,
  onHabitCreated,
  reduceMotion = false,
}: QuickAddHabitSheetProps) {
  const insets = useSafeAreaInsets();
  const inputRef = useRef<TextInput>(null);
  const [habitName, setHabitName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { triggerSuccess, triggerLightImpact } = useHapticFeedback({});

  const createHabit = useMutation(api.habits.create);

  const handleClose = useCallback(() => {
    Keyboard.dismiss();
    onClose();
  }, [onClose]);

  const { backdropStyle, panGesture, sheetStyle } = useSheetAnimations({
    onClose: handleClose,
    reduceMotion,
    triggerLightImpact,
    visible,
  });

  // Reset state when sheet opens
  useEffect(() => {
    if (visible) {
      setHabitName('');
      setSelectedEmoji(null);
      setIsSaving(false);
      // Focus input after animation settles
      const timer = setTimeout(() => inputRef.current?.focus(), 350);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  const handleSave = useCallback(async () => {
    const trimmedName = habitName.trim();
    if (!trimmedName || isSaving) return;

    setIsSaving(true);
    try {
      await createHabit({
        icon: selectedEmoji ?? undefined,
        iconColor: DEFAULT_COLOR,
        name: trimmedName,
        notes: '',
        remindersEnabled: false,
      });

      void markFirstHabitCreated();
      triggerSuccess();
      onHabitCreated?.();
      handleClose();
    } catch {
      setIsSaving(false);
    }
  }, [habitName, selectedEmoji, isSaving, createHabit, triggerSuccess, onHabitCreated, handleClose]);

  const handleQuickEmoji = useCallback(
    (emoji: string) => {
      triggerLightImpact();
      setSelectedEmoji((prev: string | null) => (prev === emoji ? null : emoji));
    },
    [triggerLightImpact]
  );

  const handleEmojiSelect = useCallback(
    (emoji: string | null) => {
      setSelectedEmoji(emoji);
      setEmojiPickerVisible(false);
    },
    []
  );

  const canSave = habitName.trim().length > 0 && !isSaving;

  return (
    <Modal
      transparent
      animationType="none"
      visible={visible}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Backdrop */}
        <Pressable
          className="flex-1"
          accessibilityLabel="Close quick add"
          accessibilityRole="button"
          onPress={handleClose}
        >
          <Animated.View
            className="absolute inset-0 bg-black"
            style={backdropStyle}
          />
        </Pressable>

        {/* Sheet */}
        <GestureDetector gesture={panGesture}>
          <Animated.View
            className="rounded-t-3xl bg-stone-50 shadow-2xl"
            style={sheetStyle}
          >
            {/* Drag Handle */}
            <View className="items-center pt-3 pb-1">
              <View className="h-1 w-10 rounded-full bg-stone-300" />
            </View>

            {/* Header */}
            <View className="flex-row items-center justify-between px-5 pb-3">
              <View className="flex-row items-center gap-2">
                <Sparkles color="#059669" size={18} />
                <Text className="text-lg font-semibold text-stone-800">
                  Quick Add
                </Text>
              </View>
              <Pressable
                accessibilityLabel="Close"
                accessibilityRole="button"
                hitSlop={12}
                onPress={handleClose}
              >
                <X color="#78716c" size={20} />
              </Pressable>
            </View>

            {/* Name Input + Selected Emoji */}
            <View className="mx-5 mb-4 flex-row items-center gap-3">
              <Pressable
                accessibilityLabel={
                  selectedEmoji
                    ? `Selected emoji: ${selectedEmoji}. Tap to change`
                    : 'Choose an emoji'
                }
                accessibilityRole="button"
                className="h-12 w-12 items-center justify-center rounded-2xl bg-stone-100 border border-stone-200"
                onPress={() => setEmojiPickerVisible(true)}
              >
                <Text className="text-2xl">
                  {selectedEmoji ?? '😊'}
                </Text>
              </Pressable>
              <TextInput
                ref={inputRef}
                accessibilityLabel="Habit name"
                className="h-12 flex-1 rounded-2xl bg-stone-100 px-4 text-base text-stone-800 border border-stone-200"
                maxLength={50}
                placeholder="e.g. Morning run, Read 20 min..."
                placeholderTextColor="#a8a29e"
                returnKeyType="done"
                value={habitName}
                onChangeText={setHabitName}
                onSubmitEditing={() => void handleSave()}
              />
            </View>

            {/* Quick Emoji Row */}
            <View className="mx-5 mb-4 flex-row items-center justify-between">
              {QUICK_EMOJIS.map((emoji) => (
                <Pressable
                  key={emoji}
                  accessibilityLabel={`Emoji ${emoji}`}
                  accessibilityRole="button"
                  accessibilityState={{ selected: selectedEmoji === emoji }}
                  className={`h-10 w-10 items-center justify-center rounded-xl ${
                    selectedEmoji === emoji
                      ? 'bg-emerald-100 border-2 border-emerald-400'
                      : 'bg-stone-100'
                  }`}
                  onPress={() => handleQuickEmoji(emoji)}
                >
                  <Text className="text-xl">{emoji}</Text>
                </Pressable>
              ))}
            </View>

            {/* Save Button */}
            <View
              className="mx-5"
              style={{ paddingBottom: Math.max(insets.bottom, 16) + 8 }}
            >
              <Pressable
                accessibilityLabel="Save habit"
                accessibilityRole="button"
                accessibilityState={{ disabled: !canSave }}
                className={`h-12 items-center justify-center rounded-2xl ${
                  canSave ? 'bg-[#059669]' : 'bg-stone-300'
                }`}
                disabled={!canSave}
                onPress={() => void handleSave()}
              >
                {isSaving ? (
                  <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                  <Text className="text-base font-semibold text-white">
                    Save Habit
                  </Text>
                )}
              </Pressable>
            </View>
          </Animated.View>
        </GestureDetector>
      </KeyboardAvoidingView>

      {/* Full Emoji Picker Modal */}
      <EmojiPicker
        habitName={habitName}
        selectedEmoji={selectedEmoji}
        visible={emojiPickerVisible}
        onClose={() => setEmojiPickerVisible(false)}
        onSelect={handleEmojiSelect}
      />
    </Modal>
  );
}

export default QuickAddHabitSheet;
