/**
 * NotesEditorModal Component
 * 
 * Full-screen modal for creating or editing habit notes.
 * 
 * **Trigger:**
 * - Create: "Add Note" button in HabitDetailScreen or StatsNotesModal
 * - Edit: Tap existing note in notes list
 * 
 * **Display:**
 * - Header with "New Note" or "Edit Note" title and close button
 * - Scrollable form (keyboard-aware):
 *   - Date picker (defaults to today or note's date)
 *   - Habit selector (if creating from global context)
 *   - Note body textarea (multi-line text input)
 *   - Save and Cancel buttons
 * 
 * **Actions:**
 * - Select date for note
 * - Select associated habit (if multi-habit context)
 * - Write/edit note text
 * - Save note (creates or updates)
 * - Cancel (discards changes, closes modal)
 * 
 * **Modal Type:** React Native Modal (slide animation)
 * 
 * **Lifecycle:**
 * - Opens: visible=true with optional editingNote data
 * - Closes: onClose via save, cancel, or close button
 * - Create mode: Empty form with today's date
 * - Edit mode: Pre-filled with existing note data
 * 
 * **Pattern:** Uses RN Modal directly with KeyboardAvoidingView
 * ScrollView with keyboard handling (keyboardShouldPersistTaps)
 * Contains NoteEditor component for form logic
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
        accessibilityViewIsModal
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top + 16 }}
      >
        <View
          className='flex-row items-center justify-between px-5 pb-4'
          style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}
        >
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
