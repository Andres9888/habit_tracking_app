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
import { useThemeColors } from '../../../theme/ThemeContext';
import type { NotesListModalProps } from '../HabitDetailScreen.types';

export function NotesListModal({
  habitId,
  insets,
  isOpen,
  onClose,
}: NotesListModalProps) {
  const { colors } = useThemeColors();
  return (
    <RNModal animationType='slide' visible={isOpen} onRequestClose={onClose}>
      <View className='flex-1' style={{ backgroundColor: colors.background, paddingTop: insets.top + 16 }}>
        <View className='flex-row items-center justify-between border-b px-5 pb-4' style={{ borderColor: colors.cardBorder }}>
          <Text className='text-lg font-bold' style={{ color: colors.text.primary }}>Notes</Text>
          <Pressable
            accessibilityLabel='Close notes'
            accessibilityRole='button'
            className='h-10 w-10 items-center justify-center rounded-full'
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
          <NotesList hideHabitFilter initialHabitId={habitId} />
        </ScrollView>
      </View>
    </RNModal>
  );
}
