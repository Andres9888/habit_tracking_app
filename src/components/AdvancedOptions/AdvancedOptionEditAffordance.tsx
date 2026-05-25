/** Right-side compact "Edit ›" pill rendered by AdvancedOptionRow; tints green when the row is pressed. */
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
  const bg = pressed ? colors.primary[100] : colors.gray[50];
  const fg = pressed ? colors.primary[700] : colors.text.secondary;
  return (
    <View
      className='flex-row items-center gap-1 rounded-full px-2.5 py-1'
      style={{ backgroundColor: bg }}
    >
      <Text
        style={{
          fontSize: 11,
          fontWeight: fontWeights.semibold,
          color: fg,
          letterSpacing: 0.2,
        }}
      >
        Edit
      </Text>
      <ChevronRight color={colors.primary[600]} size={12} strokeWidth={2.5} />
    </View>
  );
}
