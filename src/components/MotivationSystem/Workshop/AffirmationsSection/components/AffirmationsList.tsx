/**
 * AffirmationsList Component
 * Displays list of existing affirmations
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Bell } from 'lucide-react-native';
import type { AffirmationData } from '../AffirmationsSection.types';
import { AffirmationItem } from './AffirmationItem';

interface AffirmationsListProps {
  affirmations: AffirmationData[];
  onEdit: (affirmation: AffirmationData) => void;
  onDelete: (affirmationId: string) => void;
  onSchedule?: (affirmation: AffirmationData) => void;
  isPremium: boolean;
  maxDisplay?: number;
}

export function AffirmationsList({
  affirmations,
  onEdit,
  onDelete,
  onSchedule,
  isPremium,
  maxDisplay = 3,
}: AffirmationsListProps) {
  if (affirmations.length === 0) {
    return null;
  }

  const displayAffirmations = affirmations.slice(0, maxDisplay);
  const remainingCount = affirmations.length - maxDisplay;

  // Count scheduled affirmations
  const scheduledCount = affirmations.filter(
    (a) => a.isScheduleEnabled && a.scheduledTime
  ).length;

  return (
    <View className='mt-4 border-t border-stone-100 pt-4'>
      <View className='mb-2 flex-row items-center justify-between'>
        <Text className='text-sm font-medium text-stone-600'>
          Your Affirmations ({affirmations.length})
        </Text>
        {scheduledCount > 0 && isPremium && (
          <View className='flex-row items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5'>
            <Bell className='text-emerald-600' size={10} />
            <Text className='text-xs font-medium text-emerald-700'>
              {scheduledCount} scheduled
            </Text>
          </View>
        )}
      </View>

      <View className='gap-2'>
        {displayAffirmations.map((affirmation) => (
          <AffirmationItem
            key={affirmation.id}
            affirmation={affirmation}
            isPremium={isPremium}
            onDelete={() => onDelete(affirmation.id)}
            onEdit={() => onEdit(affirmation)}
            onSchedule={onSchedule ? () => onSchedule(affirmation) : undefined}
          />
        ))}
        {remainingCount > 0 && (
          <Text className='mt-1 text-center text-xs text-stone-400'>
            +{remainingCount} more
          </Text>
        )}
      </View>
    </View>
  );
}
