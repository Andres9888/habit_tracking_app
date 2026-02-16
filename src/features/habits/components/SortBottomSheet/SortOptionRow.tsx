import React, { memo, useCallback, useMemo } from 'react';
import { Check } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useHaptics } from '../../../../utils/haptics/useHaptics';
import { useThemeColors } from '../../../../theme/ThemeContext';
import {
  CHECK_ICON_SIZE,
  CHECK_ICON_STROKE_WIDTH,
  DARK_SURFACE_COLOR,
  SORT_OPTION_ICON_SIZE,
  SORT_OPTION_ICON_STROKE_WIDTH,
  WHITE_ICON_COLOR,
} from './constants';

interface SortOptionRowProps {
  /**
   * Lucide icon component to display
   */
  Icon: LucideIcon;
  /**
   * Gradient colors for the icon background [start, end]
   */
  iconBgColors: [string, string];
  /**
   * Main title text
   */
  title: string;
  /**
   * Description text below the title
   */
  description: string;
  /**
   * Whether this option is currently selected
   */
  selected: boolean;
  /**
   * Callback when this option is pressed
   */
  onPress: () => void;
}

/**
 * SortOptionRow - A single sort option in the detailed options list.
 */
function SortOptionRowComponent({
  Icon,
  iconBgColors,
  title,
  description,
  selected,
  onPress,
}: SortOptionRowProps) {
  const { colors: themeColors, isDark } = useThemeColors();
  const { trigger } = useHaptics();

  const handlePress = useCallback(() => {
    trigger('tap');
    onPress();
  }, [trigger, onPress]);

  const containerStyle = useMemo(() => ({
    backgroundColor: selected
      ? isDark
        ? DARK_SURFACE_COLOR
        : '#ecfdf5'
      : 'transparent',
    borderColor: selected ? themeColors.primary[300] : 'transparent',
    borderWidth: selected ? 1 : 0,
  }), [selected, isDark, themeColors.primary]);

  return (
    <Pressable
      accessibilityHint={`Select ${title} sort option`}
      accessibilityLabel={`${title}. ${description}`}
      accessibilityRole='radio'
      accessibilityState={{ checked: selected }}
      className='mb-1 flex-row items-center gap-3 rounded-xl px-3 py-3'
      style={containerStyle}
      onPress={handlePress}
    >
      <LinearGradient
        className='h-10 w-10 items-center justify-center rounded-xl'
        colors={iconBgColors}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
      >
        <Icon
          color={WHITE_ICON_COLOR}
          size={SORT_OPTION_ICON_SIZE}
          strokeWidth={SORT_OPTION_ICON_STROKE_WIDTH}
        />
      </LinearGradient>

      <View className='flex-1'>
        <Text
          className='text-[15px] font-medium'
          style={{ color: themeColors.text.primary }}
        >
          {title}
        </Text>
        <Text
          className='text-[13px] font-normal'
          style={{ color: themeColors.text.secondary }}
        >
          {description}
        </Text>
      </View>

      {selected && (
        <View
          className='h-6 w-6 items-center justify-center rounded-full'
          style={{ backgroundColor: themeColors.primary[500] }}
        >
          <Check
            color={WHITE_ICON_COLOR}
            size={CHECK_ICON_SIZE}
            strokeWidth={CHECK_ICON_STROKE_WIDTH}
          />
        </View>
      )}
    </Pressable>
  );
}

export const SortOptionRow = memo(SortOptionRowComponent);
export default SortOptionRow;
