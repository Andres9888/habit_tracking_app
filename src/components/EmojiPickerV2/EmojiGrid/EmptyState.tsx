import { Text } from 'react-native';
import { Search } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme/ThemeContext';

import { useThemeColors } from '../../../theme';
import { typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';

/**
 * Empty state shown when no emojis match search
 * Dark mode aware via useThemeColors
 */
export function EmptyState() {
  const { colors } = useThemeColors();

  return (
    <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center', paddingVertical: 40 }}>
      <Search color={colors.gray[400]} size={48} />
      <Text style={{
        color: colors.text.primary,
        fontSize: typography.body.fontSize,
        fontWeight: '500',
        marginTop: spacing.md,
      }}>
        No emojis found
      </Text>
      <Text style={{
        color: colors.text.secondary,
        fontSize: typography.bodySmall.fontSize,
        marginTop: spacing.xs,
      }}>
        Try a different search term
      </Text>
    </View>
  );
}
