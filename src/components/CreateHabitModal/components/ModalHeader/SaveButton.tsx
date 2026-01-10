/**
 * Save button with validation shake animation
 */
import { Animated, Text, TouchableOpacity } from 'react-native';
import STRINGS from '../../../../constants/strings';
import { useButtonScale } from './useButtonScale';

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
  const { scale, handlePressIn, handlePressOut } = useButtonScale();

  return (
    <Animated.View
      style={{
        transform: [{ scale }, { translateX: shakeValue }],
      }}
    >
      <TouchableOpacity
        accessibilityHint={canSave ? '' : 'Enter a habit name first'}
        accessibilityLabel={
          isEditMode ? 'Save habit changes' : STRINGS.CREATE_HABIT.createAction
        }
        accessibilityRole='button'
        accessibilityState={{ disabled: !canSave }}
        className={`h-11 items-center justify-center rounded-full px-6 ${
          canSave ? 'bg-stone-800' : 'bg-stone-400'
        }`}
        onPress={canSave ? onSave : onInvalidSave}
        onPressIn={canSave ? handlePressIn : undefined}
        onPressOut={canSave ? handlePressOut : undefined}
      >
        <Text className='text-sm font-semibold text-white'>
          {STRINGS.CREATE_HABIT.save}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};
