import { Text } from 'react-native';
import { fontWeights } from '../../../theme/typography';
import { useInsightPalette } from '../insightPalette';

export function FlowSectionLabel({ children }: { children: string }) {
  const palette = useInsightPalette();

  return (
    <Text
      style={{
        color: palette.textTertiary,
        fontSize: 11,
        fontWeight: fontWeights.bold,
        letterSpacing: 1.2,
        marginBottom: 8,
        marginLeft: 4,
        textTransform: 'uppercase',
      }}
    >
      {children}
    </Text>
  );
}
