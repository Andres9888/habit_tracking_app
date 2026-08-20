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
  /** Inner hole of the ring; label and numeral must stay inside. */
  maxWidth: number;
}

export function HeroDialCenter({
  levelLabel,
  maxWidth,
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
        paddingHorizontal: 6,
        position: 'absolute',
        right: 0,
        top: 0,
      }}
    >
      <Text
        style={{
          color: textColor,
          fontFamily: fontFamilies.primary.display,
          fontSize: 28,
          fontWeight: fontWeights.medium,
          letterSpacing: -0.5,
          lineHeight: 30,
        }}
      >
        {score}
      </Text>
      <Text
        adjustsFontSizeToFit
        minimumFontScale={0.65}
        numberOfLines={1}
        style={{
          color: mutedColor,
          fontSize: 10,
          fontWeight: fontWeights.bold,
          letterSpacing: levelLabel.length > 8 ? 0.4 : 1.2,
          marginTop: 3,
          maxWidth,
          textAlign: 'center',
          textTransform: 'uppercase',
        }}
      >
        {levelLabel}
      </Text>
    </View>
  );
}
