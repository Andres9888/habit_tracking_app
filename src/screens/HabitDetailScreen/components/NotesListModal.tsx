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
import { spacing } from '../../../theme/spacing';
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
      <View className='flex-1 bg-white' style={{ paddingTop: insets.top + spacing.base }}>
        <View className='flex-row items-center justify-between border-b border-stone-100 px-5 pb-4'>
          <Text className='text-lg font-bold text-stone-900'>Notes</Text>
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
            padding: spacing.lg - spacing.xs,
            paddingBottom: insets.bottom + spacing.lg - spacing.xs,
          }}
          showsVerticalScrollIndicator={false}
        >
          <NotesList hideHabitFilter initialHabitId={habitId} />
        </ScrollView>
      </View>
    </RNModal>
  );
}
