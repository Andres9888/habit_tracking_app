/**
 * NotesEditorModal Component
 * Modal for creating/editing habit notes
 */

import React from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Modal as RNModal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { X } from 'lucide-react-native';
import NoteEditor from '../../../components/StatsNotesModal/NoteEditor';
import { useThemeColors } from '../../../theme/ThemeContext';
import type { NotesEditorModalProps } from '../HabitDetailScreen.types';

export function NotesEditorModal({
  editingNote,
  habitId,
  insets,
  isOpen,
  onClose,
}: NotesEditorModalProps) {
  const { colors } = useThemeColors();
  return (
    <RNModal animationType='slide' visible={isOpen} onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top + 16 }}
      >
        <View className='flex-row items-center justify-between border-b px-5 pb-4' style={{ borderColor: colors.cardBorder }}>
          <Text
            className='font-bold'
            style={{ fontSize: 22, letterSpacing: -0.35, color: colors.text.primary }}
          >
            {editingNote ? 'Edit Note' : 'New Note'}
          </Text>
          <Pressable
            accessibilityLabel='Close note editor'
            accessibilityRole='button'
            className='h-11 w-11 items-center justify-center rounded-full'
            style={{ backgroundColor: colors.gray[100] }}
            onPress={onClose}
          >
            <X color={colors.text.secondary} size={24} />
          </Pressable>
        </View>
        <ScrollView
          className='flex-1'
          contentContainerStyle={{
            padding: 20,
            paddingBottom: insets.bottom + 20,
          }}
          keyboardShouldPersistTaps='handled'
          showsVerticalScrollIndicator={false}
        >
          <NoteEditor
            initialBody={editingNote?.body}
            initialDate={editingNote?.date}
            initialHabitId={editingNote?.habitId ?? habitId}
            noteId={editingNote?._id}
            onCancel={onClose}
            onSave={onClose}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </RNModal>
  );
}
