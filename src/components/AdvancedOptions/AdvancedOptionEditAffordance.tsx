/** Right-side "EDIT" pill used by AdvancedOptionRow to signal tap-to-customize. */
import { Text, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { useThemeColors } from '@/theme/ThemeContext';
import { fontWeights } from '@/theme/typography';

export function AdvancedOptionEditAffordance() {
  const { colors } = useThemeColors();
  return (
    <View
      className='flex-row items-center gap-0.5 rounded-full px-2 py-1'
      style={{ backgroundColor: colors.primary[100] }}
    >
      <Text
        style={{
          fontSize: 11,
          fontWeight: fontWeights.semibold,
          color: colors.primary[700],
          letterSpacing: 0.3,
        }}
      >
        EDIT
      </Text>
      <ChevronRight
        color={colors.primary[700]}
        size={iconSizes.small}
        strokeWidth={2.5}
      />
    </View>
  );
}
