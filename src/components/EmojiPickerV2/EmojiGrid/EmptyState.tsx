import { Text } from 'react-native';
import { Search } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme/ThemeContext';

import { styles } from './styles';
import { iconSizes } from '@/theme/iconSizes';

/**
 * Empty state shown when no emojis match search
 */
export function EmptyState() {
  const { colors } = useThemeColors();

  return (
    <Animated.View entering={FadeIn.duration(250)} style={styles.emptyState}>
      <Search color={colors.text.tertiary} size={iconSizes.xxl} />
      <Text style={[styles.emptyStateTitle, { color: colors.text.primary }]}>
        No emojis found
      </Text>
      <Text
        style={[styles.emptyStateSubtitle, { color: colors.text.tertiary }]}
      >
        Try a different search term
      </Text>
    </Animated.View>
  );
}
