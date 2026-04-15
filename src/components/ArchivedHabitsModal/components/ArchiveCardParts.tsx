import { Text, View } from 'react-native';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';

export function StatColumn({
  value,
  label,
  color,
}: {
  value: string;
  label: string;
  color: string;
}) {
  return (
    <View style={{ alignItems: 'center' }}>
      <Text
        style={{
          fontFamily: 'JetBrains Mono',
          fontSize: 28,
          fontWeight: '700',
          color,
        }}
      >
        {value}
      </Text>
      <Text
        style={{ ...typography.caption, color, opacity: 0.6, marginTop: 2 }}
      >
        {label}
      </Text>
    </View>
  );
}

export function Divider({ color }: { color: string }) {
  return (
    <View style={{ width: 1, backgroundColor: color, opacity: 0.3 }} />
  );
}

export function MotivationQuote({
  text,
  isDark,
}: {
  text: string;
  isDark: boolean;
}) {
  return (
    <View
      style={{
        alignSelf: 'stretch',
        backgroundColor: isDark ? 'rgba(234,88,12,0.1)' : '#FFF7ED',
        borderLeftWidth: 3,
        borderLeftColor: '#EA580C',
        borderRadius: 10,
        padding: spacing.md,
      }}
    >
      <Text
        style={{
          ...typography.bodySmall,
          color: isDark ? '#FDBA74' : '#7C2D12',
          fontStyle: 'italic',
          fontFamily: typography.displayLarge.fontFamily,
        }}
      >
        &ldquo;{text}&rdquo;
      </Text>
    </View>
  );
}
