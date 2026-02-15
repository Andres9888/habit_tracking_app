/**
 * AffirmationItem Component
 * Individual affirmation display with edit/delete/schedule actions
 */

import React from 'react';
import { View, Text } from 'react-native';

import { MessageSquareQuote } from 'lucide-react-native';
import { clsx } from 'clsx';

import type { AffirmationData } from '../AffirmationsSection.types';
import { AffirmationItemActions } from './AffirmationItemActions';
import { ScheduleIndicator } from './ScheduleIndicator';
import { TYPE_CONFIG } from '../AffirmationsSection.constants';
import { getNextAffirmationDeliveryRelativeTime } from '../../../../../utils/notifications';

interface AffirmationItemProps {
  affirmation: AffirmationData;
  onEdit: () => void;
  onDelete: () => void;
  onSchedule?: () => void;
  isPremium: boolean;
}

export function AffirmationItem({
  affirmation,
  onEdit,
  onDelete,
  onSchedule,
  isPremium,
}: AffirmationItemProps) {
  const typeConfig = affirmation.type ? TYPE_CONFIG[affirmation.type] : null;
  const TypeIcon = typeConfig?.icon;
  const hasSchedule =
    affirmation.isScheduleEnabled && affirmation.scheduledTime;

  // Get next delivery time preview
  const nextDelivery =
    hasSchedule && affirmation.scheduledTime && affirmation.frequency
      ? getNextAffirmationDeliveryRelativeTime(
          affirmation.scheduledTime,
          affirmation.frequency,
          affirmation.daysOfWeek
        )
      : null;

  return (
    <View className='rounded-xl bg-amber-50 p-3'>
      <View className='flex-row items-start gap-3'>
        {/* Type badge or default icon */}
        <View
          className={clsx(
            'h-8 w-8 items-center justify-center rounded-full',
            typeConfig ? typeConfig.bgColor : 'bg-amber-100'
          )}
        >
          {TypeIcon ? (
            <TypeIcon className={typeConfig?.textColor} size={14} />
          ) : (
            <MessageSquareQuote className='text-amber-600' size={14} />
          )}
        </View>

        {/* Content */}
        <View className='flex-1'>
          <Text className='text-sm text-stone-700'>"{affirmation.text}"</Text>
          {typeConfig && (
            <Text className={clsx('mt-1 text-xs', typeConfig.textColor)}>
              {typeConfig.label}
            </Text>
          )}
        </View>

        {/* Actions */}
        <AffirmationItemActions
          hasSchedule={!!hasSchedule}
          isPremium={isPremium}
          scheduledTime={affirmation.scheduledTime}
          onDelete={onDelete}
          onEdit={onEdit}
          onSchedule={onSchedule}
        />
      </View>

      {/* Schedule indicator */}
      {hasSchedule && nextDelivery && (
        <ScheduleIndicator
          daysOfWeek={affirmation.daysOfWeek}
          frequency={affirmation.frequency}
          nextDelivery={nextDelivery}
        />
      )}
    </View>
  );
}
