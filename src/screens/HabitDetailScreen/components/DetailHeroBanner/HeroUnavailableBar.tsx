/** Inert stand-in for the check-in toggle on paused / unscheduled days. */
import { Text, View } from 'react-native';
import { useInsightPalette } from '../../insightPalette';

export function HeroUnavailableBar({ label }: { label: string }) {
  const palette = useInsightPalette();

  return (
    <View
      accessibilityLabel={label}
      accessibilityRole='text'
      style={{
        alignItems: 'center',
        backgroundColor: palette.cellFuture,
        borderColor: palette.cardBorder,
        borderRadius: 17,
        borderWidth: 1,
        height: 56,
        justifyContent: 'center',
      }}
    >
      <Text
        style={{
          color: palette.textSecondary,
          fontSize: 15,
          fontWeight: '600',
        }}
      >
        {label}
      </Text>
    </View>
  );
}
