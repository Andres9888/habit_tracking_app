/**
 * ClearIcon Component
 *
 * X icon for clear button in text input.
 */

import { View } from 'react-native';

import { useThemeColors } from '@/theme/ThemeContext';

export function ClearIcon() {
  const { colors, isDark } = useThemeColors();
  const bgColor = isDark ? colors.gray[300] : colors.gray[200];
  const lineColor = isDark ? colors.gray[500] : colors.gray[400];

  return (
    <View
      style={{
        alignItems: 'center',
        backgroundColor: bgColor,
        borderRadius: 12,
        height: 20,
        justifyContent: 'center',
        width: 20,
      }}
    >
      <View
        style={{
          backgroundColor: lineColor,
          height: 2,
          position: 'absolute',
          transform: [{ rotate: '45deg' }],
          width: 10,
        }}
      />
      <View
        style={{
          backgroundColor: lineColor,
          height: 2,
          position: 'absolute',
          transform: [{ rotate: '-45deg' }],
          width: 10,
        }}
      />
    </View>
  );
}
