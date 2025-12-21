/**
 * HabitNotesSection Component
 * Displays notes for a specific habit with recent note preview, count badge, and add action
 *
 * Story 1.9.3 - Habit Detail Notes Module
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { format } from 'date-fns';
import { StickyNote, Plus, ChevronRight, Edit3 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { clsx } from 'clsx';
import type { Doc } from '../../../convex/_generated/dataModel';

interface HabitNotesSectionProps {
  /** Notes for this habit (should already be filtered by habitId and sorted desc) */
  notes: Doc<'notes'>[];
  /** Callback when user taps "Add Note" */
  onAddNote: () => void;
  /** Callback when user taps "View All" to open full notes list */
  onViewAll: () => void;
  /** Callback when user taps a note to edit it */
  onEditNote?: (note: Doc<'notes'>) => void;
}

/**
 * Section Card wrapper for consistent styling
 */
function SectionCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <View
      className={clsx(
        'rounded-2xl bg-white p-4 shadow-sm shadow-stone-200/50',
        className
      )}
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
  const mostRecentNote = notes[0]; // Notes should already be sorted desc

  const handleAddNote = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onAddNote();
  };

  const handleViewAll = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onViewAll();
  };

  const handleEditNote = (note: Doc<'notes'>) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onEditNote?.(note);
  };

  return (
    <SectionCard className="border-l-4 border-amber-400">
      {/* Header with title, count badge, and add button */}
      <View className="mb-3 flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <View className="h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
            <StickyNote
              className="text-amber-500"
              size={20}
              strokeWidth={2.25}
            />
          </View>
          <View>
            <View className="flex-row items-center gap-2">
              <Text className="font-semibold text-stone-800">Notes</Text>
              {noteCount > 0 && (
                <View
                  accessibilityLabel={`${noteCount} ${noteCount === 1 ? 'note' : 'notes'}`}
                  className="rounded-full bg-amber-100 px-2 py-0.5"
                >
                  <Text className="text-xs font-medium text-amber-700">
                    {noteCount}
                  </Text>
                </View>
              )}
            </View>
            <Text className="text-xs text-stone-500">
              Track what works for you
            </Text>
          </View>
        </View>
        <Pressable
          accessibilityLabel="Add note"
          accessibilityRole="button"
          className="rounded-full bg-amber-500 px-3 py-1.5 active:bg-amber-600"
          onPress={handleAddNote}
        >
          <View className="flex-row items-center gap-1">
            <Plus color="#ffffff" size={14} strokeWidth={2.5} />
            <Text className="text-xs font-semibold text-white">Add</Text>
          </View>
        </Pressable>
      </View>

      {/* Content area */}
      {noteCount === 0 ? (
        /* Empty state */
        <Pressable
          accessibilityLabel="Add your first note"
          accessibilityRole="button"
          className="items-center rounded-xl bg-amber-50/50 py-6 active:bg-amber-50"
          onPress={handleAddNote}
        >
          <StickyNote className="mb-2 text-amber-200" size={28} />
          <Text className="text-center text-sm text-stone-500">
            Record insights to learn what works best
          </Text>
          <Text className="mt-1 text-xs font-medium text-amber-600">
            Add your first note
          </Text>
        </Pressable>
      ) : (
        <View className="gap-3">
          {/* Most recent note preview */}
          <Pressable
            accessibilityLabel={`Most recent note: ${mostRecentNote.body.slice(0, 50)}`}
            accessibilityRole="button"
            className="rounded-xl border border-stone-100 bg-stone-50/50 p-4 active:bg-stone-100"
            onPress={() => handleEditNote(mostRecentNote)}
          >
            <View className="mb-2 flex-row items-center justify-between">
              <Text className="text-xs font-medium text-stone-500">
                {format(new Date(mostRecentNote.date), 'MMM d, yyyy')}
              </Text>
              <Edit3 className="text-stone-400" size={14} />
            </View>
            <Text
              className="text-sm leading-5 text-stone-700"
              numberOfLines={3}
            >
              {mostRecentNote.body}
            </Text>
          </Pressable>

          {/* View All button (only show if more than 1 note) */}
          {noteCount > 1 && (
            <Pressable
              accessibilityLabel={`View all ${noteCount} notes`}
              accessibilityRole="button"
              className="flex-row items-center justify-center gap-1 rounded-xl border border-dashed border-stone-200 bg-white py-3 active:bg-stone-50"
              onPress={handleViewAll}
            >
              <Text className="text-sm font-medium text-stone-600">
                View all ({noteCount})
              </Text>
              <ChevronRight className="text-stone-400" size={16} />
            </Pressable>
          )}
        </View>
      )}
    </SectionCard>
  );
}

export default HabitNotesSection;
