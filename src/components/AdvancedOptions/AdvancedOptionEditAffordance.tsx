/** Right-side "Edit ›" CTA pill rendered by AdvancedOptionRow; tints deeper when the row is pressed. */
import { Text, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { useThemeColors } from '@/theme/ThemeContext';
import { fontWeights } from '@/theme/typography';

interface AdvancedOptionEditAffordanceProps {
  pressed?: boolean;
}

export function AdvancedOptionEditAffordance({
  pressed = false,
}: AdvancedOptionEditAffordanceProps) {
  const { colors } = useThemeColors();
  const bg = pressed ? colors.primary[300] : colors.primary[100];
  const fg = colors.primary[700];
  return (
    <View
      className='flex-row items-center gap-1.5 rounded-full px-3.5 py-2'
      style={{
        backgroundColor: bg,
        borderWidth: 1,
        borderColor: colors.primary[300],
      }}
    >
      <Text
        style={{
          fontSize: 13,
          fontWeight: fontWeights.semibold,
          color: fg,
          letterSpacing: 0.3,
        }}
      >
        Edit
      </Text>
      <ChevronRight color={colors.primary[600]} size={16} strokeWidth={2.5} />
    </View>
  );
}
