import { View, Text } from 'react-native';
import { Search } from 'lucide-react-native';

import { styles } from './styles';

/**
 * Empty state shown when no emojis match search
 */
export function EmptyState() {
  return (
    <View style={styles.emptyState}>
      <Search color='#9ca3af' size={48} />
      <Text style={styles.emptyStateTitle}>No emojis found</Text>
      <Text style={styles.emptyStateSubtitle}>Try a different search term</Text>
    </View>
  );
}
