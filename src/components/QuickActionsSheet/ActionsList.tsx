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
import { iconSizes } from '@/theme/iconSizes';
import { ActionItem } from './ActionItem';
import { useThemeColors } from '../../theme/ThemeContext';
import type { ActionsListProps } from './types';

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
  const { colors, isDark } = useThemeColors();
  const iconColor = colors.text.secondary;

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
              color={completed ? (isDark ? '#34d399' : '#059669') : iconColor}
              size={iconSizes.medium}
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
          icon={<Brain color={colors.text.inverse} size={iconSizes.medium} strokeWidth={2} />}
          label='Mental Boost'
          subtitle='Visualize success & strengthen motivation'
          onPress={onMentalBoost}
        />
        <ActionItem
          showChevron
          icon={<Calendar color={iconColor} size={iconSizes.medium} strokeWidth={2} />}
          label='View Calendar'
          onPress={onViewCalendar}
        />

        {onViewDetails ? <ActionItem
            showChevron
            icon={<FileText color={iconColor} size={iconSizes.medium} strokeWidth={2} />}
            label='View Details'
            subtitle='Stats, why, vision board'
            onPress={onViewDetails}
          /> : null}
        <View
          className='my-2 h-px'
          style={{ backgroundColor: colors.border }}
        />
        <ActionItem
          icon={<Edit3 color={iconColor} size={iconSizes.medium} strokeWidth={2} />}
          label='Edit Habit'
          onPress={onEdit}
        />

        <ActionItem
          icon={<Pause color={iconColor} size={iconSizes.medium} strokeWidth={2} />}
          label='Pause Habit'
          subtitle='Hide from daily list'
          onPress={onPause}
        />

        <ActionItem
          destructive
          icon={<Trash2 color={isDark ? '#fca5a5' : '#ef4444'} size={iconSizes.medium} strokeWidth={2} />}
          label='Delete Habit'
          subtitle='This cannot be undone'
          onPress={onDelete}
        />
      </View>

      <View className='h-4' />
    </ScrollView>
  );
};
