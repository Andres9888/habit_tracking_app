import type { OneFixInsight } from '../../insights';
import { useInsightPalette } from '../../insightPalette';
import { WeekdayBars } from '../NoticingSection/WeekdayBars';
import { EvidenceSection } from './EvidenceSection';
import { EvidenceShell } from './EvidenceShell';
import { EvidenceStatStrip } from './EvidenceStatStrip';
import { oneFixHeadline, oneFixNextStep, oneFixProse } from './insightEvidence';

interface OneFixEvidenceProps {
  cue?: string;
  insight: OneFixInsight;
}

export function OneFixEvidence({ cue, insight }: OneFixEvidenceProps) {
  const palette = useInsightPalette();
  const others = insight.bars.filter(
    (bar) => bar.weekday !== insight.weakest.weekday && bar.scheduled > 0
  );
  const otherDone = others.reduce((sum, bar) => sum + bar.done, 0);
  const otherScheduled = others.reduce((sum, bar) => sum + bar.scheduled, 0);

  return (
    <EvidenceShell
      headline={oneFixHeadline(insight)}
      nextStep={oneFixNextStep(insight, cue)}
      prose={oneFixProse(insight)}
    >
      <EvidenceSection
        subtitle='Out of scheduled days in this window'
        title='Days logged by weekday'
      >
        <WeekdayBars
          bars={insight.bars}
          palette={palette}
          weakestWeekday={insight.weakest.weekday}
        />
      </EvidenceSection>
      <EvidenceStatStrip
        items={[
          {
            label: `${insight.weakest.plural} logged`,
            value: `${insight.weakest.done} / ${insight.weakest.scheduled}`,
          },
          {
            label: 'Other days logged',
            value: `${otherDone} / ${otherScheduled}`,
          },
        ]}
      />
    </EvidenceShell>
  );
}
