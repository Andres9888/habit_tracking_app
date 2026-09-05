/**
 * Single 26px colour dot for the one-row palette (spec §2).
 * Selected = 2px primary-500 ring with a 2px gap; the ring is always laid out
 * (transparent when unselected) so selecting never shifts the row.
 */
import { memo, useCallback } from 'react';
import { AccessibilityInfo, Keyboard, Pressable, View } from 'react-native';
import useHapticFeedback from '../../../../hooks/useHapticFeedback';
import { borderRadius } from '../../../../theme/spacing';
import { getColorName } from '../../constants';
import { useThemeColors } from '@/theme/ThemeContext';

const DOT = 26;

interface ColorDotProps {
  color: string;
  isSelected: boolean;
  onSelect: (color: string) => void;
}

const ColorDotComponent = ({ color, isSelected, onSelect }: ColorDotProps) => {
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
        justifyContent: 'center',
        minHeight: 44,
        paddingHorizontal: 2,
      }}
      testID={`color-swatch-${color.replace('#', '')}`}
      onPress={handlePress}
    >
      <View
        style={{
          borderColor: isSelected ? themeColors.primary[500] : 'transparent',
          borderRadius: borderRadius.full,
          borderWidth: 2,
          padding: 2,
        }}
      >
        <View
          style={{
            backgroundColor: color,
            borderRadius: borderRadius.full,
            height: DOT,
            width: DOT,
          }}
        />
      </View>
    </Pressable>
  );
};

export const ColorDot = memo(ColorDotComponent);
