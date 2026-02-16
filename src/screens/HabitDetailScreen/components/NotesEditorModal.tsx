/**
 * NotesEditorModal Component
 * Modal for creating/editing habit notes
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Modal as RNModal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { ModalCloseButton } from '../../../components/ui/ModalCloseButton';
import { useThemeColors } from '../../../theme/ThemeContext';
import NoteEditor from '../../../components/StatsNotesModal/NoteEditor';
import { spacing } from '../../../theme/spacing';
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
      <View className='flex-1' style={{ backgroundColor: '#FAF8F5', paddingTop: insets.top + spacing.base }}>
        <View className='flex-row items-center justify-between border-b border-stone-100 px-5 pb-4'>
          <Text
            className='font-bold'
            style={{ fontSize: 22, letterSpacing: -0.35, color: colors.text.primary }}
          >
            {editingNote ? 'Edit Note' : 'New Note'}
          </Text>
          <ModalCloseButton label='Close note editor' onClose={onClose} />
        </View>
        <ScrollView
          className='flex-1'
          contentContainerStyle={{
            padding: spacing.lg - spacing.xs,
            paddingBottom: insets.bottom + spacing.lg - spacing.xs,
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
