/**
 * Empty state shown when no emojis match search
 * Dark mode aware via useThemeColors
 */

import { View, Text } from 'react-native';
import { Search } from 'lucide-react-native';
import { useThemeColors } from '../../../theme';
import { styles } from './styles';

export function EmptyState() {
  const { colors } = useThemeColors();

  return (
    <View style={styles.emptyState}>
      <Search color={colors.text.secondary} size={48} />
      <Text style={[styles.emptyStateTitle, { color: colors.text.primary }]}>No emojis found</Text>
      <Text style={[styles.emptyStateSubtitle, { color: colors.text.secondary }]}>Try a different search term</Text>
    </View>
  );
}
