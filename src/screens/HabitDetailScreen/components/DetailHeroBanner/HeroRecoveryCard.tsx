/**
 * HeroRecoveryCard — amber only lives here. Copy matches the full-flow mock.
 */
import { Text, View } from 'react-native';
import { RotateCcw } from 'lucide-react-native';
import { borderRadius } from '../../../../theme/spacing';
import { fontFamilies, fontWeights } from '../../../../theme/typography';
import type { InsightPalette } from '../../insightPalette';

interface HeroRecoveryCardProps {
  palette: InsightPalette;
}

export function HeroRecoveryCard({ palette }: HeroRecoveryCardProps) {
  return (
    <View
      accessibilityRole='summary'
      style={{
        alignItems: 'flex-start',
        backgroundColor: palette.amberBg,
        borderColor: palette.amberBorder,
        borderRadius: borderRadius.large,
        borderWidth: 1,
        flexDirection: 'row',
        gap: 12,
        paddingHorizontal: 16,
        paddingVertical: 15,
      }}
    >
      <View
        style={{
          alignItems: 'center',
          backgroundColor: palette.amberBorder,
          borderRadius: 12,
          height: 40,
          justifyContent: 'center',
          width: 40,
        }}
      >
        <RotateCcw color={palette.amber} size={21} strokeWidth={1.8} />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            color: palette.amber,
            fontSize: 11,
            fontWeight: fontWeights.bold,
            letterSpacing: 1.4,
            textTransform: 'uppercase',
          }}
        >
          Pick it back up
        </Text>
        <Text
          style={{
            color: palette.recoveryInk,
            fontFamily: fontFamilies.primary.display,
            fontSize: 16,
            lineHeight: 22,
            marginTop: 5,
          }}
        >
          Yesterday wasn’t logged. Start again with today’s two-minute version.
        </Text>
      </View>
    </View>
  );
}
