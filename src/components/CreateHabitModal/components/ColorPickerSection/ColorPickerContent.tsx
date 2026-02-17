/**
 * ColorPickerContent - Horizontal scrollable color palette
 * Displays 16 curated colors in two rows with horizontal scroll
 * Per spec: 44px swatches with 52px tap targets, organized in scrollable rows
 */

import { ScrollView, Text, View } from 'react-native';
import { useReduceMotion } from '../../../../hooks/useReduceMotion';
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
  const row1 = colors.slice(0, 8);  // First 8 colors
  const row2 = colors.slice(8);     // Remaining 8 colors

  const renderRow = (rowColors: string[], testId: string) => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 4 }}
      testID={testId}
    >
      <View style={{ flexDirection: 'row', gap: 4 }}>
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
    </ScrollView>
  );

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
      <View className='mb-2'>{renderRow(row1, 'color-picker-row-1')}</View>
      {renderRow(row2, 'color-picker-row-2')}
      {onCustomPress && (
        <View className='mt-3 items-center'>
          <CustomColorButton onPress={onCustomPress} />
        </View>
      )}
    </View>
  );
};
