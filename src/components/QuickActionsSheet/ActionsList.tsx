
import React from 'react';
import { View, ScrollView } from 'react-native';

import {
  Check,
  Brain,
  Calendar,
  Edit3,
  FileText,
  Pause,
  Trash2,
} from 'lucide-react-native';

import type { ActionsListProps } from './types';
import { ActionItem } from './ActionItem';

export const ActionsList = ({
  completed,
  onComplete,
  onMentalBoost,
  onViewCalendar,
  onViewDetails,
  onEdit,
  onPause,
  onDelete,
}: ActionsListProps) => {
  return (
    <ScrollView
      bounces={false}
      className='px-5 pt-4'
      showsVerticalScrollIndicator={false}
    >
      <View className='gap-2'>
        <ActionItem
          icon={
            <Check
              className={completed ? 'text-emerald-600' : 'text-stone-600'}
              size={20}
              strokeWidth={2.5}
            />
          }
          label={completed ? 'Mark Incomplete' : 'Complete Now'}
          onPress={onComplete}
        />
        <ActionItem
          highlighted
          showChevron
          badge='NEW!'
          icon={<Brain className='text-white' size={20} strokeWidth={2} />}
          label='Mental Boost'
          subtitle='Visualize success & strengthen motivation'
          onPress={onMentalBoost}
        />
        <ActionItem
          showChevron
          icon={
            <Calendar className='text-stone-600' size={20} strokeWidth={2} />
          }
          label='View Calendar'
          onPress={onViewCalendar}
        />

        {onViewDetails && (
          <ActionItem
            showChevron
            icon={
              <FileText className='text-stone-600' size={20} strokeWidth={2} />
            }
            label='View Details'
            subtitle='Stats, why, vision board'
            onPress={onViewDetails}
          />
        )}
        <View className='my-2 h-px bg-stone-100' />
        <ActionItem
          icon={<Edit3 className='text-stone-600' size={20} strokeWidth={2} />}
          label='Edit Habit'
          onPress={onEdit}
        />

        <ActionItem
          icon={<Pause className='text-stone-600' size={20} strokeWidth={2} />}
          label='Pause Habit'
          subtitle='Hide from daily list'
          onPress={onPause}
        />

        <ActionItem
          destructive
          icon={<Trash2 className='text-red-500' size={20} strokeWidth={2} />}
          label='Delete Habit'
          subtitle='This cannot be undone'
          onPress={onDelete}
        />
      </View>

      <View className='h-4' />
    </ScrollView>
  );
};
