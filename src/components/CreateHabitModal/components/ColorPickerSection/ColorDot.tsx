/**
 * Single 26px colour dot for the one-row palette (spec §2).
 * Selected = 2px primary-500 ring with a 2px gap, drawn as an absolute overlay
 * so ten cells still fit a 327pt row (iPhone SE/mini) without shifting.
 */
import { memo, useCallback } from 'react';
import { AccessibilityInfo, Keyboard, Pressable, View } from 'react-native';
import useHapticFeedback from '../../../../hooks/useHapticFeedback';
import { borderRadius } from '../../../../theme/spacing';
import { getColorName } from '../../constants';
import { useThemeColors } from '@/theme/ThemeContext';

const DOT = 26;
/** Ring = dot + 2px gap + 2px stroke each side; overlaid so it never widens the cell. */
const RING = DOT + 8;

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
        flex: 1,
        justifyContent: 'center',
        minHeight: 44,
      }}
      testID={`color-swatch-${color.replace('#', '')}`}
      onPress={handlePress}
    >
      <View
        style={{
          backgroundColor: color,
          borderRadius: borderRadius.full,
          height: DOT,
          width: DOT,
        }}
      />
      <View
        pointerEvents='none'
        style={{
          borderColor: isSelected ? themeColors.primary[500] : 'transparent',
          borderRadius: borderRadius.full,
          borderWidth: 2,
          height: RING,
          position: 'absolute',
          width: RING,
        }}
      />
    </Pressable>
  );
};

export const ColorDot = memo(ColorDotComponent);
