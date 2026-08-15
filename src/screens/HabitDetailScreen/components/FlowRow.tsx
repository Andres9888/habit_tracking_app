import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { borderRadius, shadows } from '../../../theme/spacing';
import { fontWeights } from '../../../theme/typography';
import { useInsightPalette } from '../insightPalette';

interface FlowRowProps {
  accessibilityHint?: string;
  onPress: () => void;
  subtitle: string;
  title: string;
}

export function FlowRow({
  accessibilityHint,
  onPress,
  subtitle,
  title,
}: FlowRowProps) {
  const palette = useInsightPalette();

  return (
    <Pressable
      accessibilityHint={accessibilityHint ?? `Opens ${title}`}
      accessibilityLabel={title}
      accessibilityRole='button'
      style={{
        alignItems: 'center',
        flexDirection: 'row',
        minHeight: 56,
        paddingHorizontal: 16,
        paddingVertical: 12,
      }}
      onPress={onPress}
    >
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
      <ChevronRight color={palette.textTertiary} size={18} strokeWidth={2.1} />
    </Pressable>
  );
}

export function FlowRowGroup({ children }: { children: ReactNode }) {
  const palette = useInsightPalette();

  return (
    <View
      style={{
        backgroundColor: palette.card,
        borderColor: palette.cardBorder,
        borderRadius: borderRadius.large,
        borderWidth: 1,
        overflow: 'hidden',
        ...shadows.subtle,
      }}
    >
      {children}
    </View>
  );
}

export function FlowDivider() {
  const palette = useInsightPalette();
  return (
    <View
      style={{ backgroundColor: palette.divider, height: 1, marginLeft: 16 }}
    />
  );
}
