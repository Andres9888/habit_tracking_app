/**
 * NotesListModal Component
 * Modal for displaying habit notes
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Modal as RNModal,
} from 'react-native';
import { ModalCloseButton } from '../../../components/ui/ModalCloseButton';
import { useThemeColors } from '../../../theme/ThemeContext';
import NotesList from '../../../components/StatsNotesModal/NotesList';
import type { NotesListModalProps } from '../HabitDetailScreen.types';

export function NotesListModal({
  habitId,
  insets,
  isOpen,
  onClose,
}: NotesListModalProps) {
  const { colors } = useThemeColors();

  return (
    <RNModal
      animationType='slide'
      visible={isOpen}
      onRequestClose={onClose}
    >
      <View
        accessibilityViewIsModal
        className='flex-1'
        style={{ paddingTop: insets.top + 16, backgroundColor: colors.background }}
      >
        <View
          className='flex-row items-center justify-between px-5 pb-4'
          style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}
        >
          <Text
            className='font-bold'
            style={{ fontSize: 22, letterSpacing: -0.35, color: colors.text.primary }}
          >
            Notes
          </Text>
          <ModalCloseButton onClose={onClose} />
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
