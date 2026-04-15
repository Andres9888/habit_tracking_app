import { View } from 'react-native';
import { useThemeColors } from '@/theme';
import { spacing } from '@/theme/spacing';

interface ProgressDotsProps {
  total: number;
  current: number;
}

export function ProgressDots({ total, current }: ProgressDotsProps) {
  const { colors } = useThemeColors();

  if (total <= 1) return null;

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        gap: spacing.sm,
        paddingVertical: spacing.md,
      }}
    >
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          style={{
            width: i === current ? 10 : 8,
            height: i === current ? 10 : 8,
            borderRadius: 5,
            backgroundColor: i === current ? colors.primary : colors.border,
            opacity: i < current ? 0.4 : 1,
          }}
        />
      ))}
    </View>
  );
}
