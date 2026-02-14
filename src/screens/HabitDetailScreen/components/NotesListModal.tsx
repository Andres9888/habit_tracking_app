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
  const { colors: themeColors, isDark } = useThemeColors();

  return (
    <RNModal animationType='slide' visible={isOpen} onRequestClose={onClose}>
      <View className='flex-1' style={{ backgroundColor: themeColors.background, paddingTop: insets.top + 16 }}>
        <View
          className='flex-row items-center justify-between px-5 pb-4'
          style={{ borderBottomWidth: 1, borderBottomColor: themeColors.border }}
        >
          <Text className='text-lg font-bold' style={{ color: themeColors.text.primary }}>Notes</Text>
          <Pressable
            accessibilityLabel='Close notes'
            accessibilityRole='button'
            className='h-10 w-10 items-center justify-center rounded-full'
            style={{ backgroundColor: isDark ? themeColors.gray[200] : themeColors.gray[100] }}
            onPress={onClose}
          >
            <X color={themeColors.text.secondary} size={24} />
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
          <NotesList hideHabitFilter initialHabitId={habitId} />
        </ScrollView>
      </View>
    </RNModal>
  );
}
