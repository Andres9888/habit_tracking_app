/* eslint-disable max-lines */
/**
 * UnsavedChangesAlert Component
 * Custom styled modal for confirming discard of unsaved changes
 */
import { View, Text, Pressable } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { AlertTriangle } from 'lucide-react-native';
import { Modal } from '../Modal';
import { useThemeColors } from '../../theme/ThemeContext';
import { VARIANT_STYLES } from './constants';
import type { UnsavedChangesAlertProps } from './types';
import { triggerHaptic } from '@/utils/haptics';

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
  const { colors } = useThemeColors();
  const styles = VARIANT_STYLES[variant];

  const handleDiscard = () => {
    triggerHaptic('heavy');
    onDiscard();
  };

  const handleKeepEditing = () => {
    triggerHaptic('tap');
    onKeepEditing();
  };

  const truncatedPreview =
    contentPreview && contentPreview.length > previewMaxLength
      ? `${contentPreview.slice(0, previewMaxLength)}...`
      : contentPreview;

  return (
    <Modal
      accessibilityViewIsModal
      backdropOpacity={0.6}
      variant='centerAlert'
      visible={visible}
      onClose={onKeepEditing}
    >
      <View className='items-center'>
        <Animated.View
          className={`mb-4 rounded-full ${styles.iconBg} p-3`}
          entering={FadeIn.delay(100).duration(200)}
        >
          <AlertTriangle color={styles.iconColor} size={28} />
        </Animated.View>

        <Text
          className='mb-2 text-center text-xl font-bold'
          style={{ color: colors.text.primary }}
        >
          {title}
        </Text>
        <Text
          className='mb-4 text-center text-base'
          style={{ color: colors.text.secondary }}
        >
          {message}
        </Text>

        {truncatedPreview ? <View
            className={`mb-4 w-full rounded-lg border ${styles.previewBorder} ${styles.previewBg} p-3`}
          >
            <Text className='mb-1 text-xs font-medium' style={{ color: colors.text.tertiary }}>
              Your unsaved changes:
            </Text>
            <Text
              className='text-sm italic'
              numberOfLines={3}
              style={{ color: colors.text.secondary }}
            >
              "{truncatedPreview}"
            </Text>
          </View> : null}

        <View className='mt-2 w-full gap-3'>
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

export default UnsavedChangesAlert;
