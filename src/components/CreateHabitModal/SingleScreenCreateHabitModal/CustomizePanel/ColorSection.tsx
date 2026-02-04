/**
 * ColorSection - Color swatches for customize panel
 *
 * Per spec:
 * - Color swatches: 5 options, 40×40px, 12px gap
 * - Selection indicated by border
 */

import { memo, useCallback } from 'react';
import { Keyboard, Pressable, Text, View } from 'react-native';
import useHapticFeedback from '../../../../hooks/useHapticFeedback';
import { COLORS, CUSTOMIZE_COLORS, SPACING, TYPOGRAPHY } from '../constants';

interface ColorSectionProps {
  onSelect: (color: string) => void;
  selectedColor: string;
}

function ColorSectionComponent({ onSelect, selectedColor }: ColorSectionProps) {
  const { triggerSelection } = useHapticFeedback();

  const handlePress = useCallback(
    (color: string) => {
      Keyboard.dismiss();
      triggerSelection();
      onSelect(color);
    },
    [onSelect, triggerSelection]
  );

  return (
    <View className='mb-4'>
      <Text
        style={{
          color: COLORS.mutedText,
          fontSize: TYPOGRAPHY.caption.fontSize,
          marginBottom: SPACING.sm,
        }}
      >
        Color
      </Text>

      <View className='flex-row' style={{ gap: 12 }}>
        {CUSTOMIZE_COLORS.map((color) => {
          const isSelected = selectedColor === color;
          return (
            <Pressable
              key={color}
              accessibilityLabel={`Select ${color} color`}
              accessibilityRole='button'
              accessibilityState={{ selected: isSelected }}
              style={{
                backgroundColor: color,
                borderColor: COLORS.secondary,
                borderRadius: 20,
                borderWidth: isSelected ? 3 : 0,
                height: 40,
                width: 40,
              }}
              onPress={() => handlePress(color)}
            />
          );
        })}
      </View>
    </View>
  );
}

export const ColorSection = memo(ColorSectionComponent);
