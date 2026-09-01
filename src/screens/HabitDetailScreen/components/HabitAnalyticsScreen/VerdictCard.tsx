/**
 * VerdictCard — the answer to "am I getting better?", in words, before any
 * chart. The delta chip and the sparkline are the proof, not the answer.
 *
 * Hidden rather than faked when the habit has too little history, matching
 * NoticingPlaceholder: a verdict from two weeks of data is a guess.
 */
import { Text, View } from 'react-native';
import { fontFamilies, fontWeights } from '../../../../theme/typography';
import type { InsightPalette } from '../../insightPalette';
import { CardEyebrow } from '../CardEyebrow';
import { InsightCard } from '../InsightCard';
import { Sparkline } from './Sparkline';
import type { Verdict } from './verdict';
import { VerdictNextStep } from './VerdictNextStep';

interface VerdictCardProps {
  /** Derived next step; absent when the data cannot state one honestly. */
  nextStep?: string | null;
  palette: InsightPalette;
  verdict: Verdict;
}

function DeltaChip({
  deltaPct,
  palette,
}: {
  deltaPct: number;
  palette: InsightPalette;
}) {
  const up = deltaPct >= 0;
  const tone = up ? palette.ctaGreen : palette.amber;

  return (
    <View
      style={{
        backgroundColor: up ? palette.greenWash : palette.amberBg,
        borderRadius: 99,
        paddingHorizontal: 10,
        paddingVertical: 5,
      }}
    >
      <Text
        style={{
          color: tone,
          fontFamily: fontFamilies.primary.text,
          fontSize: 12.5,
          fontWeight: fontWeights.bold,
        }}
      >
        {`${up ? '↑' : '↓'} ${Math.abs(deltaPct)} pts`}
      </Text>
    </View>
  );
}

export function VerdictCard({ nextStep, palette, verdict }: VerdictCardProps) {
  return (
    <InsightCard palette={palette}>
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <View style={{ flex: 1 }}>
          <CardEyebrow label='Where you stand' palette={palette} />
        </View>
        <DeltaChip deltaPct={verdict.deltaPct} palette={palette} />
      </View>
      <Text
        style={{
          color: palette.textPrimary,
          fontFamily: fontFamilies.primary.display,
          fontSize: 21,
          lineHeight: 27,
          marginTop: 11,
        }}
      >
        {verdict.headline}
      </Text>
      <Text
        style={{
          color: palette.textSecondary,
          fontFamily: fontFamilies.primary.text,
          fontSize: 13.5,
          lineHeight: 20,
          marginTop: 7,
        }}
      >
        {verdict.body}
      </Text>
      {nextStep ? (
        <VerdictNextStep palette={palette} text={nextStep} verdict={verdict} />
      ) : null}
      <Sparkline
        bars={verdict.bars}
        labels={verdict.labels}
        palette={palette}
      />
    </InsightCard>
  );
}
