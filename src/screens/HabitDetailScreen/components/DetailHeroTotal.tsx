import { Text, View } from 'react-native';
import type { SemanticColors } from '../../../theme/darkColors';
import { fontFamilies, fontWeights } from '../../../theme/typography';

export function DetailHeroTotal({
  colors,
  totalCompletions,
}: {
  colors: SemanticColors;
  totalCompletions: number;
}) {
  return (
    <View style={{ alignItems: 'flex-end' }}>
      <Text
        style={{
          color: colors.text.primary,
          fontFamily: fontFamilies.primary.display,
          fontSize: 22,
          fontWeight: fontWeights.bold,
          lineHeight: 22,
        }}
      >
        {totalCompletions}
      </Text>
      <Text
        style={{
          color: colors.text.tertiary,
          fontSize: 10.5,
          fontWeight: fontWeights.semibold,
          letterSpacing: 0.8,
          marginTop: 2,
          textTransform: 'uppercase',
        }}
      >
        total
      </Text>
    </View>
  );
}
