/** DetailStatusPill — single completion-status chip for the hero (Chain Day). */
import { Text, View } from 'react-native';
import { borderRadius, spacing } from '../../../theme/spacing';
import { fontWeights, typography } from '../../../theme/typography';
import { withAlpha } from '../../../theme/colors';
import { useThemeColors } from '../../../theme';

interface Props {
  isCompletedToday: boolean;
}

export function DetailStatusPill({ isCompletedToday }: Props) {
  const { colors } = useThemeColors();
  const label = isCompletedToday ? 'Completed today' : 'Ready for today';
  const dotColor = colors.primary[600];

  return (
    <View
      accessibilityRole='text'
      className='mt-1 flex-row items-center self-start'
      style={{
        backgroundColor: isCompletedToday
          ? withAlpha(colors.primary[600], 0.12)
          : colors.surface,
        borderColor: isCompletedToday
          ? withAlpha(colors.primary[600], 0.3)
          : colors.border,
        borderRadius: borderRadius.full,
        borderWidth: 1,
        gap: spacing.xs + 2,
        paddingHorizontal: spacing.sm + 2,
        paddingVertical: spacing.xs,
      }}
    >
      <View
        style={{
          backgroundColor: dotColor,
          borderRadius: borderRadius.full,
          height: 7,
          width: 7,
        }}
      />
      <Text
        style={{
          ...typography.caption,
          color: isCompletedToday ? colors.primary[700] : colors.text.primary,
          fontWeight: fontWeights.semibold,
        }}
      >
        {label}
      </Text>
    </View>
  );
}
