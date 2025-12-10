/**
 * NotesSection Component
 * Displays recent notes and quick add functionality for a habit
 *
 * Features:
 * - Most recent note preview
 * - Expandable note view
 * - Quick add note button
 * - Empty state encouragement
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import {
  ChevronRight,
  Plus,
  StickyNote,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export interface Note {
  body: string;
  date: string; // Display date
}

export interface NotesSectionProps {
  onAddNote: () => void;
  onViewAllNotes?: () => void;
  recentNote?: Note;
  totalNotes?: number;
}

export function NotesSection({
  onAddNote,
  onViewAllNotes,
  recentNote,
  totalNotes = 0,
}: NotesSectionProps) {
  const handleAddNote = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onAddNote();
  };

  const handleViewAll = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onViewAllNotes?.();
  };

  return (
    <View className="rounded-2xl bg-white/90 p-5 shadow-sm shadow-stone-200/50">
      {/* Header */}
      <View className="mb-4 flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <StickyNote className="text-stone-600" size={20} />
          <Text className="text-lg font-semibold text-stone-800">
            Notes
          </Text>
          {totalNotes > 0 && (
            <View className="rounded-full bg-stone-100 px-2 py-0.5">
              <Text className="text-xs font-medium text-stone-500">
                {totalNotes}
              </Text>
            </View>
          )}
        </View>

        {totalNotes > 1 && onViewAllNotes && (
          <Pressable
            accessibilityLabel="View all notes"
            accessibilityRole="button"
            className="flex-row items-center gap-1 active:opacity-70"
            onPress={handleViewAll}
          >
            <Text className="text-sm font-medium text-emerald-600">
              View All
            </Text>
            <ChevronRight className="text-emerald-600" size={16} />
          </Pressable>
        )}
      </View>

      {/* Content */}
      {recentNote ? (
        <View className="mb-4">
          {/* Recent Note Preview */}
          <View className="rounded-xl border border-stone-100 bg-stone-50/50 p-4">
            <Text
              className="text-base leading-relaxed text-stone-700"
              numberOfLines={3}
            >
              "{recentNote.body}"
            </Text>
            <Text className="mt-2 text-xs text-stone-400">
              {recentNote.date}
            </Text>
          </View>
        </View>
      ) : (
        <View className="mb-4 items-center rounded-xl bg-stone-50 py-6">
          <StickyNote className="mb-2 text-stone-300" size={32} />
          <Text className="text-center text-sm text-stone-500">
            No notes yet
          </Text>
          <Text className="mt-1 text-center text-xs text-stone-400">
            Capture your thoughts and track what works
          </Text>
        </View>
      )}

      {/* Add Note Button */}
      <Pressable
        accessibilityLabel="Add a new note"
        accessibilityRole="button"
        className="flex-row items-center justify-center gap-2 rounded-xl border-2 border-dashed border-stone-200 bg-stone-50/50 py-3 active:bg-stone-100"
        onPress={handleAddNote}
      >
        <Plus className="text-stone-500" size={18} />
        <Text className="text-sm font-medium text-stone-600">
          Add Note
        </Text>
      </Pressable>
    </View>
  );
}

export default NotesSection;





