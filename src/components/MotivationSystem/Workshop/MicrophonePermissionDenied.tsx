/**
 * MicrophonePermissionDenied Component
 * Displays a user-friendly message when microphone permission is denied
 *
 * Provides:
 * - Clear explanation of why microphone is needed
 * - "Try Again" button for temporary denial (user can still be asked again)
 * - "Open Settings" button for permanent denial (user selected "Don't ask again" on Android)
 * - Visual indicator with consistent styling
 *
 * Story: Handle microphone permission denial gracefully
 */

import React, { useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { MicOff, Settings, RefreshCw, AlertCircle } from 'lucide-react-native';
import { clsx } from 'clsx';
import * as Haptics from 'expo-haptics';
import { SPRING_BUTTON } from '../../animations';

export interface MicrophonePermissionDeniedProps {
  /** Whether the user can be asked again for permission (false if "Don't ask again" was selected) */
  canAskAgain: boolean;
  /** Callback when user taps "Try Again" */
  onTryAgain: () => void;
  /** Callback when user taps "Open Settings" */
  onOpenSettings: () => void;
  /** Whether to show a compact version */
  compact?: boolean;
  /** Custom error message to display */
  errorMessage?: string;
  /** Whether to skip animations for accessibility */
  reduceMotion?: boolean;
}

/**
 * ActionButton subcomponent for consistent button styling
 */
function ActionButton({
  label,
  icon: Icon,
  onPress,
  variant = 'primary',
  accessibilityLabel,
  accessibilityHint,
}: {
  label: string;
  icon: React.ElementType;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  accessibilityLabel: string;
  accessibilityHint?: string;
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.96, SPRING_BUTTON);
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, SPRING_BUTTON);
  }, [scale]);

  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  }, [onPress]);

  const isPrimary = variant === 'primary';

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        accessibilityHint={accessibilityHint}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole='button'
        className={clsx(
          'flex-row items-center justify-center gap-2 rounded-xl px-4 py-3',
          isPrimary ? 'bg-teal-500' : 'bg-stone-100'
        )}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Icon
          className={isPrimary ? 'text-white' : 'text-stone-600'}
          size={18}
        />
        <Text
          className={clsx(
            'font-semibold',
            isPrimary ? 'text-white' : 'text-stone-700'
          )}
        >
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

/**
 * MicrophonePermissionDenied - Main component
 *
 * Displays when microphone permission has been denied, with appropriate
 * actions based on whether the user can be prompted again.
 */
export function MicrophonePermissionDenied({
  canAskAgain,
  onTryAgain,
  onOpenSettings,
  compact = false,
  errorMessage,
  reduceMotion = false,
}: MicrophonePermissionDeniedProps) {
  const defaultMessage = canAskAgain
    ? 'Microphone access is needed to record voice notes. Please grant permission to continue.'
    : 'Microphone access was denied. To record voice notes, please enable microphone permission in your device Settings.';

  return (
    <View
      accessibilityLabel='Microphone permission required'
      accessibilityRole='alert'
      className={clsx(
        'items-center rounded-2xl bg-rose-50',
        compact ? 'p-4' : 'p-6'
      )}
    >
      {/* Icon */}
      <View
        className={clsx(
          'items-center justify-center rounded-full bg-rose-100',
          compact ? 'mb-3 h-12 w-12' : 'mb-4 h-16 w-16'
        )}
      >
        <MicOff className='text-rose-500' size={compact ? 24 : 32} />
      </View>

      {/* Title */}
      <Text
        className={clsx(
          'mb-2 text-center font-semibold text-rose-700',
          compact ? 'text-base' : 'text-lg'
        )}
      >
        Microphone Access Required
      </Text>

      {/* Description */}
      <Text
        className={clsx(
          'mb-4 text-center text-rose-600',
          compact ? 'text-sm' : 'text-base'
        )}
      >
        {errorMessage || defaultMessage}
      </Text>

      {/* Why needed section (non-compact only) */}
      {!compact && (
        <View className='mb-4 flex-row items-start gap-2 rounded-lg bg-rose-100/50 p-3'>
          <AlertCircle className='mt-0.5 text-rose-500' size={16} />
          <Text className='flex-1 text-sm text-rose-600'>
            Voice notes help you capture motivation in your own voice — studies
            show audio has 40% higher emotional recall than text.
          </Text>
        </View>
      )}

      {/* Action buttons */}
      <View className={clsx('w-full gap-2', compact ? 'flex-row' : 'gap-3')}>
        {canAskAgain ? (
          /* Show "Try Again" when user can still be prompted */
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
          /* Show "Open Settings" when permission is permanently denied */
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

        {/* Secondary action: If canAskAgain, also show Settings as secondary option */}
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
    </View>
  );
}

export default MicrophonePermissionDenied;
