import { Text } from 'react-native';
import { Search } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme/ThemeContext';

import { styles } from './styles';
import type { SemanticColors } from '../../../theme/darkColors';

/**
 * Empty state shown when no emojis match search
 * Theme-aware with dark mode support
 */
export function EmptyState({ themeColors }: { themeColors?: SemanticColors }) {
  const iconColor = themeColors?.gray[400] ?? colors.gray[400];
  const titleColor = themeColors?.text.primary ?? colors.gray[900];
  const subtitleColor = themeColors?.gray[400] ?? colors.gray[400];

  return (
    <View style={styles.emptyState}>
      <Search color={iconColor} size={48} />
      <Text style={[styles.emptyStateTitle, { color: titleColor }]}>
        No emojis found
      </Text>
      <Text style={[styles.emptyStateSubtitle, { color: subtitleColor }]}>
        Try a different search term
      </Text>
    </View>
  );
}
