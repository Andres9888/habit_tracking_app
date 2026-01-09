import { Text, View } from 'react-native';
import { useReduceMotion } from '../../../../hooks/useReduceMotion';
import STRINGS from '../../../../constants/strings';
import { ColorButton } from './ColorButton';
import { CustomColorButton } from './CustomColorButton';
import type { ColorPickerSectionProps } from './types';

/**
 * V8 Color Picker - 12 colors with wrapping
 * Responsive sizing to fit iPhone 14/15 Pro (390px width)
 * V11 Task 8: Reduced motion support
 * V12: Increased touch targets (44px swatches in 52px containers)
 */
export const ColorPickerContent = ({
  colors,
  selectedColor,
  onSelectColor,
  onCustomPress,
  hideLabel = false,
}: ColorPickerSectionProps) => {
  const reduceMotion = useReduceMotion();

  return (
    <View className='mb-6'>
      {!hideLabel && (
        <Text
          accessibilityRole='text'
          className='mb-3 text-[13px] font-semibold uppercase text-stone-500'
          style={{ letterSpacing: 0.5 }}
        >
          {STRINGS.CREATE_HABIT.colorLabel}
        </Text>
      )}
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
        testID='color-picker-row'
      >
        {colors.map((color) => (
          <ColorButton
            key={color}
            color={color}
            isSelected={selectedColor === color}
            reduceMotion={reduceMotion}
            onSelect={onSelectColor}
          />
        ))}
        {onCustomPress && <CustomColorButton onPress={onCustomPress} />}
      </View>
    </View>
  );
};
