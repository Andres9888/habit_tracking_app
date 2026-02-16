import { View } from 'react-native';
import { useThemeColors } from '../../../theme/ThemeContext';

interface HeatmapDotProps {
  isCompleted: boolean;
  isFuture: boolean;
}

export function HeatmapDot({ isCompleted, isFuture }: HeatmapDotProps) {
  const { colors, isDark } = useThemeColors();

  const backgroundColor = isFuture
    ? colors.gray[200]
    : isCompleted
      ? colors.primary[500]
      : isDark
        ? colors.gray[400]
        : colors.gray[300];

  return (
    <View
      className='h-3 w-3 rounded-full'
      style={{ backgroundColor }}
    />
  );
}
