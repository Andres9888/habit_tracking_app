/**
 * ScheduleFooter Component
 * Save and cancel buttons for schedule configuration
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Check, BellOff } from 'lucide-react-native';
import { clsx } from 'clsx';

interface ScheduleFooterProps {
  isEnabled: boolean;
  isSaving: boolean;
  hasExistingSchedule: boolean;
  onSave: () => void;
  onCancel: () => void;
}

export function ScheduleFooter({
  isEnabled,
  isSaving,
  hasExistingSchedule,
  onSave,
  onCancel,
}: ScheduleFooterProps) {
  const isDisabled = isSaving || (!isEnabled && !hasExistingSchedule);

  return (
    <View className='border-t border-stone-100 px-4 pb-8 pt-4'>
      <Pressable
        accessibilityLabel={
          isEnabled ? 'Save schedule' : 'Disable scheduled delivery'
        }
        accessibilityRole='button'
        accessibilityState={{ disabled: isDisabled }}
        className={clsx(
          'flex-row items-center justify-center gap-2 rounded-xl py-4',
          isSaving
            ? 'bg-stone-200'
            : isEnabled
              ? 'bg-amber-500'
              : hasExistingSchedule
                ? 'bg-rose-500'
                : 'bg-stone-200'
        )}
        disabled={isDisabled}
        onPress={isEnabled ? onSave : onCancel}
      >
        {isEnabled ? (
          <>
            <Check
              className={isSaving ? 'text-stone-400' : 'text-white'}
              size={20}
            />
            <Text
              className={clsx(
                'text-base font-semibold',
                isSaving ? 'text-stone-400' : 'text-white'
              )}
            >
              {isSaving ? 'Saving...' : 'Save Schedule'}
            </Text>
          </>
        ) : hasExistingSchedule ? (
          <>
            <BellOff className='text-white' size={20} />
            <Text className='text-base font-semibold text-white'>
              Remove Schedule
            </Text>
          </>
        ) : (
          <Text className='text-base font-semibold text-stone-400'>
            Enable to save
          </Text>
        )}
      </Pressable>

      {hasExistingSchedule && isEnabled && (
        <Pressable
          accessibilityLabel='Remove schedule'
          className='mt-3 flex-row items-center justify-center gap-2 py-2'
          onPress={onCancel}
        >
          <BellOff className='text-rose-500' size={16} />
          <Text className='text-sm font-medium text-rose-500'>
            Remove Schedule
          </Text>
        </Pressable>
      )}
    </View>
  );
}

export default ScheduleFooter;
