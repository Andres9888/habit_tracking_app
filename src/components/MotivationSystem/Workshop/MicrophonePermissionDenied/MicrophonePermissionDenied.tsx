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
import { useThemeColors } from '@/theme/ThemeContext';
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
  const { colors } = useThemeColors();
  const message =
    errorMessage || (canAskAgain ? MESSAGES.canAskAgain : MESSAGES.permanent);

  return (
    <View
      accessibilityLabel='Microphone permission required'
      accessibilityRole='alert'
      className={clsx(
        'items-center rounded-2xl',
        compact ? 'p-4' : 'p-6'
      )}
      style={{ backgroundColor: colors.status.errorLight }}
    >
      <View
        className={clsx(
          'items-center justify-center rounded-full',
          compact ? 'mb-3 h-12 w-12' : 'mb-4 h-16 w-16'
        )}
        style={{ backgroundColor: colors.status.errorLight }}
      >
        <MicOff color={colors.status.error} size={compact ? 24 : 32} />
      </View>

      <Text
        className={clsx(
          'mb-2 text-center font-semibold',
          compact ? 'text-base' : 'text-lg'
        )}
        style={{ color: colors.status.errorText }}
      >
        Microphone Access Required
      </Text>

      <Text
        className={clsx(
          'mb-4 text-center',
          compact ? 'text-sm' : 'text-base'
        )}
        style={{ color: colors.status.error }}
      >
        {message}
      </Text>

      {compact ? null : <View className='mb-4 flex-row items-start gap-2 rounded-lg p-3' style={{ backgroundColor: colors.status.errorLight }}>
          <AlertCircle className='mt-0.5' color={colors.status.error} size={16} />
          <Text className='flex-1 text-sm' style={{ color: colors.status.error }}>
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
