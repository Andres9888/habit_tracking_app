import { useMutation, useQuery } from 'convex/react';
import { format } from 'date-fns';
import { Plus, Search, Trash2, Edit3 } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';
import NoteEditor from './NoteEditor';

interface NotesListProps {
  onAddNote?: () => void;
}

export default function NotesList({ onAddNote }: NotesListProps) {
  const [searchText, setSearchText] = useState('');
  const [selectedHabitFilter, setSelectedHabitFilter] = useState<
    Id<'habits'> | 'all'
  >('all');
  const [editingNoteId, setEditingNoteId] = useState<Id<'notes'> | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const habits = useQuery(api.habits.list) ?? [];
  const notes =
    useQuery(api.notes.search, {
      habitId: selectedHabitFilter === 'all' ? undefined : selectedHabitFilter,
      searchText: searchText || undefined,
    }) ?? [];

  const deleteNote = useMutation(api.notes.remove);
  const [deletingNoteId, setDeletingNoteId] = useState<Id<'notes'> | null>(
    null
  );

  // Group notes by date
  const groupedNotes = useMemo(() => {
    const groups = new Map<string, typeof notes>();

    for (const note of notes) {
      const existing = groups.get(note.date) || [];
      groups.set(note.date, [...existing, note]);
    }

    // Sort by date descending
    return Array.from(groups.entries())
      .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
      .map(([date, notes]) => ({
        date,
        notes: notes.sort((a, b) => b._creationTime - a._creationTime),
      }));
  }, [notes]);

  const handleDelete = async (noteId: Id<'notes'>) => {
    setDeletingNoteId(noteId);
    try {
      await deleteNote({ noteId });
    } catch (error) {
      console.error('Failed to delete note:', error);
    } finally {
      setDeletingNoteId(null);
    }
  };

  const editingNote = editingNoteId
    ? notes.find((n) => n._id === editingNoteId)
    : null;

  if (isAdding) {
    return (
      <View>
        <NoteEditor
          onCancel={() => setIsAdding(false)}
          onSave={() => setIsAdding(false)}
        />
      </View>
    );
  }

  if (editingNote) {
    return (
      <View>
        <NoteEditor
          initialBody={editingNote.body}
          initialDate={editingNote.date}
          initialHabitId={editingNote.habitId}
          noteId={editingNote._id}
          onCancel={() => setEditingNoteId(null)}
          onSave={() => setEditingNoteId(null)}
        />
      </View>
    );
  }

  return (
    <View className='gap-4'>
      <View className='flex-row items-center justify-between'>
        <Text className='text-lg font-semibold text-slate-900'>Notes</Text>
        <TouchableOpacity
          accessibilityLabel='Add new note'
          accessibilityRole='button'
          className='h-9 w-9 items-center justify-center rounded-full bg-slate-900'
          onPress={() => setIsAdding(true)}
        >
          <Plus color='#ffffff' size={18} strokeWidth={2.25} />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View className='relative'>
        <TextInput
          accessibilityLabel='Search notes'
          className='w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm font-medium text-slate-900'
          placeholder='Search notes...'
          placeholderTextColor='#999'
          value={searchText}
          onChangeText={setSearchText}
        />
        <View className='absolute left-4 top-3.5'>
          <Search color='#999' size={18} strokeWidth={2} />
        </View>
      </View>

      {/* Filter by habit */}
      <View className='gap-2'>
        <Text className='text-xs font-semibold uppercase tracking-[2px] text-slate-500'>
          FILTER BY HABIT
        </Text>
        <View className='flex-row flex-wrap gap-2'>
          <TouchableOpacity
            accessibilityLabel='Show all notes'
            accessibilityRole='button'
            className={`rounded-xl px-3 py-2 ${
              selectedHabitFilter === 'all' ? 'bg-slate-900' : 'bg-slate-100'
            }`}
            onPress={() => setSelectedHabitFilter('all')}
          >
            <Text
              className={`text-sm font-medium ${
                selectedHabitFilter === 'all' ? 'text-white' : 'text-slate-700'
              }`}
            >
              All
            </Text>
          </TouchableOpacity>
          {habits.map((habit) => (
            <TouchableOpacity
              key={habit._id}
              accessibilityLabel={`Filter by ${habit.name}`}
              accessibilityRole='button'
              className={`rounded-xl px-3 py-2 ${
                selectedHabitFilter === habit._id
                  ? 'bg-slate-900'
                  : 'bg-slate-100'
              }`}
              onPress={() => setSelectedHabitFilter(habit._id)}
            >
              <Text
                className={`text-sm font-medium ${
                  selectedHabitFilter === habit._id
                    ? 'text-white'
                    : 'text-slate-700'
                }`}
              >
                {habit.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Notes list grouped by date */}
      {groupedNotes.length === 0 ? (
        <View className='items-center py-8'>
          <Text className='text-center text-sm text-slate-500'>
            {searchText || selectedHabitFilter !== 'all'
              ? 'No notes found'
              : 'No notes yet. Add your first note!'}
          </Text>
        </View>
      ) : (
        <View className='gap-6'>
          {groupedNotes.map(({ date, notes: dateNotes }) => (
            <View key={date} className='gap-3'>
              <Text className='text-xs font-semibold uppercase tracking-[2px] text-slate-500'>
                {format(new Date(date), 'MMM d, yyyy')}
              </Text>
              {dateNotes.map((note) => {
                const linkedHabit = note.habitId
                  ? habits.find((h) => h._id === note.habitId)
                  : null;
                const isDeleting = deletingNoteId === note._id;

                return (
                  <View
                    key={note._id}
                    className='gap-2 rounded-2xl bg-slate-50 p-4'
                  >
                    {linkedHabit && (
                      <View className='mb-1'>
                        <Text className='text-xs font-semibold text-slate-600'>
                          {linkedHabit.name}
                        </Text>
                      </View>
                    )}
                    <Text className='text-sm leading-5 text-slate-900'>
                      {note.body}
                    </Text>
                    <View className='flex-row items-center justify-between'>
                      <Text className='text-xs text-slate-400'>
                        {note.updatedAt !== note.createdAt
                          ? `Updated ${format(note.updatedAt, 'MMM d, h:mm a')}`
                          : `Created ${format(note.createdAt, 'MMM d, h:mm a')}`}
                      </Text>
                      <View className='flex-row gap-2'>
                        <TouchableOpacity
                          accessibilityLabel='Edit note'
                          accessibilityRole='button'
                          className='rounded-full bg-slate-200 p-2'
                          disabled={isDeleting}
                          onPress={() => setEditingNoteId(note._id)}
                        >
                          <Edit3 color='#475569' size={14} strokeWidth={2.25} />
                        </TouchableOpacity>
                        <TouchableOpacity
                          accessibilityLabel='Delete note'
                          accessibilityRole='button'
                          className='rounded-full bg-red-100 p-2'
                          disabled={isDeleting}
                          onPress={() => handleDelete(note._id)}
                        >
                          {isDeleting ? (
                            <ActivityIndicator color='#ef4444' size='small' />
                          ) : (
                            <Trash2
                              color='#ef4444'
                              size={14}
                              strokeWidth={2.25}
                            />
                          )}
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
