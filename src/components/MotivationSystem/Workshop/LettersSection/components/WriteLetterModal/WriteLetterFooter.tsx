/**
 * WriteLetterFooter Component
 * Modal footer with action buttons
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';

import { ChevronRight, Lock } from 'lucide-react-native';
import { clsx } from 'clsx';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { WriteLetterStep } from './WriteLetterModal.types';

interface WriteLetterFooterProps {
  step: WriteLetterStep;
  canProceed: boolean;
  canSave: boolean;
  isSaving: boolean;
  onNext: () => void;
  onSave: () => void;
}

export function WriteLetterFooter({
  step,
  canProceed,
  canSave,
  isSaving,
  onNext,
  onSave,
}: WriteLetterFooterProps) {
  const isWriteStep = step === 'write';
  const isDisabled = isWriteStep ? !canProceed : !canSave || isSaving;
  const isEnabled = isWriteStep ? canProceed : canSave && !isSaving;
  const insets = useSafeAreaInsets();

  return (
    <View className='border-t border-stone-100 px-4 pt-4' style={{ paddingBottom: Math.max(insets.bottom, 16) + 8 }}>
      {isWriteStep ? (
        <Pressable
          accessibilityLabel='Continue to schedule'
          accessibilityRole='button'
          accessibilityState={{ disabled: !canProceed }}
          className={clsx(
            'flex-row items-center justify-center gap-2 rounded-xl py-4',
            canProceed ? 'bg-violet-500' : 'bg-stone-200'
          )}
          disabled={!canProceed}
          onPress={onNext}
        >
          <Text
            className={clsx(
              'text-base font-semibold',
              canProceed ? 'text-white' : 'text-stone-400'
            )}
          >
            Continue
          </Text>
          <ChevronRight
            className={canProceed ? 'text-white' : 'text-stone-400'}
            size={18}
          />
        </Pressable>
      ) : (
        <Pressable
          accessibilityLabel='Save and lock letter'
          accessibilityRole='button'
          accessibilityState={{ disabled: isDisabled }}
          className={clsx(
            'flex-row items-center justify-center gap-2 rounded-xl py-4',
            isEnabled ? 'bg-violet-500' : 'bg-stone-200'
          )}
          disabled={isDisabled}
          onPress={onSave}
        >
          <Lock
            className={isEnabled ? 'text-white' : 'text-stone-400'}
            size={18}
          />
          <Text
            className={clsx(
              'text-base font-semibold',
              isEnabled ? 'text-white' : 'text-stone-400'
            )}
          >
            {isSaving ? 'Saving...' : 'Seal & Lock Letter'}
          </Text>
        </Pressable>
      )}
    </View>
  );
}
