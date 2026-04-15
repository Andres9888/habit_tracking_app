import { Text, View } from 'react-native';
import { useThemeColors } from '@/theme';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';
import { SummaryBadge, SummaryActions } from './SummaryParts';
import { PremiumBanner } from './PremiumBanner';

interface CompletionSummaryProps {
  restored: number;
  deleted: number;
  skipped: number;
  onReviewSkipped: () => void;
  onDone: () => void;
}

export function CompletionSummary({
  restored,
  deleted,
  skipped,
  onReviewSkipped,
  onDone,
}: CompletionSummaryProps) {
  const { isDark, colors } = useThemeColors();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
      }}
    >
      <Text style={{ fontSize: 48, marginBottom: spacing.lg }}>✅</Text>
      <Text
        style={{
          ...typography.heading2,
          color: colors.text.primary,
          textAlign: 'center',
          marginBottom: spacing.lg,
        }}
      >
        All done!
      </Text>

      <View style={{ flexDirection: 'row', gap: spacing.lg, marginBottom: spacing.xl }}>
        {restored > 0 && (
          <SummaryBadge
            count={restored} label="restored"
            bgColor={isDark ? 'rgba(5,150,105,0.15)' : '#ECFDF5'}
            textColor={isDark ? '#34D399' : '#047857'}
          />
        )}
        {deleted > 0 && (
          <SummaryBadge
            count={deleted} label="deleted"
            bgColor={isDark ? 'rgba(220,38,38,0.15)' : '#FEF2F2'}
            textColor={isDark ? '#FCA5A5' : '#DC2626'}
          />
        )}
        {skipped > 0 && (
          <SummaryBadge
            count={skipped} label="skipped"
            bgColor={isDark ? 'rgba(156,163,175,0.15)' : '#F3F4F6'}
            textColor={colors.text.secondary}
          />
        )}
      </View>

      <SummaryActions skipped={skipped} onReviewSkipped={onReviewSkipped} onDone={onDone} />
      <PremiumBanner />
    </View>
  );
}
