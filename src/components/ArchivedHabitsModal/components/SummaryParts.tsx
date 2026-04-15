import { Pressable, Text, View } from 'react-native';
import { useThemeColors } from '@/theme';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';

export function SummaryBadge({
  count,
  label,
  bgColor,
  textColor,
}: {
  count: number;
  label: string;
  bgColor: string;
  textColor: string;
}) {
  return (
    <View
      style={{
        alignItems: 'center',
        padding: spacing.md,
        backgroundColor: bgColor,
        borderRadius: 12,
        minWidth: 72,
      }}
    >
      <Text
        style={{
          fontFamily: 'JetBrains Mono',
          fontSize: 24,
          fontWeight: '700',
          color: textColor,
        }}
      >
        {count}
      </Text>
      <Text style={{ fontSize: 11, color: textColor }}>{label}</Text>
    </View>
  );
}

export function SummaryActions({
  skipped,
  onReviewSkipped,
  onDone,
}: {
  skipped: number;
  onReviewSkipped: () => void;
  onDone: () => void;
}) {
  const { colors } = useThemeColors();
  return (
    <View style={{ alignSelf: 'stretch', gap: spacing.sm }}>
      {skipped > 0 && (
        <Pressable
          accessibilityLabel="Review skipped habits"
          onPress={onReviewSkipped}
          style={{
            padding: spacing.base,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.card,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              ...typography.body,
              fontWeight: '600',
              color: colors.text.primary,
            }}
          >
            Review {skipped} Skipped
          </Text>
        </Pressable>
      )}
      <Pressable
        accessibilityLabel="Done"
        onPress={onDone}
        style={{
          padding: spacing.base,
          borderRadius: 12,
          backgroundColor: '#059669',
          alignItems: 'center',
        }}
      >
        <Text
          style={{ ...typography.body, fontWeight: '600', color: 'white' }}
        >
          Done
        </Text>
      </Pressable>
    </View>
  );
}
