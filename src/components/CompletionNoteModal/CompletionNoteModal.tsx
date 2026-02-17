/**
 * CompletionNoteModal
 * 
 * Appears after completing a habit to capture quick reflection:
 * - Emoji sentiment (frustrated, neutral, happy, fire)
 * - Optional text note ("How did it go?")
 * 
 * Saves to reflections table for history tracking
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Modal,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useThemeColors } from '../../theme/ThemeContext';
import type { Id } from '../../../convex/_generated/dataModel';

type EmojiSentiment = 'frustrated' | 'neutral' | 'happy' | 'fire';

interface CompletionNoteModalProps {
  visible: boolean;
  habitId: Id<'habits'> | null;
  habitName: string;
  date: string;
  onClose: () => void;
}

const EMOJI_OPTIONS: Array<{ value: EmojiSentiment; emoji: string; label: string }> = [
  { value: 'frustrated', emoji: '😤', label: 'Struggled' },
  { value: 'neutral', emoji: '😐', label: 'Okay' },
  { value: 'happy', emoji: '😊', label: 'Good' },
  { value: 'fire', emoji: '🔥', label: 'Amazing!' },
];

export function CompletionNoteModal({
  visible,
  habitId,
  habitName,
  date,
  onClose,
}: CompletionNoteModalProps) {
  const { colors, isDark } = useThemeColors();
  const [selectedEmoji, setSelectedEmoji] = useState<EmojiSentiment | null>(null);
  const [noteText, setNoteText] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const upsertReflection = useMutation(api.reflections.upsert);

  const handleSave = useCallback(async () => {
    if (!habitId || !selectedEmoji) return;
    
    try {
      await upsertReflection({
        habitId,
        date,
        emoji: selectedEmoji,
        note: noteText.trim() || undefined,
      });
    } catch (error) {
      console.error('Failed to save reflection:', error);
    }
    
    // Reset and close
    setSelectedEmoji(null);
    setNoteText('');
    setIsExpanded(false);
    onClose();
  }, [habitId, date, selectedEmoji, noteText, upsertReflection, onClose]);

  const handleSkip = useCallback(() => {
    setSelectedEmoji(null);
    setNoteText('');
    setIsExpanded(false);
    onClose();
  }, [onClose]);

  if (!visible) return null;

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={handleSkip}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <Pressable
          className="flex-1 items-center justify-center bg-black/50"
          onPress={handleSkip}
        >
          <Pressable
            className="w-11/12 max-w-md rounded-2xl p-6"
            style={{ backgroundColor: colors.card }}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <Text
              className="mb-2 text-center text-2xl font-bold"
              style={{ color: colors.text.primary }}
            >
              {habitName}
            </Text>
            <Text
              className="mb-6 text-center text-base"
              style={{ color: colors.text.secondary }}
            >
              How did it go?
            </Text>

            {/* Emoji Selector */}
            <View className="mb-6 flex-row justify-around">
              {EMOJI_OPTIONS.map((option) => (
                <Pressable
                  key={option.value}
                  className="items-center"
                  onPress={() => setSelectedEmoji(option.value)}
                >
                  <View
                    className="mb-2 h-16 w-16 items-center justify-center rounded-2xl"
                    style={{
                      backgroundColor:
                        selectedEmoji === option.value
                          ? isDark
                            ? 'rgba(5, 150, 105, 0.2)'
                            : 'rgba(4, 120, 87, 0.1)'
                          : colors.gray[100],
                      borderWidth: selectedEmoji === option.value ? 2 : 0,
                      borderColor: '#047857',
                    }}
                  >
                    <Text className="text-3xl">{option.emoji}</Text>
                  </View>
                  <Text
                    className="text-sm font-medium"
                    style={{
                      color:
                        selectedEmoji === option.value
                          ? '#047857'
                          : colors.gray[500],
                    }}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Optional Note Input */}
            {!isExpanded ? (
              <Pressable
                className="mb-6 items-center"
                onPress={() => setIsExpanded(true)}
              >
                <Text
                  className="text-sm font-medium"
                  style={{ color: '#047857' }}
                >
                  + Add a note
                </Text>
              </Pressable>
            ) : (
              <View className="mb-6">
                <TextInput
                  className="rounded-xl p-4 text-base"
                  style={{
                    backgroundColor: colors.gray[100],
                    color: colors.text.primary,
                    minHeight: 80,
                  }}
                  placeholder="Quick thoughts..."
                  placeholderTextColor={colors.text.tertiary}
                  multiline
                  value={noteText}
                  onChangeText={setNoteText}
                  autoFocus
                  maxLength={280}
                />
                <Text
                  className="mt-2 text-right text-xs"
                  style={{ color: colors.text.tertiary }}
                >
                  {noteText.length}/280
                </Text>
              </View>
            )}

            {/* Actions */}
            <View className="flex-row gap-3">
              <Pressable
                className="flex-1 items-center rounded-xl py-4"
                style={{ backgroundColor: colors.gray[200] }}
                onPress={handleSkip}
              >
                <Text
                  className="text-base font-semibold"
                  style={{ color: colors.gray[600] }}
                >
                  Skip
                </Text>
              </Pressable>
              <Pressable
                className="flex-1 items-center rounded-xl py-4"
                style={{
                  backgroundColor: selectedEmoji ? '#059669' : colors.gray[300],
                  opacity: selectedEmoji ? 1 : 0.5,
                }}
                onPress={handleSave}
                disabled={!selectedEmoji}
              >
                <Text className="text-base font-semibold text-white">
                  Save
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}
