/**
 * HeroDialCenter — serif score over an uppercase level word, centred in the
 * strength dial.
 *
 * The shared `StrengthRing` renders its centre through `RingCenter`, which is
 * built around emoji / percentage / trend-arrow and can't produce this pairing —
 * which is the one reason HeroStrengthDial keeps its own markup.
 */
import { Text, View } from 'react-native';
import { fontFamilies, fontWeights } from '../../../../theme/typography';

interface HeroDialCenterProps {
  /** 0-100, already clamped and rounded. */
  score: number;
  levelLabel: string;
  textColor: string;
  mutedColor: string;
}

export function HeroDialCenter({
  levelLabel,
  mutedColor,
  score,
  textColor,
}: HeroDialCenterProps) {
  return (
    <View
      style={{
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
      }}
    >
      <Text
        style={{
          color: textColor,
          fontFamily: fontFamilies.primary.display,
          fontSize: 22,
          fontWeight: fontWeights.bold,
          lineHeight: 24,
        }}
      >
        {score}
      </Text>
      <Text
        numberOfLines={1}
        style={{
          color: mutedColor,
          fontSize: 9,
          letterSpacing: 0.9,
          marginTop: 3,
          textTransform: 'uppercase',
        }}
      >
        {levelLabel}
      </Text>
    </View>
  );
}
