import { Text, View } from 'react-native';
import { Check, Minus } from 'lucide-react-native';
import { borderRadius, shadows } from '../../../../theme/spacing';
import { fontWeights } from '../../../../theme/typography';
import { useInsightPalette } from '../../insightPalette';

interface DayStatusCardProps {
  done: boolean;
  subtitle: string;
  title: string;
}

export function DayStatusCard({ done, subtitle, title }: DayStatusCardProps) {
  const palette = useInsightPalette();
  const Icon = done ? Check : Minus;

  return (
    <View
      style={{
        alignItems: 'center',
        backgroundColor: palette.card,
        borderColor: palette.cardBorder,
        borderRadius: borderRadius.large,
        borderWidth: 1,
        flexDirection: 'row',
        gap: 14,
        padding: 16,
        ...shadows.subtle,
      }}
    >
      <View
        style={{
          alignItems: 'center',
          backgroundColor: done ? palette.green : palette.cellEmpty,
          borderRadius: borderRadius.full,
          height: 40,
          justifyContent: 'center',
          width: 40,
        }}
      >
        <Icon
          color={done ? palette.onGreen : palette.textTertiary}
          size={done ? 20 : 16}
          strokeWidth={2.6}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            color: palette.textPrimary,
            fontSize: 16,
            fontWeight: fontWeights.semibold,
          }}
        >
          {title}
        </Text>
        <Text
          style={{ color: palette.textSecondary, fontSize: 13, marginTop: 2 }}
        >
          {subtitle}
        </Text>
      </View>
    </View>
  );
}
