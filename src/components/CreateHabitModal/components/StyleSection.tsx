/**
 * StyleSection - Color picker section for habit customization.
 */

import { useCallback } from 'react';
import { Text, View, Keyboard } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';
import { AnimatedColorButton } from './AnimatedColorButton';
import { borderRadius } from '../../../theme/spacing';

interface StyleSectionProps {
  colors: readonly string[];
  onSelectColor: (color: string) => void;
  selectedColor: string;
  disabled?: boolean;
}

export const StyleSection = ({
  colors,
  onSelectColor,
  selectedColor,
  disabled = false,
}: StyleSectionProps) => {
  const { colors: themeColors } = useThemeColors();

  const handleColorSelect = useCallback(
    (color: string) => {
      if (disabled) return;
      Keyboard.dismiss();
      onSelectColor(color);
    },
    [onSelectColor, disabled]
  );

  const colorRows = [];
  for (let i = 0; i < colors.length; i += 8) {
    colorRows.push(colors.slice(i, i + 8));
  }

  return (
    <View
      className='mb-6 rounded-2xl bg-white p-4'
      pointerEvents={disabled ? 'none' : 'auto'}
      style={{ opacity: disabled ? 0.4 : 1 }}
    >
      <Text className='mb-3 text-sm font-bold' style={{ color: themeColors.text.primary }}>Color</Text>
      <View>
        {colorRows.map((row, rowIndex) => (
          <View
            key={`color-row-${rowIndex}`}
            className='mb-2 flex-row justify-between'
          >
            {row.map((color) => (
              <AnimatedColorButton
                key={color}
                accessibilityLabel={`Select color ${color}`}
                isSelected={selectedColor === color}
                style={{
                  alignItems: 'center',
                  backgroundColor: color,
                  borderColor:
                    selectedColor === color ? '#292524' : 'transparent',
                  borderRadius: borderRadius.full,
                  borderWidth: selectedColor === color ? 3 : 0,
                  height: 36,
                  justifyContent: 'center',
                  width: 36,
                }}
                onPress={() => handleColorSelect(color)}
              >
                {selectedColor === color ? <Text className='text-xs font-bold text-white'>✓</Text> : null}
              </AnimatedColorButton>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

export default StyleSection;
