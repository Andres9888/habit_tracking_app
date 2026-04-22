import { View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const { colors } = useThemeColors();
  const pct = total <= 1 ? 0 : Math.max(0, Math.min(1, (current - 1) / (total - 1)));

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ max: total, min: 0, now: current }}
      style={{
        backgroundColor: colors.border,
        borderRadius: 2,
        height: 3,
        marginHorizontal: 24,
        marginTop: 8,
        overflow: 'hidden',
      }}
    >
      <View
        style={{
          backgroundColor: colors.primary[600],
          borderRadius: 2,
          height: '100%',
          width: `${pct * 100}%`,
        }}
      />
    </View>
  );
}
