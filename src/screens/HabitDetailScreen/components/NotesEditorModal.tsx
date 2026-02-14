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
} from 'react-native';
import { X } from 'lucide-react-native';
import NoteEditor from '../../../components/StatsNotesModal/NoteEditor';
import type { NotesEditorModalProps } from '../HabitDetailScreen.types';

export function NotesEditorModal({
  editingNote,
  habitId,
  insets,
  isOpen,
  onClose,
}: NotesEditorModalProps) {
  return (
    <RNModal animationType='slide' visible={isOpen} onRequestClose={onClose}>
      <View className='flex-1' style={{ backgroundColor: '#FAF8F5', paddingTop: insets.top + 16 }}>
        <View className='flex-row items-center justify-between border-b border-stone-100 px-5 pb-4'>
          <Text
            className='font-bold text-stone-900'
            style={{ fontSize: 22, letterSpacing: -0.35 }}
          >
            {editingNote ? 'Edit Note' : 'New Note'}
          </Text>
          <Pressable
            accessibilityLabel='Close note editor'
            accessibilityRole='button'
            className='h-11 w-11 items-center justify-center rounded-full bg-stone-100 active:bg-stone-200'
            onPress={onClose}
          >
            <X color='#57534e' size={24} />
          </Pressable>
        </View>
        <ScrollView
          className='flex-1'
          contentContainerStyle={{
            padding: 20,
            paddingBottom: insets.bottom + 20,
          }}
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
      </View>
    </RNModal>
  );
}
