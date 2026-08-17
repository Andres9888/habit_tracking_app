import type { ReactNode } from 'react';
import { View } from 'react-native';
import { borderRadius, shadows } from '../../../theme/spacing';
import { useInsightPalette } from '../insightPalette';

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
  return <View style={{ backgroundColor: palette.divider, height: 1 }} />;
}
