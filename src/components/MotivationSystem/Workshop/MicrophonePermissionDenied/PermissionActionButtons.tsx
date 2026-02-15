/**
 * PermissionActionButtons - Action buttons for permission states
 */

import React from 'react';
import { View } from 'react-native';

import { Settings, RefreshCw } from 'lucide-react-native';
import { clsx } from 'clsx';

import { ActionButton } from './ActionButton';

interface PermissionActionButtonsProps {
  canAskAgain: boolean;
  compact: boolean;
  onTryAgain: () => void;
  onOpenSettings: () => void;
}

export function PermissionActionButtons({
  canAskAgain,
  compact,
  onTryAgain,
  onOpenSettings,
}: PermissionActionButtonsProps) {
  return (
    <View className={clsx('w-full gap-2', compact ? 'flex-row' : 'gap-3')}>
      {canAskAgain ? (
        <View className={compact ? 'flex-1' : ''}>
          <ActionButton
            accessibilityHint='Will prompt you to allow microphone access'
            accessibilityLabel='Try again to grant microphone permission'
            icon={RefreshCw}
            label='Try Again'
            variant='primary'
            onPress={onTryAgain}
          />
        </View>
      ) : (
        <View className={compact ? 'flex-1' : ''}>
          <ActionButton
            accessibilityHint='Opens your device settings to enable microphone permission'
            accessibilityLabel='Open Settings to enable microphone'
            icon={Settings}
            label='Open Settings'
            variant='primary'
            onPress={onOpenSettings}
          />
        </View>
      )}

      {canAskAgain && !compact && (
        <ActionButton
          accessibilityHint='Opens your device settings to enable microphone permission'
          accessibilityLabel='Open Settings'
          icon={Settings}
          label='Open Settings Instead'
          variant='secondary'
          onPress={onOpenSettings}
        />
      )}
    </View>
  );
}
