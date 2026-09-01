/**
 * The next-step row inside the verdict card: one tinted line that turns the
 * verdict into something to do this month.
 *
 * Not tappable — the audit trail for the claim is the "…are where it slips"
 * row further down the page, so this is a summary, not a door. Tone follows the
 * delta chip above it: green when the month is up, amber when it has slipped.
 */
import { ArrowRight } from 'lucide-react-native';
import { Text, View } from 'react-native';
import { fontFamilies } from '../../../../theme/typography';
import type { InsightPalette } from '../../insightPalette';
import type { Verdict } from './verdict';

interface VerdictNextStepProps {
  palette: InsightPalette;
  text: string;
  verdict: Verdict;
}

export function VerdictNextStep({
  palette,
  text,
  verdict,
}: VerdictNextStepProps) {
  const up = verdict.deltaPct >= 0;

  return (
    <View
      accessible
      accessibilityLabel={text}
      accessibilityRole='summary'
      style={{
        alignItems: 'flex-start',
        backgroundColor: up ? palette.greenWash : palette.amberBg,
        borderColor: up ? palette.greenTint : palette.amberBorder,
        borderRadius: 13,
        borderWidth: 1,
        flexDirection: 'row',
        gap: 9,
        marginTop: 12,
        padding: 12,
      }}
    >
      <View
        style={{
          alignItems: 'center',
          backgroundColor: up ? palette.ctaGreen : palette.amberBar,
          borderRadius: 10,
          height: 20,
          justifyContent: 'center',
          marginTop: 1,
          width: 20,
        }}
      >
        <ArrowRight color={palette.onGreen} size={12} strokeWidth={2.5} />
      </View>
      <Text
        style={{
          color: palette.recoveryInk,
          flex: 1,
          fontFamily: fontFamilies.primary.text,
          fontSize: 13,
          lineHeight: 19.5,
        }}
      >
        {text}
      </Text>
    </View>
  );
}
