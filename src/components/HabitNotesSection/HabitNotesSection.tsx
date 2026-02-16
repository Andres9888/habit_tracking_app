/**
 * HabitNotesSection Component
 * Displays notes for a specific habit with recent note preview, count badge, and add action
 *
 * Story 1.9.3 - Habit Detail Notes Module
 */

import React from 'react';
import { View } from 'react-native';
import { clsx } from 'clsx';
import { useThemeColors } from '../../theme/ThemeContext';

import type { HabitNotesSectionProps } from './types';
import {
  NotesHeader,
  NotesEmptyState,
  RecentNotePreview,
  ViewAllButton,
} from './components';

function SectionCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { colors } = useThemeColors();
  return (
    <View
      className={clsx(
        'rounded-2xl p-4 shadow-sm',
        className
      )}
      style={{ backgroundColor: colors.card }}
    >
      {children}
    </View>
  );
}

export function HabitNotesSection({
  notes,
  onAddNote,
  onViewAll,
  onEditNote,
}: HabitNotesSectionProps) {
  const noteCount = notes.length;
  const mostRecentNote = notes[0];

  const handleEditNote = onEditNote ?? (() => {});

  return (
    <SectionCard className='border-l-4 border-amber-400'>
      <NotesHeader noteCount={noteCount} onAddNote={onAddNote} />

      {noteCount === 0 ? (
        <NotesEmptyState onAddNote={onAddNote} />
      ) : (
        <View className='gap-3'>
          <RecentNotePreview note={mostRecentNote} onEdit={handleEditNote} />
          {noteCount > 1 && (
            <ViewAllButton noteCount={noteCount} onPress={onViewAll} />
          )}
        </View>
      )}
    </SectionCard>
  );
}

export default HabitNotesSection;
