/**
 * Search match highlight row for TemplateListCard.
 */

import { Text, View } from 'react-native';
import { Search } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { styles } from './TemplateListCard.styles';

interface CardMatchRowProps {
  matchReason: string;
}

export function CardMatchRow({ matchReason }: CardMatchRowProps) {
  const { colors } = useThemeColors();

  return (
    <View
      style={[styles.matchRow, { backgroundColor: `${colors.primary[600]}10` }]}
    >
      <Search
        color={colors.primary[700]}
        size={iconSizes.micro}
        strokeWidth={2.5}
      />
      <Text style={[styles.matchText, { color: colors.primary[700] }]}>
        {matchReason}
      </Text>
    </View>
  );
}
