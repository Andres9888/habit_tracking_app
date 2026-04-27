import { Text, View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';

interface SolutionRowProps {
  /** Outcome line (bold, primary). */
  outcome: string;
  /** Mechanic line (small, supporting). */
  mechanic: string;
  /** Echoed pain (small, italic, struck through). */
  pain: string;
  isFirst?: boolean;
}

export function SolutionRow({ outcome, mechanic, pain, isFirst }: SolutionRowProps) {
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
          fontStyle: 'italic',
          lineHeight: 16,
          marginBottom: 6,
          opacity: 0.7,
          textDecorationLine: 'line-through',
        }}
      >
        &ldquo;{pain}&rdquo;
      </Text>
      <Text
        style={{
          color: colors.text.primary,
          fontSize: 17,
          fontWeight: '800',
          letterSpacing: -0.3,
          lineHeight: 22,
        }}
      >
        {outcome}
      </Text>
      <Text
        style={{
          color: colors.text.secondary,
          fontSize: 13,
          lineHeight: 18,
          marginTop: 4,
        }}
      >
        {mechanic}
      </Text>
    </View>
  );
}
