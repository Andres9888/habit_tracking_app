import type { ReactNode } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { spacing } from '../../../theme/spacing';
import { useInsightPalette } from '../insightPalette';

interface FlowPageProps {
  children: ReactNode;
  footnote?: string;
}

export function FlowPage({ children, footnote }: FlowPageProps) {
  const palette = useInsightPalette();

  return (
    <ScrollView
      className='flex-1'
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: palette.bandGradient[2] }}
    >
      <View style={{ gap: spacing.md, padding: 20, paddingBottom: 40 }}>
        {children}
        {footnote ? (
          <Text
            style={{
              color: palette.textTertiary,
              fontSize: 13,
              lineHeight: 19,
              paddingHorizontal: 4,
            }}
          >
            {footnote}
          </Text>
        ) : null}
      </View>
    </ScrollView>
  );
}
