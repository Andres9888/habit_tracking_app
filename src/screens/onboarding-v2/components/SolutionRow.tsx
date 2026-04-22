import { Text, View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';

interface SolutionRowProps {
  fix: string;
  isFirst?: boolean;
  pain: string;
}

export function SolutionRow({ fix, isFirst, pain }: SolutionRowProps) {
  const { colors } = useThemeColors();

  return (
    <View
      style={{
        borderTopColor: colors.border,
        borderTopWidth: isFirst ? 0 : 1,
        paddingBottom: 14,
        paddingTop: isFirst ? 0 : 14,
      }}
    >
      <Text
        style={{
          color: colors.text.tertiary,
          fontSize: 12,
          lineHeight: 16,
          marginBottom: 4,
        }}
      >
        You said: {pain}
      </Text>
      <Text
        style={{
          color: colors.text.primary,
          fontSize: 15,
          fontWeight: '600',
          lineHeight: 20,
        }}
      >
        {fix}
      </Text>
    </View>
  );
}

