/**
 * Save button with validation shake animation.
 * Dark-mode aware: emerald fill for active state, dimmed when disabled,
 * spinner + "Saving…" while a save is in flight.
 */
import { useMemo } from 'react';
import { ActivityIndicator, Animated } from 'react-native';
import ReAnimated from 'react-native-reanimated';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { useThemeColors } from '../../../../theme/ThemeContext';
import STRINGS from '../../../../constants/strings';
import { useSaveButtonAnimatedStyle } from './useSaveButtonAnimatedStyle';

interface SaveButtonProps {
  isEditMode: boolean;
  canSave: boolean;
  /** True while the save mutation is in flight (shows spinner, blocks taps) */
  isSaving?: boolean;
  onSave: () => void;
  onInvalidSave: () => void;
  shakeValue: Animated.Value;
}

export const SaveButton = ({
  isEditMode,
  canSave,
  isSaving = false,
  onSave,
  onInvalidSave,
  shakeValue,
}: SaveButtonProps) => {
  const { colors } = useThemeColors();
  // Stable palette: keeps the worklets from rebuilding every render.
  const palette = useMemo(
    () => ({
      disabledBg: colors.border,
      disabledLabel: colors.text.tertiary,
      enabledBg: colors.primary[600],
      enabledLabel: colors.text.inverse,
    }),
    [colors]
  );
  const { containerStyle, labelStyle } = useSaveButtonAnimatedStyle(
    canSave,
    palette
  );
  const label = isSaving
    ? STRINGS.CREATE_HABIT.saving
    : isEditMode
      ? STRINGS.CREATE_HABIT.save
      : STRINGS.CREATE_HABIT.createAction;

  const handlePress = isSaving ? () => {} : canSave ? onSave : onInvalidSave;

  return (
    <Animated.View style={{ transform: [{ translateX: shakeValue }] }}>
      <AnimatedPressable
        accessibilityHint={canSave ? '' : 'Enter a habit name first'}
        accessibilityLabel={
          isEditMode ? 'Save habit changes' : STRINGS.CREATE_HABIT.createAction
        }
        accessibilityRole='button'
        accessibilityState={{ busy: isSaving, disabled: !canSave || isSaving }}
        className='h-11 flex-row items-center justify-center gap-2 rounded-full px-6'
        disableAnimation={!canSave || isSaving}
        style={containerStyle}
        onPress={handlePress}
      >
        {isSaving ? (
          <ActivityIndicator color={colors.text.inverse} size='small' />
        ) : null}
        <ReAnimated.Text className='text-base font-semibold' style={labelStyle}>
          {label}
        </ReAnimated.Text>
      </AnimatedPressable>
    </Animated.View>
  );
};
