/**
 * One 36px colour swatch in a 48px-tall grid cell (spec §2).
 * Selected = 3px primary-500 ring with a 3px gap in the sheet surface colour,
 * drawn as nested padding so the ring is real pixels (never a scaled view).
 */
import { memo, useCallback } from 'react';
import { AccessibilityInfo, Keyboard, Pressable, View } from 'react-native';
import useHapticFeedback from '../../../../hooks/useHapticFeedback';
import { borderRadius } from '../../../../theme/spacing';
import { getColorName } from '../../constants';
import { useThemeColors } from '@/theme/ThemeContext';

const SWATCH = 36;
const CELL_HEIGHT = 48;
const RING = 3;

interface ColorDotProps {
  color: string;
  isSelected: boolean;
  cellWidth: number;
  onSelect: (color: string) => void;
}

const ColorDotComponent = ({
  color,
  isSelected,
  cellWidth,
  onSelect,
}: ColorDotProps) => {
  const { triggerSelection } = useHapticFeedback();
  const { colors: themeColors } = useThemeColors();
  const colorName = getColorName(color);

  const handlePress = useCallback(() => {
    Keyboard.dismiss();
    triggerSelection();
    onSelect(color);
    AccessibilityInfo.announceForAccessibility(`Selected ${colorName} color`);
  }, [color, colorName, onSelect, triggerSelection]);

  return (
    <Pressable
      accessibilityLabel={`${colorName} color${isSelected ? ', selected' : ''}`}
      accessibilityRole='button'
      accessibilityState={{ selected: isSelected }}
      style={{
        alignItems: 'center',
        height: CELL_HEIGHT,
        justifyContent: 'center',
        width: cellWidth,
      }}
      testID={`color-swatch-${color.replace('#', '')}`}
      onPress={handlePress}
    >
      <View
        style={{
          backgroundColor: isSelected ? themeColors.primary[500] : 'transparent',
          borderRadius: borderRadius.full,
          padding: RING,
        }}
      >
        <View
          style={{
            backgroundColor: isSelected ? themeColors.surface : 'transparent',
            borderRadius: borderRadius.full,
            padding: RING,
          }}
        >
          <View
            style={{
              backgroundColor: color,
              borderRadius: borderRadius.full,
              height: SWATCH,
              width: SWATCH,
            }}
          />
        </View>
      </View>
    </Pressable>
  );
};

export const ColorDot = memo(ColorDotComponent);
