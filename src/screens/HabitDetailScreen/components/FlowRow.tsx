import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { borderRadius, shadows } from '../../../theme/spacing';
import { fontWeights } from '../../../theme/typography';
import { useInsightPalette } from '../insightPalette';

interface FlowRowProps {
  accessibilityHint?: string;
  icon?: ReactNode;
  onPress: () => void;
  subtitle: string;
  title: string;
}

export function FlowRow({
  accessibilityHint,
  icon,
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
        gap: 13,
        minHeight: 60,
        paddingHorizontal: 15,
        paddingVertical: 10,
      }}
      onPress={onPress}
    >
      {icon ? (
        <View
          style={{
            alignItems: 'center',
            backgroundColor: palette.tileBg,
            borderRadius: 12,
            height: 40,
            justifyContent: 'center',
            width: 40,
          }}
        >
          {icon}
        </View>
      ) : null}
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
    <View style={{ backgroundColor: palette.divider, height: 1 }} />
  );
}
