import { useMutation, useQuery } from 'convex/react';
import { format } from 'date-fns';
import { useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';

interface NoteEditorProps {
  noteId?: Id<'notes'>;
  initialBody?: string;
  initialDate?: string;
  initialHabitId?: Id<'habits'>;
  onCancel: () => void;
  onSave: () => void;
}

export default function NoteEditor({
  noteId,
  initialBody = '',
  initialDate,
  initialHabitId,
  onCancel,
  onSave,
}: NoteEditorProps) {
  const [body, setBody] = useState(initialBody);
  const [date, setDate] = useState(
    initialDate || format(new Date(), 'yyyy-MM-dd')
  );
  const [selectedHabitId, setSelectedHabitId] = useState<
    Id<'habits'> | undefined
  >(initialHabitId);

  const createNote = useMutation(api.notes.create);
  const updateNote = useMutation(api.notes.update);
  const habits = useQuery(api.habits.list) ?? [];

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string>('');

  const characterCount = body.length;
  const isValid = body.trim().length > 0 && characterCount <= 1000;

  const handleSave = async () => {
    if (!isValid) return;

    setIsSaving(true);
    setError('');

    try {
      await (noteId
        ? updateNote({ body: body.trim(), noteId })
        : createNote({
            body: body.trim(),
            date,
            habitId: selectedHabitId,
          }));
      onSave();
    } catch (error_) {
      setError(
        error_ instanceof Error ? error_.message : 'Failed to save note'
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View className='gap-4'>
      <View className='gap-2'>
        <Text className='text-xs font-semibold uppercase tracking-[2px] text-stone-500'>
          {noteId ? 'EDIT NOTE' : 'NEW NOTE'}
        </Text>

        {!noteId && (
          <>
            <TextInput
              accessibilityLabel='Note date'
              className='w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-medium text-stone-900'
              placeholder='YYYY-MM-DD'
              placeholderTextColor='#999'
              value={date}
              onChangeText={setDate}
            />

            <View className='rounded-2xl border border-stone-200 bg-white px-4 py-3'>
              <Text className='mb-2 text-xs font-semibold uppercase tracking-[2px] text-stone-500'>
                LINKED HABIT (OPTIONAL)
              </Text>
              <View className='gap-2'>
                <TouchableOpacity
                  accessibilityLabel='No habit selected'
                  accessibilityRole='button'
                  className={`rounded-xl px-3 py-2 ${
                    selectedHabitId ? 'bg-stone-100' : 'bg-stone-900'
                  }`}
                  onPress={() => setSelectedHabitId(undefined)}
                >
                  <Text
                    className={`text-sm font-medium ${
                      selectedHabitId ? 'text-stone-700' : 'text-white'
                    }`}
                  >
                    None
                  </Text>
                </TouchableOpacity>
                {habits.map((habit) => (
                  <TouchableOpacity
                    key={habit._id}
                    accessibilityLabel={`Link to ${habit.name}`}
                    accessibilityRole='button'
                    className={`rounded-xl px-3 py-2 ${
                      selectedHabitId === habit._id
                        ? 'bg-stone-900'
                        : 'bg-stone-100'
                    }`}
                    onPress={() => setSelectedHabitId(habit._id)}
                  >
                    <Text
                      className={`text-sm font-medium ${
                        selectedHabitId === habit._id
                          ? 'text-white'
                          : 'text-stone-700'
                      }`}
                    >
                      {habit.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        )}

        <TextInput
          multiline
          accessibilityLabel='Note body'
          className='min-h-[120px] w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-medium text-stone-900'
          placeholder='Write your note here...'
          placeholderTextColor='#999'
          textAlignVertical='top'
          value={body}
          onChangeText={setBody}
        />

        <View className='flex-row justify-between'>
          <Text
            className={`text-xs ${
              characterCount > 1000 ? 'text-red-500' : 'text-stone-500'
            }`}
          >
            {characterCount} / 1000 characters
          </Text>
        </View>

        {error ? <Text className='text-sm text-red-500'>{error}</Text> : null}
      </View>

      <View className='flex-row items-center justify-end gap-3'>
        <TouchableOpacity
          accessibilityRole='button'
          className='py-2'
          disabled={isSaving}
          onPress={onCancel}
        >
          <Text className='text-xs font-semibold tracking-[2px] text-stone-500'>
            CANCEL
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          accessibilityRole='button'
          className={`rounded-3xl border border-stone-900 px-5 py-2 ${
            !isValid || isSaving ? 'opacity-40' : ''
          }`}
          disabled={!isValid || isSaving}
          onPress={handleSave}
        >
          {isSaving ? (
            <ActivityIndicator color='#101727' size='small' />
          ) : (
            <Text className='text-xs font-semibold tracking-[2px] text-stone-900'>
              {noteId ? 'SAVE' : 'ADD'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
