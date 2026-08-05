/**
 * Empty state shown when no habits exist for a given day.
 * Migrated to canonical EmptyState primitive (compact, with icon backplate).
 */

import { ClipboardList } from 'lucide-react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import { iconSizes } from '@/theme/iconSizes';
import { borderRadius } from '@/theme/spacing';
import { EmptyState as CanonicalEmptyState } from '../../EmptyState/EmptyState';

export function EmptyState() {
  const { colors } = useThemeColors();

  return (
    <CanonicalEmptyState
      variant='noResults'
      size='compact'
      icon={
        <ClipboardList color={colors.text.tertiary} size={iconSizes.xl} strokeWidth={1.5} />
      }
      iconBackplate={{
        alignItems: 'center',
        backgroundColor: colors.gray[100],
        borderRadius: borderRadius.medium,
        height: 56,
        justifyContent: 'center',
        shadowColor: colors.text.primary,
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        width: 56,
      }}
      headline='No Habits Yet'
      description='Create your first habit to start tracking'
      hideCTA
    />
  );
}
