/**
 * NotesListModal Component
 * Modal for displaying habit notes
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
import NotesList from '../../../components/StatsNotesModal/NotesList';
import type { NotesListModalProps } from '../HabitDetailScreen.types';

export function NotesListModal({
  habitId,
  insets,
  isOpen,
  onClose,
}: NotesListModalProps) {
  return (
    <RNModal animationType='slide' visible={isOpen} onRequestClose={onClose}>
      <View className='flex-1 bg-white' style={{ paddingTop: insets.top + 16 }}>
        <View className='flex-row items-center justify-between border-b border-stone-100 px-5 pb-4'>
          <Text className='text-lg font-bold text-stone-900'>Notes</Text>
          <Pressable
            accessibilityLabel='Close notes'
            accessibilityRole='button'
            className='h-10 w-10 items-center justify-center rounded-full bg-stone-100 active:bg-stone-200'
            onPress={onClose}
          >
            <X className='text-stone-600' size={24} />
          </Pressable>
        </View>
        <ScrollView
          className='flex-1'
          contentContainerStyle={{
            padding: 20,
            paddingBottom: insets.bottom + 20,
          }}
          keyboardDismissMode='on-drag'
          keyboardShouldPersistTaps='handled'
          showsVerticalScrollIndicator={false}
        >
          <NotesList hideHabitFilter initialHabitId={habitId} />
        </ScrollView>
      </View>
    </RNModal>
  );
}
