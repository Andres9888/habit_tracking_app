/**
 * ColorPickerContent - predefined palette split across two rows
 * Per spec: 36×36px visual, 48×48px tap, centered rows
 */

import { Text, View } from 'react-native';
import { useReduceMotion } from '../../../../hooks/useReduceMotion';
import { useThemeColors } from '../../../../theme/ThemeContext';
import STRINGS from '../../../../constants/strings';
import { ColorButton } from './ColorButton';
import { CustomColorButton } from './CustomColorButton';
import type { ColorPickerSectionProps } from './types';

export const ColorPickerContent = ({
  colors,
  selectedColor,
  onSelectColor,
  onCustomPress,
  hideLabel = false,
}: ColorPickerSectionProps) => {
  const reduceMotion = useReduceMotion();
  const { colors: themeColors } = useThemeColors();
  const row1 = colors.slice(0, 6);
  const row2 = colors.slice(6);

  const renderRow = (rowColors: string[], testId: string) => (
    <View
      style={{ flexDirection: 'row', gap: 4, justifyContent: 'center' }}
      testID={testId}
    >
      {rowColors.map((color) => (
        <ColorButton
          key={color}
          color={color}
          isSelected={selectedColor === color}
          reduceMotion={reduceMotion}
          onSelect={onSelectColor}
        />
      ))}
    </View>
  );

  return (
    <View className='mb-4'>
      {hideLabel ? null : <Text
          accessibilityRole='text'
          className='mb-3 text-sm font-semibold uppercase'
          style={{ letterSpacing: 0.5, color: themeColors.text.tertiary }}
        >
          {STRINGS.CREATE_HABIT.colorLabel}
        </Text>}
      <View className='mb-2'>{renderRow(row1, 'color-picker-row-1')}</View>
      {renderRow(row2, 'color-picker-row-2')}
      {onCustomPress ? <View className='mt-3 items-center'>
          <CustomColorButton onPress={onCustomPress} />
        </View> : null}
    </View>
  );
};
