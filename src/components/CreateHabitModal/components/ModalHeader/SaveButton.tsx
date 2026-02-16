/**
 * Save button with validation shake animation
 * Dark-mode aware: uses emerald for active state, muted for disabled
 */
import { Animated, Text } from 'react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { useThemeColors } from '../../../../theme/ThemeContext';
import STRINGS from '../../../../constants/strings';

interface SaveButtonProps {
  isEditMode: boolean;
  canSave: boolean;
  onSave: () => void;
  onInvalidSave: () => void;
  shakeValue: Animated.Value;
}

export const SaveButton = ({
  isEditMode,
  canSave,
  onSave,
  onInvalidSave,
  shakeValue,
}: SaveButtonProps) => {
  const { isDark } = useThemeColors();

  return (
    <Animated.View
      style={{
        transform: [{ translateX: shakeValue }],
      }}
    >
      <AnimatedPressable
        accessibilityHint={canSave ? '' : 'Enter a habit name first'}
        accessibilityLabel={
          isEditMode ? 'Save habit changes' : STRINGS.CREATE_HABIT.createAction
        }
        accessibilityRole='button'
        accessibilityState={{ disabled: !canSave }}
        className='h-11 items-center justify-center rounded-full px-6'
        disableAnimation={!canSave}
        style={{
          backgroundColor: canSave
            ? '#059669'
            : isDark
              ? '#57534e'
              : '#a8a29e',
        }}
        onPress={canSave ? onSave : onInvalidSave}
      >
        <Text className='text-[15px] font-semibold text-white'>
          {isEditMode
            ? STRINGS.CREATE_HABIT.save
            : STRINGS.CREATE_HABIT.createAction}
        </Text>
      </AnimatedPressable>
    </Animated.View>
  );
};
