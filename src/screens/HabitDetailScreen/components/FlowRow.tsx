import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { fontFamilies, fontWeights } from '../../../theme/typography';
import { useInsightPalette } from '../insightPalette';

interface FlowRowProps {
  accessibilityHint?: string;
  icon?: ReactNode;
  /** Unwrapped leading mark (History entries). Prefer `icon` for sage tiles. */
  leading?: ReactNode;
  onPress: () => void;
  subtitle: string;
  subtitleItalic?: boolean;
  title: string;
}
export function FlowRow({
  accessibilityHint,
  icon,
  leading,
  onPress,
  subtitle,
  subtitleItalic = false,
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
      {leading}
      {icon && !leading ? (
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
          style={{
            color: palette.textTertiary,
            fontFamily: subtitleItalic
              ? fontFamilies.primary.display
              : undefined,
            fontSize: 13,
            fontStyle: subtitleItalic ? 'italic' : undefined,
            marginTop: 2,
          }}
        >
          {subtitle}
        </Text>
      </View>
      <ChevronRight color={palette.textTertiary} size={18} strokeWidth={2.1} />
    </Pressable>
  );
}

export { FlowDivider, FlowRowGroup } from './FlowRowGroup';
