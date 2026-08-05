/** OneFixActions — accept / decline row under the "One fix to try" card. */
import { Pressable, Text, View } from 'react-native';
import { borderRadius } from '../../../../theme/spacing';
import { fontWeights } from '../../../../theme/typography';
import type { InsightPalette } from '../../insightPalette';

interface OneFixActionsProps {
  acceptLabel: string;
  palette: InsightPalette;
  onAccept: () => void;
  onDecline: () => void;
}

export function OneFixActions({
  acceptLabel,
  onAccept,
  onDecline,
  palette,
}: OneFixActionsProps) {
  return (
    <View style={{ flexDirection: 'row', gap: 8, marginTop: 16 }}>
      <Pressable
        accessibilityLabel={acceptLabel}
        accessibilityRole='button'
        style={{
          alignItems: 'center',
          backgroundColor: palette.ctaGreen,
          borderRadius: borderRadius.medium,
          flex: 1,
          justifyContent: 'center',
          minHeight: 44,
        }}
        onPress={onAccept}
      >
        <Text
          style={{
            color: palette.onGreen,
            fontSize: 13,
            fontWeight: fontWeights.bold,
          }}
        >
          {acceptLabel}
        </Text>
      </Pressable>
      <Pressable
        accessibilityLabel='Not for me'
        accessibilityRole='button'
        style={{
          alignItems: 'center',
          borderColor: palette.cardBorder,
          borderRadius: borderRadius.medium,
          borderWidth: 1,
          flex: 1,
          justifyContent: 'center',
          minHeight: 44,
        }}
        onPress={onDecline}
      >
        <Text
          style={{
            color: palette.textTertiary,
            fontSize: 13,
            fontWeight: fontWeights.semibold,
          }}
        >
          Not for me
        </Text>
      </Pressable>
    </View>
  );
}
