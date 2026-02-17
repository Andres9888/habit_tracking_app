/**
 * JournalSection - Habit journaling with mood tags, prompted questions, and chronological entries
 *
 * Scientific Basis:
 * - Expressive writing improves health outcomes (Pennebaker, 1997)
 * - Structured reflection increases self-awareness and behavior change
 * - Mood tracking correlates with habit consistency (Daylio model)
 *
 * Premium: unlimited entries | Free: 3 per habit
 */
import React, { useCallback, useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useThemeColors } from '../../../../theme';
import { JournalComposer } from './JournalComposer';
import { JournalEntryCard } from './JournalEntryCard';
import type { JournalSectionProps, JournalEntry } from './types';
import type { Id } from '../../../../convex/_generated/dataModel';

const FREE_LIMIT = 3;

export function JournalSection({ habitId }: JournalSectionProps) {
  const { colors } = useThemeColors();
  const entries = useQuery(api.journalEntries.listByHabit, { habitId }) as JournalEntry[] | undefined;
  const entryCount = useQuery(api.journalEntries.countByHabit, { habitId });
  const removeEntry = useMutation(api.journalEntries.remove);

  // Simple premium check: if count >= FREE_LIMIT and user successfully created entries, they have premium
  // The server enforces the real limit
  const canAdd = entryCount === undefined || entryCount < FREE_LIMIT;

  const [, setRefresh] = useState(0);
  const onEntryCreated = useCallback(() => setRefresh((r) => r + 1), []);

  const handleDelete = useCallback(
    (entryId: Id<'journalEntries'>) => {
      Alert.alert('Delete Entry', 'Are you sure you want to delete this journal entry?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => removeEntry({ entryId }),
        },
      ]);
    },
    [removeEntry]
  );

  return (
    <View>
      {/* Composer */}
      <JournalComposer
        canAdd={canAdd}
        habitId={habitId}
        onEntryCreated={onEntryCreated}
      />

      {/* Entries list */}
      {entries && entries.length > 0 ? (
        <View className='mt-4'>
          <Text
            className='mb-2 text-[13px] font-semibold uppercase tracking-wider'
            style={{ color: colors.text.tertiary }}
          >
            Past Entries ({entries.length})
          </Text>
          {entries.map((entry, index) => (
            <JournalEntryCard
              key={entry._id}
              entry={entry}
              index={index}
              onDelete={handleDelete}
            />
          ))}
        </View>
      ) : entries && entries.length === 0 ? (
        <View className='mt-4 items-center py-6'>
          <Text className='text-3xl'>📝</Text>
          <Text
            className='mt-2 text-center text-[15px]'
            style={{ color: colors.text.secondary }}
          >
            No journal entries yet.{'\n'}Start reflecting on your habit journey!
          </Text>
        </View>
      ) : null}
    </View>
  );
}
