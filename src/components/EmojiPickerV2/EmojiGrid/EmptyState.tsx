/**
 * EmojiPicker EmptyState — shown when no emojis match search.
 * Migrated to canonical primitive (compact, lucide search icon).
 */
import { Search } from 'lucide-react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import { iconSizes } from '@/theme/iconSizes';
import { EmptyState as CanonicalEmptyState } from '../../EmptyState/EmptyState';

export function EmptyState() {
  const { colors } = useThemeColors();

  return (
    <CanonicalEmptyState
      variant='noResults'
      size='compact'
      icon={<Search color={colors.text.tertiary} size={iconSizes.xxl} />}
      headline='No emojis found'
      description='Try a different search term'
      hideCTA
    />
  );
}
