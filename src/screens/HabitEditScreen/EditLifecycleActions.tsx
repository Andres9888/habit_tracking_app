import { Archive, Trash2 } from 'lucide-react-native';
import { Text, View } from 'react-native';
import { ActionItem } from '../../components/QuickActionsSheet/ActionItem';
import { iconSizes } from '../../theme/iconSizes';
import { spacing } from '../../theme/spacing';
import { useThemeColors } from '../../theme/ThemeContext';
import { fontWeights } from '../../theme/typography';

interface EditLifecycleActionsProps {
  onArchive: () => void;
  onDelete: () => void;
}

/** Lifecycle actions live in Edit, away from the recommitment surface. */
export function EditLifecycleActions({
  onArchive,
  onDelete,
}: EditLifecycleActionsProps) {
  const { colors } = useThemeColors();

  return (
    <View
      style={{
        gap: spacing.sm,
        marginTop: spacing.xl,
        paddingHorizontal: spacing.lg,
      }}
    >
      <Text
        accessibilityRole='header'
        style={{
          color: colors.text.secondary,
          fontSize: 13,
          fontWeight: fontWeights.semibold,
          letterSpacing: 0.3,
          marginBottom: spacing.xs,
        }}
      >
        Manage habit
      </Text>
      <ActionItem
        icon={
          <Archive
            color={colors.text.secondary}
            size={iconSizes.medium}
            strokeWidth={2}
          />
        }
        label='Archive habit'
        subtitle='Hide from your daily list. Restore anytime from Settings.'
        onPress={onArchive}
      />
      <ActionItem
        destructive
        icon={
          <Trash2
            color={colors.status.error}
            size={iconSizes.medium}
            strokeWidth={2}
          />
        }
        label='Delete habit'
        subtitle='Permanently removes this habit and all its history.'
        onPress={onDelete}
      />
    </View>
  );
}
