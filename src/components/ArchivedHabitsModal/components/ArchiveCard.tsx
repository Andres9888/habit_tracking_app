import { Text, View } from 'react-native';
import { useThemeColors } from '@/theme';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';
import { getStrengthInfo, getRelativeTime } from '../utils';
import type { ArchivedHabit } from '../types';
import { StatColumn, Divider, MotivationQuote } from './ArchiveCardParts';

interface ArchiveCardProps {
  habit: ArchivedHabit;
}

export function ArchiveCard({ habit }: ArchiveCardProps) {
  const { colors, isDark } = useThemeColors();
  const strength = Math.round((habit.strength ?? 0) * 100);
  const strengthInfo = getStrengthInfo(strength, isDark);
  const archiveDate = habit.archivedAt ?? habit._creationTime;
  const motivationText = habit.identity || habit.why;

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.border,
        padding: spacing.xl,
        alignItems: 'center',
        minHeight: 360,
      }}
    >
      <Text style={{ fontSize: 64, marginBottom: spacing.md }}>
        {habit.icon ?? '📌'}
      </Text>
      <Text
        style={{
          ...typography.heading2,
          color: colors.text.primary,
          textAlign: 'center',
          marginBottom: spacing.xs,
        }}
      >
        {habit.name}
      </Text>
      <Text
        style={{
          ...typography.bodySmall,
          color: colors.text.tertiary,
          marginBottom: spacing.lg,
        }}
      >
        Archived {getRelativeTime(archiveDate)}
      </Text>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          gap: spacing.lg,
          marginBottom: spacing.lg,
        }}
      >
        <StatColumn
          value={`${strength}%`}
          label={`${strengthInfo.emoji} ${strengthInfo.label}`}
          color={colors.text.primary}
        />
        <Divider color={colors.border} />
        <StatColumn
          value={String(habit.currentStreak ?? 0)}
          label="day streak"
          color={colors.text.primary}
        />
        <Divider color={colors.border} />
        <StatColumn
          value={String(habit.totalCompletions ?? 0)}
          label="sessions"
          color={colors.text.primary}
        />
      </View>

      {motivationText ? (
        <MotivationQuote isDark={isDark} text={motivationText} />
      ) : null}
    </View>
  );
}
