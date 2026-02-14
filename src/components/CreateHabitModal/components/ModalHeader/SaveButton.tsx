/**
 * Save button with validation shake animation
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
  const { colors, isDark } = useThemeColors();

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
        style={{
          backgroundColor: canSave
            ? (isDark ? colors.gray[800] : colors.gray[800])
            : colors.gray[400],
        }}
        disableAnimation={!canSave}
        onPress={canSave ? onSave : onInvalidSave}
      >
        <Text className='text-sm font-semibold' style={{ color: colors.text.inverse }}>
          {STRINGS.CREATE_HABIT.save}
        </Text>
      </AnimatedPressable>
    </Animated.View>
  );
};
