/** Smallest-version guidance under the toggle while a miss is still unanswered. */
import { Text, View } from 'react-native';
import { useInsightPalette } from '../../insightPalette';

export function HeroRecoveryHint({ hint }: { hint: string }) {
  const palette = useInsightPalette();

  return (
    <View
      accessible
      accessibilityLabel={`Smallest version. ${hint}`}
      accessibilityRole='summary'
    >
      <Text
        style={{
          color: palette.ctaGreen,
          fontSize: 11,
          fontWeight: '600',
          textAlign: 'center',
        }}
      >
        Smallest version
      </Text>
      <Text
        numberOfLines={2}
        style={{
          color: palette.textTertiary,
          fontSize: 11,
          lineHeight: 14,
          textAlign: 'center',
        }}
      >
        {hint}
      </Text>
    </View>
  );
}
