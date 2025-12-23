/**
 * ManageTabContent Component
 * Displays habit management options and settings
 */

import React, { useEffect, useMemo, useState } from 'react';
import { View, Text } from 'react-native';
import { clsx } from 'clsx';
import {
  Bell,
  CalendarDays,
  StickyNote,
  ChevronRight,
  Calendar,
  Pause,
  Archive,
  Trash2,
} from 'lucide-react-native';
import { getNextReminderRelativeTime } from '../../../utils/notifications';
import { SwipeableActionButton } from '../../../components/SwipeableActionButton';
import { SectionCard, ActionButton, DangerZoneSection } from './SharedComponents';
import type { Habit, Doc } from './types';

interface ManageTabContentProps {
  habit: Habit;
  habitNotes: Doc<'notes'>[];
  onArchive: () => void;
  onDelete: () => void;
  onOpenCalendar: () => void;
  onOpenNotesList: () => void;
  onOpenNotesEditor: () => void;
  onPause: () => void;
  /** Swipe action for delete - triggers undo toast flow */
  onSwipeDelete?: () => void;
  /** Swipe action for archive - triggers undo toast flow */
  onSwipeArchive?: () => void;
}

export function ManageTabContent({
  habit,
  habitNotes,
  onArchive,
  onDelete,
  onOpenCalendar,
  onOpenNotesList,
  onOpenNotesEditor,
  onPause,
  onSwipeDelete,
  onSwipeArchive,
}: ManageTabContentProps) {
  // Real-time relative time for next reminder (T3.4)
  // Update every minute for accurate display
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!habit.remindersEnabled || !habit.reminderTime) return;
    const interval = setInterval(() => {
      setTick(t => t + 1);
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [habit.remindersEnabled, habit.reminderTime]);

  // Get relative time display for next reminder
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const nextReminderText = useMemo(() => {
    if (!habit.remindersEnabled || !habit.reminderTime) {
      return 'Not set';
    }
    return getNextReminderRelativeTime(habit.reminderTime) || habit.reminderTime;
  }, [habit.remindersEnabled, habit.reminderTime, tick]); // tick triggers recalculation every minute

  return (
    <View className="gap-4">
      {/* Reminders */}
      <SectionCard>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <View className="h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
              <Bell className="text-blue-500" size={20} />
            </View>
            <View>
              <Text className="font-semibold text-stone-800">Reminders</Text>
              <Text className={clsx(
                "text-sm",
                habit.remindersEnabled ? "text-blue-600 font-medium" : "text-stone-500"
              )}>
                {nextReminderText}
              </Text>
            </View>
          </View>
          <ChevronRight className="text-stone-400" size={20} />
        </View>
      </SectionCard>

      {/* Frequency */}
      <SectionCard>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <View className="h-10 w-10 items-center justify-center rounded-xl bg-purple-100">
              <CalendarDays className="text-purple-500" size={20} />
            </View>
            <View>
              <Text className="font-semibold text-stone-800">Frequency</Text>
              <Text className="text-sm text-stone-500">Every day</Text>
            </View>
          </View>
          <ChevronRight className="text-stone-400" size={20} />
        </View>
      </SectionCard>

      {/* Notes */}
      <SectionCard
        accessibilityLabel="View notes"
        onPress={onOpenNotesList}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <View className="h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
              <StickyNote className="text-amber-500" size={20} />
            </View>
            <View>
              <Text className="font-semibold text-stone-800">Notes</Text>
              <Text className="text-sm text-stone-500">
                {habitNotes.length} journal {habitNotes.length === 1 ? 'entry' : 'entries'}
              </Text>
            </View>
          </View>
          <ChevronRight className="text-stone-400" size={20} />
        </View>
      </SectionCard>

      {/* View Full Calendar */}
      <ActionButton
        icon={Calendar}
        label="View Full Calendar"
        subtitle="See your complete habit history"
        onPress={onOpenCalendar}
        showChevron
      />

      {/* Divider */}
      <View className="mx-4 h-px bg-stone-200" />

      {/* Pause Habit */}
      <ActionButton
        icon={Pause}
        label="Pause Habit"
        subtitle="Take a break without losing progress"
        onPress={onPause}
      />

      {/* Danger Zone Section (T4.3) */}
      <DangerZoneSection>
        {/* Archive - Swipeable */}
        <SwipeableActionButton
          icon={Archive}
          label="Archive"
          subtitle="Hide from active habits"
          onPress={onArchive}
          onSwipeAction={onSwipeArchive}
          swipeEnabled={!!onSwipeArchive}
          swipeIcon={Archive}
          swipeLabel="Archive"
          swipeVariant="warning"
        />

        {/* Subtle divider between destructive actions */}
        <View className="mx-4 h-px bg-red-200/40" />

        {/* Delete - Swipeable */}
        <SwipeableActionButton
          icon={Trash2}
          label="Delete Habit"
          subtitle="Permanently remove this habit"
          onPress={onDelete}
          onSwipeAction={onSwipeDelete}
          swipeEnabled={!!onSwipeDelete}
          swipeIcon={Trash2}
          swipeLabel="Delete"
          swipeVariant="destructive"
          variant="destructive"
        />
      </DangerZoneSection>
    </View>
  );
}
