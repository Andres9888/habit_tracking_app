/**
 * NotesListModal Component
 * Modal for displaying habit notes — dark mode aware
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
import { useThemeColors } from '../../../theme';
import type { NotesListModalProps } from '../HabitDetailScreen.types';

export function NotesListModal({
  habitId,
  insets,
  isOpen,
  onClose,
}: NotesListModalProps) {
  const { colors, isDark } = useThemeColors();

  return (
    <RNModal animationType='slide' visible={isOpen} onRequestClose={onClose}>
      <View
        className='flex-1'
        style={{
          backgroundColor: colors.background,
          paddingTop: insets.top + 16,
        }}
      >
        <View
          className='flex-row items-center justify-between px-5 pb-4'
          style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}
        >
          <Text
            className='text-lg font-bold'
            style={{ color: colors.text.primary }}
          >
            Notes
          </Text>
          <Pressable
            accessibilityLabel='Close notes'
            accessibilityRole='button'
            className='h-11 w-11 items-center justify-center rounded-full active:opacity-70'
            style={{ backgroundColor: isDark ? colors.gray[200] : colors.gray[100] }}
            onPress={onClose}
          >
            <X color={isDark ? colors.text.secondary : '#57534e'} size={24} />
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
