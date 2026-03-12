/**
 * MicrophonePermissionDenied Component
 * Displays a user-friendly message when microphone permission is denied
 *
 * Story: Handle microphone permission denial gracefully
 */

import React from 'react';
import { View, Text } from 'react-native';
import { MicOff, AlertCircle } from 'lucide-react-native';
import { clsx } from 'clsx';
import { PermissionActionButtons } from './PermissionActionButtons';
import type { MicrophonePermissionDeniedProps } from './types';

const MESSAGES = {
  canAskAgain:
    'Microphone access is needed to record voice notes. Please grant permission to continue.',
  permanent:
    'Microphone access was denied. To record voice notes, please enable microphone permission in your device Settings.',
  science:
    'Voice notes help you capture motivation in your own voice — studies show audio has 40% higher emotional recall than text.',
};

export function MicrophonePermissionDenied({
  canAskAgain,
  onTryAgain,
  onOpenSettings,
  compact = false,
  errorMessage,
}: MicrophonePermissionDeniedProps) {
  const message =
    errorMessage || (canAskAgain ? MESSAGES.canAskAgain : MESSAGES.permanent);

  return (
    <View
      accessibilityLabel='Microphone permission required'
      accessibilityRole='alert'
      className={clsx(
        'items-center rounded-2xl bg-rose-50',
        compact ? 'p-4' : 'p-6'
      )}
    >
      <View
        className={clsx(
          'items-center justify-center rounded-full bg-rose-100',
          compact ? 'mb-3 h-12 w-12' : 'mb-4 h-16 w-16'
        )}
      >
        <MicOff className='text-rose-500' size={compact ? 24 : 32} />
      </View>

      <Text
        className={clsx(
          'mb-2 text-center font-semibold text-rose-700',
          compact ? 'text-base' : 'text-lg'
        )}
      >
        Microphone Access Required
      </Text>

      <Text
        className={clsx(
          'mb-4 text-center text-rose-600',
          compact ? 'text-sm' : 'text-base'
        )}
      >
        {message}
      </Text>

      {compact ? null : <View className='mb-4 flex-row items-start gap-2 rounded-lg bg-rose-100/50 p-3'>
          <AlertCircle className='mt-0.5 text-rose-500' size={16} />
          <Text className='flex-1 text-sm text-rose-600'>
            {MESSAGES.science}
          </Text>
        </View>}

      <PermissionActionButtons
        canAskAgain={canAskAgain}
        compact={compact}
        onOpenSettings={onOpenSettings}
        onTryAgain={onTryAgain}
      />
    </View>
  );
}

export default MicrophonePermissionDenied;
