/**
 * NotesGrouped Component
 * Notes grouped by date with cards
 */

import React from 'react';
import { View, Text } from 'react-native';
import { format } from 'date-fns';
import type { Id } from '../../../../../convex/_generated/dataModel';
import { NoteCard } from './NoteCard';

interface Note {
  _id: Id<'notes'>;
  body: string;
  habitId?: Id<'habits'>;
  createdAt: number;
  updatedAt: number;
}

interface NoteGroup {
  date: string;
  notes: Note[];
}

interface Habit {
  _id: Id<'habits'>;
  name: string;
}

interface NotesGroupedProps {
  groupedNotes: NoteGroup[];
  habits: Habit[];
  deletingNoteId: Id<'notes'> | null;
  onEdit: (noteId: Id<'notes'>) => void;
  onDelete: (noteId: Id<'notes'>) => void;
}

export const NotesGrouped: React.FC<NotesGroupedProps> = ({
  groupedNotes,
  habits,
  deletingNoteId,
  onEdit,
  onDelete,
}) => (
  <View className='gap-6'>
    {groupedNotes.map(({ date, notes }) => (
      <View key={date} className='gap-3'>
        <Text className='text-xs font-semibold uppercase tracking-[2px] text-stone-500'>
          {format(new Date(date), 'MMM d, yyyy')}
        </Text>
        {notes.map((note) => {
          const linkedHabit = note.habitId
            ? habits.find((h) => h._id === note.habitId)
            : null;

          return (
            <NoteCard
              key={note._id}
              habitName={linkedHabit?.name}
              isDeleting={deletingNoteId === note._id}
              note={note}
              onDelete={() => onDelete(note._id)}
              onEdit={() => onEdit(note._id)}
            />
          );
        })}
      </View>
    ))}
  </View>
);
