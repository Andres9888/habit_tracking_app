/**
 * NotesSection Component
 * Displays recent notes and quick add functionality for a habit
 *
 * Features:
 * - Most recent note preview
 * - Expandable note view
 * - Quick add note button
 * - Empty state encouragement
 * - Visualization guide toggle (Andrew Huberman's goal visualization techniques)
 */

import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, Modal } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import {
  ChevronRight,
  Eye,
  Plus,
  StickyNote,
  X,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { VisualizationGuide } from './VisualizationGuide';

export interface Note {
  body: string;
  date: string; // Display date
}

export interface NotesSectionProps {
  habitName?: string;
  onAddNote: () => void;
  onViewAllNotes?: () => void;
  recentNote?: Note;
  totalNotes?: number;
}

export function NotesSection({
  habitName,
  onAddNote,
  onViewAllNotes,
  recentNote,
  totalNotes = 0,
}: NotesSectionProps) {
  const [showVisualizationGuide, setShowVisualizationGuide] = useState(false);
  const insets = useSafeAreaInsets();

  const handleAddNote = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onAddNote();
  };

  const handleViewAll = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onViewAllNotes?.();
  };

  const handleOpenVisualizationGuide = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowVisualizationGuide(true);
  };

  const handleCloseVisualizationGuide = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowVisualizationGuide(false);
  };

  return (
    <>
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

        {/* Action Buttons */}
        <View className="gap-2">
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

          {/* Visualization Guide Button */}
          <Pressable
            accessibilityLabel="Open goal visualization guide"
            accessibilityRole="button"
            className="flex-row items-center justify-center gap-2 rounded-xl py-3 active:opacity-90"
            style={{ backgroundColor: '#7c3aed' }}
            onPress={handleOpenVisualizationGuide}
          >
            <Eye color="#ffffff" size={18} />
            <Text className="text-sm font-semibold text-white">
              Visualization Guide
            </Text>
            <View
              className="rounded-full px-2 py-0.5"
              style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
            >
              <Text className="text-xs font-medium text-white">Huberman</Text>
            </View>
          </Pressable>
        </View>
      </View>

      {/* Visualization Guide Modal */}
      <Modal
        animationType="slide"
        visible={showVisualizationGuide}
        onRequestClose={handleCloseVisualizationGuide}
      >
        <View className="flex-1 bg-stone-50" style={{ backgroundColor: '#fafaf9' }}>
          {/* Header */}
          <Animated.View
            className="flex-row items-center justify-between border-b border-stone-100 px-5 pb-4"
            entering={FadeIn.delay(100)}
            style={{ paddingTop: insets.top + 8, backgroundColor: '#ffffff' }}
          >
            <View className="flex-row items-center gap-3">
              <View
                className="h-10 w-10 items-center justify-center rounded-xl"
                style={{ backgroundColor: '#7c3aed' }}
              >
                <Eye color="#ffffff" size={20} />
              </View>
              <View>
                <Text className="text-lg font-bold text-stone-900">
                  Visualization Guide
                </Text>
                <Text className="text-xs text-stone-500">
                  Science-backed goal techniques
                </Text>
              </View>
            </View>
            <Pressable
              accessibilityLabel="Close visualization guide"
              accessibilityRole="button"
              className="h-10 w-10 items-center justify-center rounded-full active:opacity-70"
              style={{ backgroundColor: '#f5f5f4' }}
              onPress={handleCloseVisualizationGuide}
            >
              <X color="#57534e" size={22} />
            </Pressable>
          </Animated.View>

          {/* Scrollable Content */}
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 20 }}
            showsVerticalScrollIndicator={false}
          >
            <VisualizationGuide
              habitName={habitName}
              onClose={handleCloseVisualizationGuide}
            />
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}

export default NotesSection;

