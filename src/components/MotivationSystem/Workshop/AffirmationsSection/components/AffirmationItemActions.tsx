/**
 * AffirmationItemActions Component
 * Action buttons for edit/delete/schedule
 */

import { triggerHaptic } from '@/utils/haptics';
import React from 'react';
import { View, Pressable } from 'react-native';
import { Bell, BellOff, Edit2, Trash2 } from 'lucide-react-native';
import { clsx } from 'clsx';
import { formatTimeForDisplay } from '../AffirmationsSection.utils';

interface AffirmationItemActionsProps {
  isPremium: boolean;
  hasSchedule: boolean;
  scheduledTime?: string;
  onSchedule?: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function AffirmationItemActions({
  isPremium,
  hasSchedule,
  scheduledTime,
  onSchedule,
  onEdit,
  onDelete,
}: AffirmationItemActionsProps) {
  return (
    <View className='flex-row gap-1'>
      {/* Schedule button (premium only) */}
      {isPremium && onSchedule && (
        <Pressable
          accessibilityLabel={
            hasSchedule
              ? `Scheduled at ${formatTimeForDisplay(scheduledTime)}`
              : 'Schedule delivery'
          }
          accessibilityRole='button'
          className={clsx(
            'h-8 w-8 items-center justify-center rounded-full',
            hasSchedule ? 'bg-emerald-100' : 'bg-white'
          )}
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          onPress={() => {
            triggerHaptic('tap');
            onSchedule();
          }}
        >
          {hasSchedule ? (
            <Bell className='text-emerald-600' size={14} />
          ) : (
            <BellOff className='text-stone-400' size={14} />
          )}
        </Pressable>
      )}
      <Pressable
        accessibilityLabel='Edit affirmation'
        accessibilityRole='button'
        className='h-8 w-8 items-center justify-center rounded-full bg-white'
        style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
        onPress={() => {
          triggerHaptic('tap');
          onEdit();
        }}
      >
        <Edit2 className='text-stone-400' size={14} />
      </Pressable>
      <Pressable
        accessibilityLabel='Delete affirmation'
        accessibilityRole='button'
        className='h-8 w-8 items-center justify-center rounded-full bg-white'
        style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
        onPress={() => {
          triggerHaptic('tap');
          onDelete();
        }}
      >
        <Trash2 className='text-rose-400' size={14} />
      </Pressable>
    </View>
  );
}
