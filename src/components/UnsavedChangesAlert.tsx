/**
 * UnsavedChangesAlert Component
 * Custom styled modal for confirming discard of unsaved changes
 *
 * Part of Edge Case handling: Data Loss Prevention
 *
 * Uses the Modal component with 'centerAlert' variant for:
 * - Consistent styling with app design system
 * - Better accessibility support
 * - Animation consistency
 *
 * Can be used as an alternative to Alert.alert when:
 * - Custom styling is needed
 * - Additional context/preview is desired
 * - Platform-consistent appearance is preferred
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { AlertTriangle, X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Modal } from './Modal';

interface UnsavedChangesAlertProps {
  /** Whether the alert is visible */
  visible: boolean;
  /** Callback when user wants to discard changes */
  onDiscard: () => void;
  /** Callback when user wants to keep editing */
  onKeepEditing: () => void;
  /** Title for the alert (default: "Discard Changes?") */
  title?: string;
  /** Message describing what will be lost */
  message?: string;
  /** Label for discard button (default: "Discard") */
  discardButtonLabel?: string;
  /** Label for keep editing button (default: "Keep Editing") */
  keepEditingButtonLabel?: string;
  /** Optional preview of the content that will be lost */
  contentPreview?: string;
  /** Maximum length for content preview (default: 100) */
  previewMaxLength?: number;
  /** Accent color variant */
  variant?: 'rose' | 'amber';
}

// Variant styles for visual customization
const VARIANT_STYLES = {
  amber: {
    discardBg: 'bg-amber-500',
    discardText: 'text-white',
    iconBg: 'bg-amber-100',
    iconColor: '#d97706',
    previewBg: 'bg-amber-50',
    previewBorder: 'border-amber-200',
  },
  rose: {
    discardBg: 'bg-rose-500',
    discardText: 'text-white',
    iconBg: 'bg-rose-100',
    iconColor: '#e11d48',
    previewBg: 'bg-rose-50',
    previewBorder: 'border-rose-200',
  },
};

export function UnsavedChangesAlert({
  visible,
  onDiscard,
  onKeepEditing,
  title = 'Discard Changes?',
  message = 'You have unsaved changes that will be lost.',
  discardButtonLabel = 'Discard',
  keepEditingButtonLabel = 'Keep Editing',
  contentPreview,
  previewMaxLength = 100,
  variant = 'rose',
}: UnsavedChangesAlertProps) {
  const styles = VARIANT_STYLES[variant];

  const handleDiscard = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onDiscard();
  };

  const handleKeepEditing = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onKeepEditing();
  };

  // Truncate preview if needed
  const truncatedPreview =
    contentPreview && contentPreview.length > previewMaxLength
      ? `${contentPreview.slice(0, previewMaxLength)}...`
      : contentPreview;

  return (
    <Modal
      backdropOpacity={0.6}
      disableBackdropClose={false}
      variant='centerAlert'
      visible={visible}
      onClose={onKeepEditing}
    >
      <View className='items-center'>
        {/* Icon */}
        <Animated.View
          className={`mb-4 rounded-full ${styles.iconBg} p-3`}
          entering={FadeIn.delay(100).duration(200)}
        >
          <AlertTriangle color={styles.iconColor} size={28} />
        </Animated.View>

        {/* Title */}
        <Text className='mb-2 text-center text-xl font-bold text-stone-800'>
          {title}
        </Text>

        {/* Message */}
        <Text className='mb-4 text-center text-base text-stone-600'>
          {message}
        </Text>

        {/* Content Preview (optional) */}
        {truncatedPreview && (
          <View
            className={`mb-4 w-full rounded-lg border ${styles.previewBorder} ${styles.previewBg} p-3`}
          >
            <Text className='mb-1 text-xs font-medium text-stone-500'>
              Your unsaved changes:
            </Text>
            <Text className='text-sm italic text-stone-700' numberOfLines={3}>
              "{truncatedPreview}"
            </Text>
          </View>
        )}

        {/* Buttons */}
        <View className='mt-2 w-full gap-3'>
          {/* Discard Button */}
          <Pressable
            accessibilityHint='Discards your unsaved changes'
            accessibilityLabel={discardButtonLabel}
            accessibilityRole='button'
            className={`w-full items-center rounded-xl ${styles.discardBg} py-3.5 active:opacity-80`}
            onPress={handleDiscard}
          >
            <Text className={`text-base font-semibold ${styles.discardText}`}>
              {discardButtonLabel}
            </Text>
          </Pressable>

          {/* Keep Editing Button */}
          <Pressable
            accessibilityHint='Returns to editing without discarding changes'
            accessibilityLabel={keepEditingButtonLabel}
            accessibilityRole='button'
            className='w-full items-center rounded-xl bg-stone-100 py-3.5 active:bg-stone-200'
            onPress={handleKeepEditing}
          >
            <Text className='text-base font-semibold text-stone-700'>
              {keepEditingButtonLabel}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

/**
 * Hook to manage UnsavedChangesAlert state
 * Provides a simpler API for showing/hiding the alert
 */
export function useUnsavedChangesAlert() {
  const [isVisible, setIsVisible] = React.useState(false);
  const [pendingCallback, setPendingCallback] = React.useState<
    (() => void) | null
  >(null);

  const show = React.useCallback((onConfirmDiscard: () => void) => {
    setPendingCallback(() => onConfirmDiscard);
    setIsVisible(true);
  }, []);

  const hide = React.useCallback(() => {
    setIsVisible(false);
    setPendingCallback(null);
  }, []);

  const handleDiscard = React.useCallback(() => {
    pendingCallback?.();
    hide();
  }, [pendingCallback, hide]);

  const handleKeepEditing = React.useCallback(() => {
    hide();
  }, [hide]);

  return {
    handleDiscard,
    handleKeepEditing,
    hide,
    isVisible,
    show,
  };
}

export default UnsavedChangesAlert;
